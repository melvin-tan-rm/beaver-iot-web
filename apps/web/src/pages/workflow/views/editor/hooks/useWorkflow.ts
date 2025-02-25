import { useCallback } from 'react';
import { useReactFlow, getIncomers, getOutgoers, type IsValidConnection } from '@xyflow/react';
import { uniqBy, omit, cloneDeep, pick, isEmpty, isObject } from 'lodash-es';
import { useI18n, useStoreShallow } from '@milesight/shared/src/hooks';
import { toast } from '@milesight/shared/src/components';
import { basicNodeConfigs } from '@/pages/workflow/config';
import { entityTypeOptions } from '@/constants';
import { useEntityStore } from '@/components';
import useFlowStore from '../store';
import {
    PARALLEL_LIMIT,
    PARALLEL_DEPTH_LIMIT,
    NODE_MIN_NUMBER_LIMIT,
    ENTRY_NODE_NUMBER_LIMIT,
    DEFAULT_BOOLEAN_DATA_ENUMS,
} from '../constants';
import { genRefParamKey, isRefParamKey } from '../helper';
import { getParallelInfo } from './utils';

export type NodeParamType = {
    nodeId: ApiKey;
    nodeName?: string;
    nodeType?: WorkflowNodeType;
    nodeLabel?: string;
    outputs: {
        name: string;
        type?: EntityValueDataType;
        typeLabel?: string;
        key: string;
        enums?: {
            key: string;
            label?: string;
        }[];
    }[];
};

export type FlattenNodeParamType = {
    nodeId: ApiKey;
    nodeName?: string;
    nodeType?: WorkflowNodeType;
    valueName: string;
    valueType?: EntityValueDataType;
    valueTypeLabel?: string;
    valueKey: string;
    enums?: {
        key: string;
        label?: string;
    }[];
};

export type UpdateNodeStatusOptions = {
    /**
     * If only render the given nodes (Default is `false`, render all nodes)
     */
    partial?: boolean;
};

const entryNodeTypes = Object.values(basicNodeConfigs)
    .filter(item => item.category === 'entry')
    .map(item => item.type);

const useWorkflow = () => {
    const { getNodes, getEdges, setNodes, setEdges, fitView } = useReactFlow<
        WorkflowNode,
        WorkflowEdge
    >();
    const { getIntlText } = useI18n();
    const { selectedNode, nodeConfigs } = useFlowStore(
        useStoreShallow(['selectedNode', 'nodeConfigs']),
    );

    // Fetch Entity List
    const { entityList } = useEntityStore(
        useStoreShallow(['status', 'entityList', 'initEntityList']),
    );

    const getEntityDetail = useCallback(
        (key?: ApiKey) => {
            if (!key) return;
            return entityList.find(item => item.entity_key === key);
        },
        [entityList],
    );

    // Check node number limit
    const checkNodeNumberLimit = useCallback(
        (nodes?: WorkflowNode[]) => {
            nodes = nodes || getNodes();

            if (nodes.length < NODE_MIN_NUMBER_LIMIT) {
                toast.error({
                    key: 'node-min-number-limit',
                    content: getIntlText('workflow.label.node_min_number_limit_tip', {
                        1: NODE_MIN_NUMBER_LIMIT,
                    }),
                });
                return false;
            }

            const entryNodes = nodes.filter(node =>
                entryNodeTypes.includes(node.type as WorkflowNodeType),
            );

            if (entryNodes.length !== ENTRY_NODE_NUMBER_LIMIT) {
                toast.error({
                    key: 'entry-node-number-limit',
                    content: getIntlText('workflow.label.entry_node_number_limit_tip', {
                        1: ENTRY_NODE_NUMBER_LIMIT,
                    }),
                });
                return false;
            }

            return true;
        },
        [getNodes, getIntlText],
    );

    // Check Parallel Limit
    const checkParallelLimit = useCallback(
        (nodeId: ApiKey, nodeHandle?: string | null, edges?: WorkflowEdge[]) => {
            edges = edges || getEdges();
            const connectedEdges = edges.filter(
                edge =>
                    edge.source === nodeId &&
                    ((!nodeHandle && !edge.sourceHandle) || edge.sourceHandle === nodeHandle),
            );

            if (connectedEdges.length > PARALLEL_LIMIT - 1) {
                toast.error({
                    key: 'parallel-limit',
                    content: getIntlText('workflow.label.parallel_limit_tip', {
                        1: PARALLEL_LIMIT,
                    }),
                });
                return false;
            }

            return true;
        },
        [getEdges, getIntlText],
    );

    // Check nested parallel limit
    const checkNestedParallelLimit = useCallback(
        (nodes: WorkflowNode[], edges: WorkflowEdge[], parentNodeId?: ApiKey) => {
            const { parallelList, hasAbnormalEdges } = getParallelInfo(nodes, edges, parentNodeId);

            // console.log({ parallelList, hasAbnormalEdges });
            if (hasAbnormalEdges) {
                toast.error({
                    key: 'abnormal-edge',
                    content: getIntlText('workflow.label.abnormal_edge_tip'),
                });
                return false;
            }

            const isGtLimit = parallelList.some(item => item.depth > PARALLEL_DEPTH_LIMIT);

            if (isGtLimit) {
                toast.error({
                    key: 'parallel-depth-limit',
                    content: getIntlText('workflow.label.parallel_depth_limit_tip', {
                        1: PARALLEL_DEPTH_LIMIT,
                    }),
                });
                return false;
            }

            return true;
        },
        [getIntlText],
    );

    // Check node connection cycle
    const isValidConnection = useCallback<IsValidConnection>(
        connection => {
            // we are using getNodes and getEdges helpers here
            // to make sure we create isValidConnection function only once
            const nodes = getNodes();
            const edges = getEdges();
            const target = nodes.find(node => node.id === connection.target);
            const hasCycle = (node: WorkflowNode, visited = new Set()) => {
                if (visited.has(node.id)) return false;

                visited.add(node.id);

                for (const outgoer of getOutgoers(node, nodes, edges)) {
                    if (outgoer.id === connection.source) return true;
                    if (hasCycle(outgoer, visited)) return true;
                }
            };

            if (!checkParallelLimit(connection.source, connection.sourceHandle)) return false;

            if (target?.id === connection.source) return false;
            return !hasCycle(target!);
        },
        [getNodes, getEdges, checkParallelLimit],
    );

    // Get all upstream nodes of the current node
    const getUpstreamNodes = useCallback(
        (currentNode?: WorkflowNode, nodes?: WorkflowNode[], edges?: WorkflowEdge[]) => {
            nodes = nodes || getNodes();
            edges = edges || getEdges();
            currentNode = currentNode || selectedNode;

            const getAllIncomers = (
                node: WorkflowNode,
                data: Record<ApiKey, WorkflowNode[]> = {},
                depth = 1,
            ) => {
                if (!node) return [];
                const incomers = getIncomers(node, nodes, edges);

                data[depth] = data[depth] || [];
                data[depth].push(...incomers);
                incomers.forEach(item => getAllIncomers(item, data, depth + 1));

                const keys = Object.keys(data).sort((a, b) => +a - +b);
                const result = keys.reduce((acc, key) => {
                    acc.push(...data[key]);
                    return acc;
                }, [] as WorkflowNode[]);

                return uniqBy(result, 'id');
            };

            return getAllIncomers(currentNode!);
        },
        [getNodes, getEdges, selectedNode],
    );

    // Get the parameters of the upstream nodes of the current node
    const getUpstreamNodeParams = useCallback(
        (
            currentNode?: WorkflowNode,
            nodes?: WorkflowNode[],
            edges?: WorkflowEdge[],
        ): [NodeParamType[], FlattenNodeParamType[]] | [] => {
            nodes = nodes || getNodes();
            edges = edges || getEdges();
            currentNode = currentNode || selectedNode;
            if (!currentNode) return [];

            const incomeNodes = getUpstreamNodes(currentNode, nodes, edges);
            const result = incomeNodes
                .map(({ id, type, data }) => {
                    const { nodeName, parameters } = data || {};
                    const config = nodeConfigs[type!];
                    const outputKeys = config?.outputKeys;
                    const paramData: NodeParamType = {
                        nodeId: id,
                        nodeName,
                        nodeType: type,
                        nodeLabel: config?.labelIntlKey
                            ? getIntlText(config.labelIntlKey)
                            : config.label || '',
                        outputs: [],
                    };

                    if (isEmpty(parameters) || !outputKeys?.length) return;
                    const outputArgs = pick(parameters, outputKeys);

                    Object.entries(outputArgs).forEach(([param, data]) => {
                        switch (param) {
                            // Data Type: { identify?: string; name: string; type: string }[]
                            case 'entityConfigs':
                            case 'payload':
                            case 'message': {
                                if (!Array.isArray(data)) return;
                                data.forEach((item: Record<string, any>) => {
                                    if (!item?.name || !item?.type) return;
                                    const enums =
                                        (item.type as EntityValueDataType) !== 'BOOLEAN'
                                            ? undefined
                                            : DEFAULT_BOOLEAN_DATA_ENUMS.map(item => ({
                                                  key: item.key,
                                                  label: getIntlText(item.labelIntlKey),
                                              }));
                                    const typeOption = entityTypeOptions.find(
                                        it => it.value === item.type,
                                    );
                                    paramData.outputs.push({
                                        name: item.name,
                                        type: item.type,
                                        typeLabel: !typeOption?.label
                                            ? item.type
                                            : getIntlText(typeOption.label),
                                        key:
                                            param === 'entityConfigs'
                                                ? genRefParamKey(id, item.identify)
                                                : genRefParamKey(id, item.name),
                                        enums,
                                    });
                                });
                                break;
                            }
                            // Data Type: string[]
                            case 'entities': {
                                if (!Array.isArray(data)) return;
                                data.forEach(item => {
                                    if (!item) return;
                                    const entity = getEntityDetail(item);
                                    const type = entity?.entity_value_type;
                                    const enums = (entity?.entity_value_attribute as any)?.enum;
                                    const typeOption = entityTypeOptions.find(
                                        it => it.value === type,
                                    );

                                    paramData.outputs.push({
                                        name: entity?.entity_name || item,
                                        type,
                                        typeLabel: !typeOption?.label
                                            ? type
                                            : getIntlText(typeOption.label),
                                        key: genRefParamKey(id, item),
                                        enums: !isEmpty(enums)
                                            ? Object.entries(enums)?.map(([key, value]) => ({
                                                  key,
                                                  label: value as string | undefined,
                                              }))
                                            : type !== 'BOOLEAN'
                                              ? undefined
                                              : DEFAULT_BOOLEAN_DATA_ENUMS.map(item => ({
                                                    key: item.key,
                                                    label: getIntlText(item.labelIntlKey),
                                                })),
                                    });
                                });
                                break;
                            }
                            // Data Type: Record<string, string>
                            case 'inputArguments':
                            case 'exchangePayload':
                            case 'serviceInvocationSetting': {
                                if (param === 'serviceInvocationSetting') {
                                    data = data.serviceParams;
                                }
                                if (!isObject(data)) return;
                                Object.entries(data).forEach(([key, value]) => {
                                    if (!key || !value || isRefParamKey(value)) return;
                                    const entity = getEntityDetail(key);

                                    if (!entity) return;
                                    const type = entity?.entity_value_type;
                                    const enums = (entity?.entity_value_attribute as any)?.enum;
                                    const typeOption = entityTypeOptions.find(
                                        it => it.value === type,
                                    );

                                    paramData.outputs.push({
                                        name: entity?.entity_name || key,
                                        type,
                                        typeLabel: !typeOption?.label
                                            ? type
                                            : getIntlText(typeOption.label),
                                        key: genRefParamKey(id, key),
                                        enums: !isEmpty(enums)
                                            ? Object.entries(enums)?.map(([key, value]) => ({
                                                  key,
                                                  label: value as string | undefined,
                                              }))
                                            : type !== 'BOOLEAN'
                                              ? undefined
                                              : DEFAULT_BOOLEAN_DATA_ENUMS.map(item => ({
                                                    key: item.key,
                                                    label: getIntlText(item.labelIntlKey),
                                                })),
                                    });
                                });
                                break;
                            }
                            default: {
                                break;
                            }
                        }
                    });
                    return paramData;
                })
                .filter(item => !!item);
            const flattenResult = result.reduce((acc, item) => {
                acc.push(
                    ...item.outputs.map(output => ({
                        nodeId: item.nodeId,
                        nodeName: item.nodeName,
                        nodeType: item.nodeType,
                        valueName: output.name,
                        valueType: output.type,
                        valueTypeLabel: output.typeLabel,
                        valueKey: output.key,
                        enums: output.enums,
                    })),
                );
                return acc;
            }, [] as FlattenNodeParamType[]);

            return [result, flattenResult];
        },
        [
            nodeConfigs,
            selectedNode,
            getNodes,
            getEdges,
            getUpstreamNodes,
            getIntlText,
            getEntityDetail,
        ],
    );

    // Get the detail of the reference parameter
    const getReferenceParamDetail = useCallback(
        (key?: ApiKey) => {
            if (!key) return;
            const [, nodeParams] = getUpstreamNodeParams();
            const result = nodeParams?.find(item => item.valueKey === key);

            return result;
        },
        [getUpstreamNodeParams],
    );

    // Check if there is a node that is not connected to an entry node
    const checkFreeNodeLimit = useCallback(
        (nodes?: WorkflowNode[], edges?: WorkflowEdge[]) => {
            nodes = nodes || getNodes();
            edges = edges || getEdges();
            let result = false;

            result = nodes
                .filter(node => !entryNodeTypes.includes(node.type as WorkflowNodeType))
                .some(node => {
                    const upstreamNodes = getUpstreamNodes(node, nodes, edges);
                    const hasEntryNode = upstreamNodes.some(item =>
                        entryNodeTypes.includes(item.type as WorkflowNodeType),
                    );

                    return !hasEntryNode;
                });

            if (result) {
                toast.error({
                    key: 'free-node-limit',
                    content: getIntlText('workflow.label.free_node_limit_tip'),
                });
            }

            return result;
        },
        [getNodes, getEdges, getUpstreamNodes, getIntlText],
    );

    // Check if the workflow nodes&edges is valid
    const checkWorkflowValid = useCallback(
        (nodes: WorkflowNode[], edges: WorkflowEdge[]) => {
            if (!checkNodeNumberLimit(nodes)) return false;
            if (checkFreeNodeLimit(nodes, edges)) return false;
            if (!checkNestedParallelLimit(nodes, edges)) return false;
            if (nodes.some(node => !checkParallelLimit(node.id, undefined, edges))) return false;

            return true;
        },
        [checkNodeNumberLimit, checkFreeNodeLimit, checkNestedParallelLimit, checkParallelLimit],
    );

    // Update node status
    const updateNodesStatus = useCallback(
        (data: Record<string, WorkflowNodeStatus> | null, options?: UpdateNodeStatusOptions) => {
            const nodes = cloneDeep(getNodes());

            if (!data) {
                nodes.forEach(node => {
                    node.data = omit(node.data, ['$status', '$errMsg']);
                });
            } else {
                nodes.forEach(node => {
                    let status: WorkflowNodeStatus = data[node.id];

                    if (!options?.partial) {
                        status = status || 'SUCCESS';
                    }

                    node.data = {
                        ...node.data,
                        $status: status,
                    };
                });
                fitView({ duration: 300 });
            }

            setNodes(nodes);
        },
        [getNodes, setNodes, fitView],
    );

    // Clear excess edges
    const clearExcessEdges = useCallback(
        (nodes?: WorkflowNode[], edges?: WorkflowEdge[]) => {
            nodes = nodes || getNodes();
            edges = cloneDeep(edges || getEdges());

            const ids = nodes.reduce((acc, node) => {
                acc.push(node.id);

                if (node.type === 'ifelse') {
                    const { choice } =
                        (node.data.parameters as IfElseNodeDataType['parameters']) || {};
                    const { when, otherwise } = choice || {};

                    if (when?.length) {
                        acc.push(...when.map(item => `${item.id}`));
                    }
                    if (otherwise?.id) acc.push(`${otherwise.id}`);
                }

                return acc;
            }, [] as string[]);

            const newEdges = edges.filter(({ source, target, sourceHandle, targetHandle }) => {
                return (
                    ids.includes(source) &&
                    ids.includes(target) &&
                    (!sourceHandle || ids.includes(sourceHandle)) &&
                    (!targetHandle || ids.includes(targetHandle))
                );
            });

            if (edges.length === newEdges.length) return;
            setEdges(newEdges);

            return newEdges;
        },
        [getNodes, getEdges, setEdges],
    );

    return {
        isValidConnection,
        checkParallelLimit,
        checkNestedParallelLimit,
        checkNodeNumberLimit,
        checkFreeNodeLimit,
        checkWorkflowValid,
        getEntityDetail,
        getUpstreamNodes,
        getUpstreamNodeParams,
        getReferenceParamDetail,
        updateNodesStatus,
        clearExcessEdges,
    };
};

export default useWorkflow;
