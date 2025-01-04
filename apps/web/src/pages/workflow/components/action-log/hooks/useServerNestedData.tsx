import { useCallback, useMemo } from 'react';
import { cloneDeep } from 'lodash-es';
import { generateUUID, objectToCamelCase } from '@milesight/shared/src/utils/tools';
import type {
    AccordionLog,
    ActionLogProps,
    WorkflowDataType,
    WorkflowNestNode,
    WorkflowTraceType,
} from '../types';

export const useServerNestedData = ({ traceData, workflowData }: ActionLogProps) => {
    console.log('traceData >>>', traceData);
    /** get unique id */
    const getUniqueId = useCallback((trace: AccordionLog) => {
        const { messageId, nodeId } = trace || {};

        return `${messageId}-${nodeId}`;
    }, []);

    /** Generate workflow Map */
    const workflowMap = useMemo(() => {
        const { nodes } = workflowData || {};

        return (nodes || []).reduce(
            (acc, cur) => {
                const { id } = cur || {};
                acc[id] = cur;
                return acc;
            },
            {} as Record<string, WorkflowDataType['nodes'][number]>,
        );
    }, [workflowData]);

    /** Add required attributes */
    const wrapperNode = useCallback(
        (trace: WorkflowTraceType): WorkflowNestNode => {
            const { node_id: nodeId } = trace || {};
            const node = workflowMap[nodeId];
            if (!node) return node;

            const nestNode = cloneDeep(node) as WorkflowNestNode;
            const { type, data } = nestNode || {};
            const { nodeName } = data || {};
            const traceStruct = objectToCamelCase(trace || {});

            nestNode.attrs = {
                $$token: generateUUID(),
                name: nodeName || '',
                type: type!,
                ...(traceStruct || {}),
            };

            return nestNode;
        },
        [workflowMap],
    );
    const workflowNestData = useMemo(() => traceData.map(wrapperNode), [traceData, wrapperNode]);

    /** Generate workflow Map */
    const workflowNestMap = useMemo(() => {
        return (workflowNestData || []).reduce(
            (acc, cur) => {
                const { attrs } = cur || {};
                const uniqueId = getUniqueId(attrs);
                acc[uniqueId] = cur;
                return acc;
            },
            {} as Record<string, WorkflowNestNode>,
        );
    }, [getUniqueId, workflowNestData]);

    /** Convert flat data to tree */
    const dataToTree = useCallback((): WorkflowNestNode[] => {
        const root: WorkflowNestNode[] = [];
        (workflowNestData || []).forEach(node => {
            const { attrs } = node || {};
            const { parentTraceId } = attrs || {};

            if (!parentTraceId) {
                root.push(node);
                return;
            }

            const parentNode = workflowNestMap[parentTraceId];
            if (parentNode) {
                parentNode.children = [...(parentNode.children || []), node];
            }
        });

        return root;
    }, [workflowNestData, workflowNestMap]);

    const run = useCallback(() => {
        return dataToTree();
    }, [dataToTree]);
    return {
        run,
    };
};
