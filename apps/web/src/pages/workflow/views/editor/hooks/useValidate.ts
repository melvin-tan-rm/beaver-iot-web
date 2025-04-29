import { useMemo, useCallback } from 'react';
import { useReactFlow } from '@xyflow/react';
import { isObject, isNil, isNumber, merge } from 'lodash-es';
import { useI18n } from '@milesight/shared/src/hooks';
import { toast } from '@milesight/shared/src/components';
import {
    isEmpty,
    isMaxLength,
    isURL,
    isMatches,
    isEmail,
    isRangeLength,
} from '@milesight/shared/src/utils/validators';
import { EDGE_TYPE_ADDABLE, HTTP_URL_PATH_PATTERN } from '../constants';
import useFlowStore from '../store';
import { isRefParamKey } from '../helper';
import type { NodeDataValidator } from '../typings';

type CheckOptions = {
    /**
     * When a rule fails validation, should the validation of the remaining rules be stopped
     */
    validateFirst?: boolean;
};

export type NodesDataValidResult = Record<
    string,
    {
        type: WorkflowNodeType;
        label?: string;
        name?: string;
        status: WorkflowNodeStatus;
        errMsgs: string[];
    }
>;

enum ErrorIntlKey {
    required = 'workflow.valid.required',
    rangeLength = 'workflow.valid.range_length',
    minLength = 'workflow.valid.min_length',
    maxLength = 'workflow.valid.max_length',
    url = 'workflow.valid.invalid_url',
    email = 'workflow.valid.invalid_email',
    urlPath = 'workflow.valid.invalid_url_path',
}

export const NODE_VALIDATE_TOAST_KEY = 'node-validate';
export const EDGE_VALIDATE_TOAST_KEY = 'edge-validate';

// node and edge id regex
const ID_PATTERN = /^(?!_)[a-zA-Z0-9_]+$/;

const useValidate = () => {
    const { getIntlText } = useI18n();
    const { getNodes, getEdges } = useReactFlow<WorkflowNode, WorkflowEdge>();
    const nodeConfigs = useFlowStore(state => state.nodeConfigs);
    const getDynamicValidators = useFlowStore(state => state.getDynamicValidators);

    const dataValidators = useMemo(() => {
        const checkRequired: NodeDataValidator = (value?: any, fieldName?: string) => {
            if (!isEmpty(value)) {
                return true;
            }
            const message = getIntlText(ErrorIntlKey.required, { 1: fieldName });
            return message;
        };
        const genMaxLengthValidator = (maxLength: number): NodeDataValidator => {
            return (value, fieldName) => {
                if (value && !isMaxLength(value, maxLength)) {
                    const message = getIntlText(ErrorIntlKey.maxLength, {
                        1: fieldName,
                        2: maxLength,
                    });
                    return message;
                }
                return true;
            };
        };

        const checkObjectRequired = (
            value?: NonNullable<CodeNodeDataType['parameters']>['inputArguments'],
            fieldName?: string,
        ) => {
            const keys = Object.keys(value || {});
            const values = Object.values(value || {});

            if (value && keys.length && keys.every(val => !!val) && values.every(val => !!val)) {
                return true;
            }
            const message = getIntlText(ErrorIntlKey.required, { 1: fieldName });
            return message;
        };

        const genObjectMaxLengthValidator = (
            keyMaxLength?: number,
            valueMaxLength?: number,
        ): NodeDataValidator => {
            return (
                value: NonNullable<CodeNodeDataType['parameters']>['inputArguments'],
                fieldName,
            ) => {
                if (!value || !Object.keys(value).length) return true;

                const hasKeyOverLength =
                    !isNil(keyMaxLength) &&
                    Object.keys(value).some(key => {
                        if (key && !isMaxLength(key, keyMaxLength)) return true;
                        return false;
                    });
                const hasValueOverLength =
                    !isNil(valueMaxLength) &&
                    Object.values(value).some(val => {
                        if (val && !isMaxLength(val, valueMaxLength)) return true;
                        return false;
                    });

                if (!hasKeyOverLength && !hasValueOverLength) return true;
                const options = hasKeyOverLength
                    ? { 1: fieldName, 2: keyMaxLength }
                    : { 1: fieldName, 2: valueMaxLength };

                return getIntlText(ErrorIntlKey.maxLength, options);
            };
        };

        const entitiesChecker: Record<string, NodeDataValidator> = {
            checkRequired(
                value: NonNullable<ListenerNodeDataType['parameters']>['entities'],
                fieldName?: string,
            ) {
                if (value?.length && value.some(item => !isEmpty(item))) {
                    return true;
                }
                const message = getIntlText(ErrorIntlKey.required, { 1: fieldName });
                return message;
            },
        };

        const inputArgumentsChecker: Record<string, NodeDataValidator> = {
            checkMaxLength(
                value: NonNullable<CodeNodeDataType['parameters']>['inputArguments'],
                fieldName,
            ) {
                if (value && Object.keys(value).length) {
                    const maxLength = 50;
                    const hasOverLength = Object.keys(value).some(key => {
                        if (key && !isMaxLength(key, maxLength)) return true;
                        return false;
                    });

                    if (!hasOverLength) return true;
                    return getIntlText(ErrorIntlKey.maxLength, {
                        1: fieldName,
                        2: maxLength,
                    });
                }

                return true;
            },
        };

        // Note: The `checkRequired` name is fixed and cannot be modified
        const result: Record<string, Record<string, NodeDataValidator>> = {
            nodeName: {
                checkRequired,
                checkRangeLength(value) {
                    if (value && !isRangeLength(value, 1, 50)) {
                        const message = getIntlText(ErrorIntlKey.rangeLength, {
                            1: getIntlText('common.label.name'),
                            2: 1,
                            3: 50,
                        });
                        return message;
                    }
                    return true;
                },
            },
            nodeRemark: {
                checkRangeLength(value) {
                    if (value && !isRangeLength(value || '', 1, 1000)) {
                        const message = getIntlText(ErrorIntlKey.rangeLength, {
                            1: getIntlText('common.label.remark'),
                            2: 1,
                            3: 1000,
                        });
                        return message;
                    }
                    return true;
                },
            },
            // Check listener.entities, select.entities
            'listener.entities': entitiesChecker,
            'select.entities': entitiesChecker,
            'trigger.entityConfigs': {
                // checkRequired(
                //     value?: NonNullable<TriggerNodeDataType['parameters']>['entityConfigs'],
                //     fieldName?: string,
                // ) {
                //     if (
                //         value?.length &&
                //         value.every(item => Object.values(item).every(it => !!it))
                //     ) {
                //         return true;
                //     }
                //     const message = getIntlText(ErrorIntlKey.required, { 1: fieldName });
                //     return message;
                // },
                checkMaxLength(
                    value?: NonNullable<TriggerNodeDataType['parameters']>['entityConfigs'],
                    fieldName?: string,
                ) {
                    if (value?.length) {
                        const maxLength = 50;
                        const hasOverLength = value.some(item => {
                            if (item.name && !isMaxLength(item.name, maxLength)) return true;
                            return false;
                        });

                        if (!hasOverLength) return true;
                        return getIntlText(ErrorIntlKey.maxLength, {
                            1: fieldName,
                            2: maxLength,
                        });
                    }
                    return true;
                },
            },
            'timer.timerSettings': {
                checkRequired(
                    value?: NonNullable<TimerNodeDataType['parameters']>['timerSettings'],
                    fieldName?: string,
                ) {
                    switch (value?.type) {
                        case 'ONCE':
                            if (value.timezone && value.executionEpochSecond) {
                                return true;
                            }
                            break;
                        case 'SCHEDULE':
                            if (
                                value.timezone &&
                                value.expirationEpochSecond &&
                                value.rules?.length &&
                                value.rules.every(
                                    rule =>
                                        !isEmpty(rule.hour) &&
                                        !isEmpty(rule.minute) &&
                                        rule.daysOfWeek?.length,
                                )
                            ) {
                                return true;
                            }
                            break;
                        case 'INTERVAL':
                            if (
                                value.timezone &&
                                !isNil(value.intervalTime) &&
                                isNumber(value.intervalTime) &&
                                value.intervalTimeUnit
                            ) {
                                return true;
                            }
                            break;
                        default:
                            break;
                    }

                    const message = getIntlText(ErrorIntlKey.required, { 1: fieldName });
                    return message;
                },
                checkIntervalTime(
                    value?: NonNullable<TimerNodeDataType['parameters']>['timerSettings'],
                    fieldName?: string,
                ) {
                    const MAX_INTERVAL_HOURS = 24;
                    const { type, intervalTime, intervalTimeUnit } = value || {};
                    if (
                        type === 'INTERVAL' &&
                        !isNil(intervalTime) &&
                        isNumber(intervalTime) &&
                        intervalTimeUnit
                    ) {
                        let seconds = 0;

                        switch (intervalTimeUnit) {
                            case 'HOURS':
                                seconds = intervalTime * 3600;
                                break;
                            case 'MINUTES':
                                seconds = intervalTime * 60;
                                break;
                            case 'SECONDS':
                                seconds = intervalTime;
                                break;
                            default:
                                break;
                        }

                        if (seconds < MAX_INTERVAL_HOURS * 3600) {
                            return true;
                        }

                        const message = getIntlText('workflow.valid.invalid_timer_interval', {
                            1: getIntlText('common.label.hours', { 1: MAX_INTERVAL_HOURS }),
                        });
                        return message;
                    }
                    return true;
                },
            },
            'mqtt.topic': {
                checkRequired,
                checkMaxLength: genMaxLengthValidator(100),
            },
            'httpin.method': { checkRequired },
            'httpin.url': {
                checkRequired,
                checkMaxLength: genMaxLengthValidator(1000),
                checkPath(value: NonNullable<HttpinNodeDataType['parameters']>['url'], fieldName) {
                    if (value && !HTTP_URL_PATH_PATTERN.test(value)) {
                        const message = getIntlText(ErrorIntlKey.urlPath, {
                            1: fieldName,
                            2: '{param}',
                        });
                        return message;
                    }
                    return true;
                },
            },
            'ifelse.choice': {
                checkRequired(
                    value: NonNullable<IfElseNodeDataType['parameters']>['choice'],
                    fieldName,
                ) {
                    const message = getIntlText(ErrorIntlKey.required, { 1: fieldName });
                    const { when } = value || {};

                    if (!when?.length) return message;
                    const hasEmptyCondition = when.some(({ expressionType, conditions }) => {
                        switch (expressionType) {
                            case 'condition': {
                                const hasEmpty = conditions.some(({ expressionValue }) => {
                                    if (typeof expressionValue === 'string') return true;
                                    const { key, operator, value } = expressionValue || {};

                                    if (operator === 'IS_EMPTY' || operator === 'IS_NOT_EMPTY') {
                                        return !key || !operator;
                                    }

                                    return !key || !operator || isNil(value) || value === '';
                                });

                                return hasEmpty;
                            }
                            default: {
                                const { expressionValue, expressionDescription } = conditions[0];
                                return !expressionValue || !expressionDescription;
                            }
                        }
                    });

                    if (hasEmptyCondition) return message;
                    return true;
                },
                checkMaxLength(
                    value: NonNullable<IfElseNodeDataType['parameters']>['choice'],
                    fieldName,
                ) {
                    const { when } = value || {};

                    if (when?.length) {
                        const maxValueLength = 1000;
                        const maxCodeLength = 64000;
                        const maxDescriptionLength = 30;
                        let message = '';

                        for (let i = 0; i < when.length; i++) {
                            const block = when[i];
                            const { expressionType, conditions } = block;

                            switch (expressionType) {
                                case 'condition': {
                                    for (let j = 0; j < conditions.length; j++) {
                                        const { expressionValue } = conditions[j];

                                        if (typeof expressionValue === 'string') break;
                                        if (
                                            !isMaxLength(
                                                isNil(expressionValue?.value)
                                                    ? ''
                                                    : `${expressionValue?.value}`,
                                                maxValueLength,
                                            )
                                        ) {
                                            message = getIntlText(ErrorIntlKey.maxLength, {
                                                1: 'value',
                                                2: maxValueLength,
                                            });
                                        }
                                    }
                                    break;
                                }
                                default: {
                                    const { expressionValue, expressionDescription } =
                                        conditions?.[0] || {};

                                    if (
                                        !isMaxLength(
                                            (expressionValue as string) || '',
                                            maxCodeLength,
                                        )
                                    ) {
                                        message = getIntlText(ErrorIntlKey.maxLength, {
                                            1: 'expressionValue',
                                            2: maxCodeLength,
                                        });
                                    } else if (
                                        !isMaxLength(
                                            expressionDescription || '',
                                            maxDescriptionLength,
                                        )
                                    ) {
                                        message = getIntlText(ErrorIntlKey.maxLength, {
                                            1: 'expressionDescription',
                                            2: maxDescriptionLength,
                                        });
                                    }
                                    break;
                                }
                            }

                            if (message) return message;
                        }
                    }

                    return true;
                },
            },
            'code.inputArguments': {
                checkRequired(
                    value: NonNullable<CodeNodeDataType['parameters']>['inputArguments'],
                    fieldName,
                ) {
                    if (
                        value &&
                        Object.keys(value).length &&
                        Object.values(value).every(val => !!val)
                    ) {
                        return true;
                    }
                    const message = getIntlText(ErrorIntlKey.required, { 1: fieldName });
                    return message;
                },
                ...inputArgumentsChecker,
            },
            'code.expression': {
                checkRequired(
                    value: NonNullable<CodeNodeDataType['parameters']>['expression'],
                    fieldName,
                ) {
                    if (!isObject(value) || !value.language || !value.expression) {
                        return getIntlText(ErrorIntlKey.required, { 1: fieldName });
                    }
                    return true;
                },
                checkMaxLength(
                    value: NonNullable<CodeNodeDataType['parameters']>['expression'],
                    fieldName,
                ) {
                    const maxLength = 64000;
                    if (
                        isObject(value) &&
                        value.expression &&
                        value.expression.length > maxLength
                    ) {
                        return getIntlText(ErrorIntlKey.maxLength, {
                            1: fieldName,
                            2: maxLength,
                        });
                    }
                    return true;
                },
            },
            'code.payload': {
                checkMaxLength(
                    value?: NonNullable<CodeNodeDataType['parameters']>['payload'],
                    fieldName?: string,
                ) {
                    if (value?.length) {
                        const maxLength = 50;
                        const hasOverLength = value?.some(item => {
                            if (item.name && !isMaxLength(`${item.name}`, maxLength)) return true;
                            return false;
                        });

                        if (!hasOverLength) return true;
                        return getIntlText(ErrorIntlKey.maxLength, {
                            1: fieldName,
                            2: maxLength,
                        });
                    }

                    return true;
                },
            },
            'service.serviceInvocationSetting': {
                checkRequired(
                    value: NonNullable<
                        ServiceNodeDataType['parameters']
                    >['serviceInvocationSetting'],
                    fieldName,
                ) {
                    if (value?.serviceEntity) return true;
                    return getIntlText(ErrorIntlKey.required, { 1: fieldName });
                },
                checkMaxLength(
                    value: NonNullable<
                        ServiceNodeDataType['parameters']
                    >['serviceInvocationSetting'],
                    fieldName,
                ) {
                    if (value?.serviceParams && Object.keys(value.serviceParams).length) {
                        const maxLength = 1000;
                        const hasOverLength = Object.values(value.serviceParams).some(val => {
                            if (
                                val &&
                                typeof val === 'string' &&
                                !isRefParamKey(val) &&
                                !isMaxLength(val, maxLength)
                            ) {
                                return true;
                            }
                            return false;
                        });

                        if (!hasOverLength) return true;
                        return getIntlText(ErrorIntlKey.maxLength, {
                            1: fieldName,
                            2: maxLength,
                        });
                    }
                    return true;
                },
            },
            'assigner.exchangePayload': {
                checkRequired(
                    value: NonNullable<AssignerNodeDataType['parameters']>['exchangePayload'],
                    fieldName,
                ) {
                    if (
                        !value ||
                        !Object.keys(value).length ||
                        Object.entries(value).some(
                            ([key, value]) => !key || isNil(value) || value === '',
                        )
                    ) {
                        return getIntlText(ErrorIntlKey.required, { 1: fieldName });
                    }

                    return true;
                },
                checkMaxLength(
                    value: NonNullable<AssignerNodeDataType['parameters']>['exchangePayload'],
                    fieldName,
                ) {
                    if (value && Object.values(value).filter(Boolean).length) {
                        const maxLength = 1000;
                        const hasOverLength = Object.values(value).some(val => {
                            if (
                                val &&
                                !isRefParamKey(`${val}`) &&
                                !isMaxLength(`${val}`, maxLength)
                            ) {
                                return true;
                            }
                            return false;
                        });

                        if (!hasOverLength) return true;
                        return getIntlText(ErrorIntlKey.maxLength, {
                            1: fieldName,
                            2: maxLength,
                        });
                    }
                    return true;
                },
            },
            'email.emailConfig': {
                checkRequired(
                    value: NonNullable<EmailNodeDataType['parameters']>['emailConfig'],
                    fieldName,
                ) {
                    const { provider, smtpConfig } = value || {};
                    if (!provider || !smtpConfig || Object.values(smtpConfig).some(item => !item)) {
                        return getIntlText(ErrorIntlKey.required, { 1: fieldName });
                    }
                    return true;
                },
                checkMaxLength(
                    value: NonNullable<EmailNodeDataType['parameters']>['emailConfig'],
                    fieldName,
                ) {
                    const { smtpConfig } = value || {};

                    if (smtpConfig && Object.values(smtpConfig).every(item => !!item)) {
                        const maxLength = 50;
                        const hasOverLength = Object.entries(smtpConfig).some(([key, val]) => {
                            if (key !== 'encryption' && val && !isMaxLength(`${val}`, maxLength)) {
                                fieldName = `SMTP ${key}`;
                                return true;
                            }
                            return false;
                        });

                        if (!hasOverLength) return true;
                        return getIntlText(ErrorIntlKey.maxLength, {
                            1: fieldName,
                            2: maxLength,
                        });
                    }

                    return true;
                },
            },
            'email.subject': {
                checkRequired,
                checkMaxLength: genMaxLengthValidator(500),
            },
            'email.recipients': {
                checkRequired(
                    value: NonNullable<EmailNodeDataType['parameters']>['recipients'],
                    fieldName,
                ) {
                    if (!value || !value.length) {
                        return getIntlText(ErrorIntlKey.required, { 1: fieldName });
                    }
                    return true;
                },
                checkEmail(
                    value: NonNullable<EmailNodeDataType['parameters']>['recipients'],
                    fieldName,
                ) {
                    if (value && value.length) {
                        const hasInvalidEmail = value.some(val => !isEmail(val));

                        if (!hasInvalidEmail) return true;
                        return getIntlText(ErrorIntlKey.email, { 1: fieldName });
                    }
                    return true;
                },
            },
            'email.content': {
                checkRequired,
                checkMaxLength: genMaxLengthValidator(10000),
            },
            'webhook.webhookUrl': {
                checkRequired,
                checkUrl(value: string, fieldName) {
                    if (value && !isURL(value)) {
                        return getIntlText(ErrorIntlKey.url, { 1: fieldName });
                    }

                    return true;
                },
            },
            'webhook.inputArguments': inputArgumentsChecker,
            'http.method': { checkRequired },
            'http.url': {
                checkRequired,
                checkMaxLength: genMaxLengthValidator(1000),
            },
            'http.header': {
                checkRequired: checkObjectRequired,
                checkMaxLength: genObjectMaxLengthValidator(1000, 1000),
            },
            'http.params': {
                checkRequired: checkObjectRequired,
                checkMaxLength: genObjectMaxLengthValidator(1000, 1000),
            },
            'http.body': {
                checkRequired(
                    data: NonNullable<HttpNodeDataType['parameters']>['body'],
                    fieldName,
                ) {
                    if (!data?.type) return true;

                    switch (data.type) {
                        case 'application/x-www-form-urlencoded': {
                            if (
                                data.value &&
                                Object.keys(data.value).every(val => !!val) &&
                                Object.values(data.value).every(val => !!val)
                            ) {
                                return true;
                            }
                            break;
                        }
                        default: {
                            if (data.value) return true;
                            break;
                        }
                    }

                    return getIntlText(ErrorIntlKey.required, { 1: fieldName });
                },
                checkMaxLength(
                    data: NonNullable<HttpNodeDataType['parameters']>['body'],
                    fieldName,
                ) {
                    if (!data?.type || !data.value) return true;
                    const maxLength = 1000;

                    switch (data.type) {
                        case 'application/x-www-form-urlencoded': {
                            const validator = genObjectMaxLengthValidator(maxLength, maxLength);
                            return validator(data.value, fieldName);
                        }
                        default: {
                            if (typeof data.value === 'string' && data.value.length <= maxLength) {
                                return true;
                            }
                            break;
                        }
                    }

                    return getIntlText(ErrorIntlKey.maxLength, {
                        1: fieldName,
                        2: maxLength,
                    });
                },
            },
        };

        return result;
    }, [getIntlText]);

    /**
     * Check Nodes ID
     * 1. ID is unique
     * 2. ID Cannot start with `_`
     * 3. ID strings can only contain letters (case insensitive), numbers, and underscores
     */
    const checkNodesId = useCallback(
        (nodes?: WorkflowNode[], options?: CheckOptions) => {
            nodes = nodes || getNodes();
            const result: NodesDataValidResult = {};
            const nodesMap = new Map();

            for (let i = 0; i < nodes.length; i++) {
                const { id, type, data } = nodes[i];
                const nodeName = data?.nodeName;
                const nodeType = type as WorkflowNodeType;
                const nodeConfig = nodeConfigs[nodeType];
                const nodeLabel = nodeConfig?.labelIntlKey
                    ? getIntlText(nodeConfig.labelIntlKey)
                    : nodeConfig?.label || '';
                const errMsgs: string[] = [];

                if (nodesMap.has(id)) {
                    const [node1, node2] = nodes.filter(item => item.id === id);
                    errMsgs.push(
                        getIntlText('workflow.valid.node_id_duplicated', {
                            1:
                                node1.data?.nodeName ||
                                `${getIntlText(nodeConfigs[node1.type as WorkflowNodeType].labelIntlKey)}(${id})`,
                            2:
                                node2.data?.nodeName ||
                                `${getIntlText(nodeConfigs[node2.type as WorkflowNodeType].labelIntlKey)}(${id})`,
                        }),
                    );
                } else {
                    nodesMap.set(id, true);
                }

                if (!isMatches(id, ID_PATTERN)) {
                    errMsgs.push(
                        getIntlText('workflow.valid.invalid_node_id', {
                            1: nodeName || `${nodeLabel}(${id})`,
                        }),
                    );
                }

                if (errMsgs.length) {
                    result[id] = {
                        type: type as WorkflowNodeType,
                        label: nodeLabel,
                        name: nodeName,
                        status: 'ERROR',
                        errMsgs,
                    };
                }

                if (!options?.validateFirst || !errMsgs.length) continue;
                toast.error({
                    key: NODE_VALIDATE_TOAST_KEY,
                    content: errMsgs[0],
                });
                return result;
            }

            return Object.values(result).some(item => item.errMsgs.length) ? result : undefined;
        },
        [nodeConfigs, getNodes, getIntlText],
    );

    // Check Nodes Type
    const checkNodesType = useCallback(
        (nodes?: WorkflowNode[], options?: CheckOptions) => {
            nodes = nodes || getNodes();
            const result: NodesDataValidResult = {};

            for (let i = 0; i < nodes.length; i++) {
                const { id, type, data, componentName } = nodes[i];
                const nodeType = type as WorkflowNodeType;

                if (nodeConfigs[nodeType] && nodeConfigs[nodeType].componentName === componentName)
                    continue;

                result[id] = {
                    type: nodeType,
                    status: 'ERROR',
                    errMsgs: [
                        getIntlText('workflow.valid.invalid_node_type', {
                            1: data.nodeName || id,
                        }),
                    ],
                };

                if (!options?.validateFirst) continue;
                toast.error({
                    key: NODE_VALIDATE_TOAST_KEY,
                    content: result[id].errMsgs[0],
                });
                return result;
            }

            return Object.values(result).some(item => item.errMsgs.length) ? result : undefined;
        },
        [nodeConfigs, getNodes, getIntlText],
    );

    // Check Edges ID, the rule is same with node ID
    const checkEdgesId = useCallback(
        (edges?: WorkflowEdge[], nodes?: WorkflowNode[], options?: CheckOptions) => {
            edges = edges || getEdges();
            nodes = nodes || getNodes();
            const result: Record<
                string,
                { id: string; status: WorkflowNodeStatus; errMsgs: string[] }
            > = {};
            const edgesMap = new Map();

            for (let i = 0; i < edges.length; i++) {
                const { id, source, target } = edges[i];

                const sourceNode = nodes.find(node => node.id === source);
                const targetNode = nodes.find(node => node.id === target);
                const errMsgs: string[] = [];

                if (edgesMap.has(id)) {
                    errMsgs.push(
                        getIntlText('workflow.valid.edge_id_duplicated', {
                            1:
                                sourceNode?.data?.nodeName ||
                                `${getIntlText(nodeConfigs[sourceNode?.type as WorkflowNodeType]?.labelIntlKey || '')}(${id})`,
                            2:
                                targetNode?.data?.nodeName ||
                                `${getIntlText(nodeConfigs[targetNode?.type as WorkflowNodeType]?.labelIntlKey || '')}(${id})`,
                        }),
                    );
                } else {
                    edgesMap.set(id, true);
                }

                if (!isMatches(id, ID_PATTERN)) {
                    errMsgs.push(
                        getIntlText('workflow.valid.invalid_edge_id', {
                            1: sourceNode?.data.nodeName || source,
                            2: targetNode?.data.nodeName || target,
                        }),
                    );
                }

                if (errMsgs.length) {
                    result[id] = {
                        id,
                        status: 'ERROR',
                        errMsgs: [
                            getIntlText('workflow.valid.invalid_edge_id', {
                                1: sourceNode?.data.nodeName || source,
                                2: targetNode?.data.nodeName || target,
                            }),
                        ],
                    };
                }

                if (!options?.validateFirst || !errMsgs.length) continue;
                toast.error({
                    key: EDGE_VALIDATE_TOAST_KEY,
                    content: errMsgs[0],
                });
                return result;
            }

            const errors = Object.values(result);
            const isSuccess = !errors.some(item => item.errMsgs.length);

            if (isSuccess) return;

            toast.error({ key: EDGE_VALIDATE_TOAST_KEY, content: errors[0].errMsgs[0] });
            return result;
        },
        [nodeConfigs, getEdges, getNodes, getIntlText],
    );

    // Check Edges Type
    const checkEdgesType = useCallback(
        (edges?: WorkflowEdge[], nodes?: WorkflowNode[], options?: CheckOptions) => {
            edges = edges || getEdges();
            nodes = nodes || getNodes();
            const result: Record<
                string,
                { id: string; status: WorkflowNodeStatus; errMsgs: string[] }
            > = {};

            for (let i = 0; i < edges.length; i++) {
                const { id, type, source, target } = edges[i];

                if (type === EDGE_TYPE_ADDABLE) continue;
                const sourceNode = nodes.find(node => node.id === source);
                const targetNode = nodes.find(node => node.id === target);

                result[id] = {
                    id,
                    status: 'ERROR',
                    errMsgs: [
                        getIntlText('workflow.valid.invalid_edge_type', {
                            1: sourceNode?.data.nodeName || source,
                            2: targetNode?.data.nodeName || target,
                        }),
                    ],
                };

                if (!options?.validateFirst || !result[id].errMsgs.length) continue;
                toast.error({
                    key: EDGE_VALIDATE_TOAST_KEY,
                    content: result[id].errMsgs[0],
                });
                return result;
            }

            const errors = Object.values(result);
            const isSuccess = !errors.some(item => item.errMsgs.length);

            if (isSuccess) return;

            toast.error({ key: EDGE_VALIDATE_TOAST_KEY, content: errors[0].errMsgs[0] });
            return result;
        },
        [getEdges, getNodes, getIntlText],
    );

    // Check Nodes Data
    const checkNodesData = useCallback(
        (nodes?: WorkflowNode[], options?: CheckOptions) => {
            nodes = nodes || getNodes();
            const result: NodesDataValidResult = {};

            for (let i = 0; i < nodes.length; i++) {
                const { id, type, data } = nodes[i];
                const nodeType = type as WorkflowNodeType;
                const config = nodeConfigs[nodeType];
                const { nodeName, nodeRemark, parameters = {} } = data || {};
                let tempResult = result[id];

                if (!tempResult) {
                    tempResult = {
                        type: nodeType,
                        label: config?.labelIntlKey
                            ? getIntlText(config.labelIntlKey)
                            : config.label || '',
                        name: nodeName,
                        status: 'SUCCESS',
                        errMsgs: [],
                    };
                    result[id] = tempResult;
                }

                // Node name check
                Object.values(dataValidators.nodeName).forEach(validator => {
                    const result = validator(nodeName, getIntlText('common.label.name'));
                    if (result && result !== true) {
                        tempResult.errMsgs.push(result);
                    }
                });

                // Node remark check
                Object.values(dataValidators.nodeRemark).forEach(validator => {
                    const result = validator(nodeRemark, getIntlText('common.label.remark'));
                    if (result && result !== true) {
                        tempResult.errMsgs.push(result);
                    }
                });

                const dynamicValidators = getDynamicValidators(id, nodeType);
                const validators = merge({}, dataValidators, dynamicValidators);

                const nodeCheckers = Object.keys(validators).filter(key =>
                    key.startsWith(`${type}.`),
                );

                nodeCheckers?.forEach(name => {
                    const key = name.replace(`${type}.`, '');
                    const checkerMap = validators[name] || validators[key] || {};

                    Object.values(checkerMap).forEach(validator => {
                        const result = validator(parameters[key], key);
                        if (result && result !== true) {
                            tempResult.errMsgs.push(result);
                        }
                    });
                });

                if (options?.validateFirst && tempResult.errMsgs.length) {
                    toast.error({ key: 'node-validate', content: tempResult.errMsgs[0] });
                    return result;
                }
            }

            Object.entries(result).forEach(([id, data]) => {
                if (!data.errMsgs.length) {
                    delete result[id];
                } else {
                    data.status = 'ERROR';
                }
            });

            return Object.values(result).some(item => item.errMsgs.length) ? result : undefined;
        },
        [dataValidators, nodeConfigs, getIntlText, getNodes, getDynamicValidators],
    );

    return {
        checkNodesId,
        checkNodesType,
        checkEdgesId,
        checkEdgesType,
        checkNodesData,
    };
};

export default useValidate;
