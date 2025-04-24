import { useMemo } from 'react';
import { type ControllerProps } from 'react-hook-form';
import {
    TextField,
    FormControl,
    FormControlLabel,
    InputLabel,
    Select,
    Switch,
    MenuItem,
    IconButton,
} from '@mui/material';
import { cloneDeep } from 'lodash-es';
import { useCopy } from '@milesight/shared/src/hooks';
import { KeyboardArrowDownIcon, ContentCopyIcon } from '@milesight/shared/src/components';
import { ActionInput } from '@/components';
import { NodeFormItemValueType } from '../../../typings';
import useFlowStore from '../../../store';
import {
    CodeEditor,
    ConditionsInput,
    EntityAssignSelect,
    EntityMultipleSelect,
    EntitySelect,
    ParamAssignInput,
    TimerInput,
    EmailContent,
    ParamInput,
    ServiceParamAssignInput,
    EmailSendSource,
    EmailRecipients,
    HttpBodyInput,
    type EntityAssignSelectProps,
    type EntityMultipleSelectProps,
} from '../components';

type NodeFormGroupType = {
    groupType?: string;
    groupName?: string;
    helperText?: string;
    children?: (ControllerProps<NodeFormDataProps> & {
        valueType?: NodeFormItemValueType;
        /**
         * To Control whether the current component is rendered
         */
        shouldRender?: (data: NodeFormDataProps) => boolean;
    })[];
};

/**
 * Form Item Props
 */
export type NodeFormDataProps = Record<string, any>;

interface Props {
    readonly?: boolean;
    nodeId?: string;
    nodeType?: WorkflowNodeType;
}

const selectNodeEntityFilterModel: EntityMultipleSelectProps['filterModel'] = {
    type: ['PROPERTY'],
    accessMode: ['R', 'RW'],
};

const assignerNodeEntityFilterModel: EntityAssignSelectProps['filterModel'] = {
    type: ['PROPERTY'],
    accessMode: ['W', 'RW'],
};

const useNodeFormItems = ({ nodeId, nodeType, readonly }: Props) => {
    const nodeConfigs = useFlowStore(state => state.nodeConfigs);
    const { handleCopy } = useCopy();

    const formConfigs = useMemo(() => {
        if (!Object.keys(nodeConfigs).length) return {};

        // console.log({ nodeConfigs });
        const result: Partial<Record<WorkflowNodeType, NodeFormGroupType[]>> = {};
        Object.entries(nodeConfigs).forEach(([_, nodeConfig]) => {
            const nodeType = nodeConfig.type;
            const { properties = {}, outputProperties = {} } = nodeConfig.schema || {};
            const configs = cloneDeep(Object.entries(properties))
                .filter(([_, item]) => !item.autowired)
                .map(([name, item]) => {
                    item.name = item.name || name;
                    return item;
                })
                .sort((a, b) => (a.index || 0) - (b.index || 0))
                .concat(
                    cloneDeep(Object.entries(outputProperties))
                        .filter(([_, item]) => !item.autowired && item.editable)
                        .map(([name, item]) => {
                            item.name = item.name || name;
                            return item;
                        })
                        .sort((a, b) => (a.index || 0) - (b.index || 0)),
                );
            const formGroups: NodeFormGroupType[] = [];

            result[nodeType as WorkflowNodeType] = formGroups;
            configs.forEach(
                ({
                    name,
                    type,
                    secret,
                    required,
                    enum: enums,
                    defaultValue,
                    displayName,
                    description,
                    uiComponent,
                    uiComponentGroup,
                }) => {
                    const groupType = uiComponentGroup || name;
                    const groupName = uiComponentGroup || displayName;
                    const helperText = description;
                    let group = formGroups.find(item => item.groupType === groupType);

                    if (!group) {
                        group = {
                            groupType,
                            groupName,
                            helperText,
                            children: [],
                        };
                        formGroups.push(group);
                    }

                    const formItem: NonNullable<NodeFormGroupType['children']>[0] = {
                        name,
                        valueType: type,
                        render({ field: { onChange, value } }) {
                            return (
                                <TextField
                                    fullWidth
                                    type={secret ? 'password' : undefined}
                                    autoComplete={secret ? 'new-password' : 'off'}
                                    sx={{ my: 1.5 }}
                                    required={required}
                                    label={displayName}
                                    defaultValue={defaultValue}
                                    value={value || ''}
                                    onChange={onChange}
                                />
                            );
                        },
                    };

                    if (uiComponent) {
                        switch (uiComponent) {
                            case 'paramDefineInput': {
                                formItem.render = ({ field: { onChange, value } }) => {
                                    return (
                                        <ParamInput
                                            required={required}
                                            showRequired={nodeType === 'trigger'}
                                            isOutput={nodeType === 'code' || nodeType === 'service'}
                                            value={value}
                                            onChange={onChange}
                                        />
                                    );
                                };
                                break;
                            }
                            case 'paramAssignInput': {
                                formItem.render = ({ field: { onChange, value } }) => {
                                    return (
                                        <ParamAssignInput
                                            required={!!required}
                                            minCount={1}
                                            disableInput={nodeType === 'output'}
                                            value={value}
                                            onChange={onChange}
                                        />
                                    );
                                };
                                break;
                            }
                            case 'EntitySelect': {
                                formItem.render = ({ field: { onChange, value } }) => {
                                    return (
                                        <EntitySelect
                                            required={required}
                                            value={value}
                                            onChange={onChange}
                                        />
                                    );
                                };
                                break;
                            }
                            case 'entityMultipleSelect': {
                                formItem.render = ({ field: { onChange, value } }) => {
                                    const filterModel =
                                        nodeType !== 'select'
                                            ? undefined
                                            : selectNodeEntityFilterModel;
                                    return (
                                        <EntityMultipleSelect
                                            required={required}
                                            filterModel={filterModel}
                                            value={value}
                                            onChange={onChange}
                                        />
                                    );
                                };
                                break;
                            }
                            case 'entityAssignSelect': {
                                formItem.render = ({ field: { onChange, value } }) => {
                                    const filterModel =
                                        nodeType !== 'assigner'
                                            ? undefined
                                            : assignerNodeEntityFilterModel;
                                    return (
                                        <EntityAssignSelect
                                            required={required}
                                            filterModel={filterModel}
                                            value={value}
                                            onChange={onChange}
                                        />
                                    );
                                };
                                break;
                            }
                            case 'timerSettings': {
                                formItem.render = ({ field: { onChange, value } }) => {
                                    return (
                                        <TimerInput
                                            required={required}
                                            value={value}
                                            onChange={onChange}
                                        />
                                    );
                                };
                                break;
                            }
                            case 'conditionsInput': {
                                formItem.render = ({ field: { onChange, value } }) => {
                                    return <ConditionsInput value={value} onChange={onChange} />;
                                };
                                break;
                            }
                            case 'codeEditor': {
                                formItem.render = ({ field: { onChange, value } }) => {
                                    return (
                                        <CodeEditor
                                            autoFillDefaultValue={nodeType === 'code'}
                                            readOnly={readonly}
                                            editable={!readonly}
                                            value={value}
                                            onChange={onChange}
                                        />
                                    );
                                };
                                break;
                            }
                            case 'serviceEntitySetting': {
                                formItem.render = ({ field: { onChange, value } }) => {
                                    return (
                                        <ServiceParamAssignInput
                                            name={name}
                                            nodeId={nodeId}
                                            nodeType={nodeType}
                                            required={required}
                                            value={value}
                                            onChange={onChange}
                                        />
                                    );
                                };
                                break;
                            }
                            case 'emailContent': {
                                formItem.render = ({ field: { onChange, value } }) => {
                                    return <EmailContent value={value} onChange={onChange} />;
                                };
                                break;
                            }
                            case 'emailSendSource': {
                                formItem.render = ({ field: { onChange, value } }) => {
                                    return <EmailSendSource value={value} onChange={onChange} />;
                                };
                                break;
                            }
                            case 'emailRecipients': {
                                formItem.render = ({ field: { onChange, value } }) => {
                                    return <EmailRecipients value={value} onChange={onChange} />;
                                };
                                break;
                            }
                            case 'httpBodyInput': {
                                formItem.render = ({ field: { onChange, value } }) => {
                                    return (
                                        <HttpBodyInput
                                            required={required}
                                            value={value}
                                            onChange={onChange}
                                        />
                                    );
                                };
                                break;
                            }
                            case 'mqttTopicInput': {
                                formItem.render = ({ field: { onChange, value } }) => {
                                    // TODO: Replace with a real topic prefix
                                    const topicPrefix = 'beaver-iot/$username/';
                                    return (
                                        <ActionInput
                                            // size="small"
                                            autoComplete="off"
                                            label={displayName}
                                            required={required}
                                            value={value}
                                            onChange={onChange}
                                            startAdornment={topicPrefix}
                                            endAdornment={
                                                <IconButton
                                                    aria-label="copy text"
                                                    disabled={!value}
                                                    onClick={e => {
                                                        handleCopy(
                                                            value || '',
                                                            (e.target as HTMLElement)
                                                                ?.parentElement,
                                                        );
                                                    }}
                                                >
                                                    <ContentCopyIcon />
                                                </IconButton>
                                            }
                                        />
                                    );
                                };
                                break;
                            }
                            default: {
                                break;
                            }
                        }
                    } else if (enums && (enums.length || Object.keys(enums).length)) {
                        const options = !Array.isArray(enums)
                            ? enums
                            : enums.reduce(
                                  (acc, item) => {
                                      acc[item] = item;
                                      return acc;
                                  },
                                  {} as Record<string, string>,
                              );
                        formItem.render = ({ field: { onChange, value } }) => {
                            return (
                                <FormControl fullWidth size="small" sx={{ my: 1.5 }}>
                                    <InputLabel required={required} id={`select-label-${name}`}>
                                        {displayName}
                                    </InputLabel>
                                    <Select
                                        notched
                                        label={displayName}
                                        labelId={`select-label-${name}`}
                                        IconComponent={KeyboardArrowDownIcon}
                                        required={required}
                                        value={value || ''}
                                        onChange={onChange}
                                    >
                                        {Object.entries(options).map(([key, label]) => (
                                            <MenuItem key={key} value={key}>
                                                {label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            );
                        };
                    } else {
                        switch (type) {
                            case 'map':
                            case 'array':
                            case 'object': {
                                formItem.render = ({ field: { onChange, value } }) => {
                                    return (
                                        <TextField
                                            fullWidth
                                            multiline
                                            rows={4}
                                            required={required}
                                            label={displayName}
                                            value={value}
                                            onChange={onChange}
                                        />
                                    );
                                };
                                break;
                            }
                            case 'boolean': {
                                formItem.render = ({ field: { onChange, value } }) => {
                                    return (
                                        <FormControl fullWidth size="small" sx={{ my: 1.5 }}>
                                            <FormControlLabel
                                                label={displayName}
                                                required={required}
                                                checked={!!value}
                                                onChange={onChange}
                                                control={<Switch size="small" />}
                                                sx={{ fontSize: '12px' }}
                                            />
                                        </FormControl>
                                    );
                                };
                                break;
                            }
                            default: {
                                break;
                            }
                        }
                    }

                    group.children?.push(formItem);
                },
            );
        });

        return result;
    }, [nodeConfigs, nodeId, readonly, handleCopy]);

    return !nodeType ? [] : formConfigs[nodeType] || [];
};

export default useNodeFormItems;
