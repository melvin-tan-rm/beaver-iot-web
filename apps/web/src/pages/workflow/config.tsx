import { CircularProgress } from '@mui/material';
import {
    SettingsEthernetIcon,
    EntityIcon,
    RoomServiceIcon,
    EmailIcon,
    WebhookIcon,
    TimerIcon,
    HearingIcon,
    InputIcon,
    CallSplitIcon,
    FactCheckIcon,
    CheckCircleIcon,
    ErrorIcon,
    // FlagIcon,
} from '@milesight/shared/src/components';

type NodeCategoryConfigItemType = {
    /** Node Category i18n key */
    labelIntlKey: string;
};

/**
 * Node category configs
 */
export const nodeCategoryConfigs: Record<WorkflowNodeCategoryType, NodeCategoryConfigItemType> = {
    entry: {
        labelIntlKey: 'workflow.label.node_category_entry',
    },
    control: {
        labelIntlKey: 'workflow.label.node_category_control',
    },
    action: {
        labelIntlKey: 'workflow.label.node_category_action',
    },
    external: {
        labelIntlKey: 'workflow.label.node_category_external',
    },
};

/**
 * Node config item type
 */
export type NodeConfigItemType = {
    /**
     * Node Type
     */
    type: WorkflowNodeType;
    /**
     * Backend component name
     */
    componentName: string;
    /**
     * Label i18n key
     */
    labelIntlKey: string;
    /**
     * Description i18n key
     */
    descIntlKey?: string;
    /**
     * Node Icon
     */
    icon: React.ReactNode;
    /**
     * Node Icon background color
     */
    iconBgColor: string;
    /**
     * Node Category
     */
    category: WorkflowNodeCategoryType;
    /**
     * Enable independent testing
     */
    testable?: boolean;
    /**
     * The keys that can be used in test input
     */
    testInputKeys?: {
        key: string;
        type: 'object' | 'array' | 'string';
    }[];
    /**
     * The keys that can be referenced in downstream node
     */
    outputKeys?: string[];
};

/**
 * Basic node configs
 */
export const basicNodeConfigs: Record<WorkflowNodeType, NodeConfigItemType> = {
    timer: {
        type: 'timer',
        componentName: 'simpleTimer',
        labelIntlKey: 'workflow.label.timer_node_name',
        descIntlKey: 'workflow.label.timer_node_desc',
        icon: <TimerIcon />,
        iconBgColor: '#3491FA',
        category: 'entry',
    },
    trigger: {
        type: 'trigger',
        componentName: 'trigger',
        labelIntlKey: 'workflow.label.trigger_node_name',
        descIntlKey: 'workflow.label.trigger_node_desc',
        icon: <InputIcon />,
        iconBgColor: '#3491FA',
        category: 'entry',
        testInputKeys: [
            {
                key: 'entityConfigs',
                type: 'array',
            },
        ],
        outputKeys: ['entityConfigs'],
    },
    listener: {
        type: 'listener',
        componentName: 'eventListener',
        labelIntlKey: 'workflow.label.listener_node_name',
        descIntlKey: 'workflow.label.listener_node_desc',
        icon: <HearingIcon />,
        iconBgColor: '#3491FA',
        category: 'entry',
        testInputKeys: [
            {
                key: 'entities',
                type: 'array',
            },
        ],
        outputKeys: ['entities'],
    },
    ifelse: {
        type: 'ifelse',
        componentName: 'choice',
        labelIntlKey: 'workflow.label.ifelse_node_name',
        icon: <CallSplitIcon sx={{ transform: 'rotate(90deg)' }} />,
        iconBgColor: '#F57C00',
        category: 'control',
    },
    // end: {
    //     type: 'end',
    //     labelIntlKey: 'workflow.label.end_node_name',
    //     icon: <FlagIcon />,
    //     iconBgColor: '#F57C00',
    //     category: 'control',
    // },
    code: {
        type: 'code',
        componentName: 'code',
        labelIntlKey: 'workflow.label.code_node_name',
        icon: <SettingsEthernetIcon />,
        iconBgColor: '#26A69A',
        category: 'action',
        testInputKeys: [
            {
                key: 'inputArguments',
                type: 'object',
            },
        ],
        outputKeys: ['payload'],
    },
    assigner: {
        type: 'assigner',
        componentName: 'entityAssigner',
        labelIntlKey: 'workflow.label.assigner_node_name',
        icon: <EntityIcon />,
        iconBgColor: '#26A69A',
        category: 'action',
        testInputKeys: [
            {
                key: 'exchangePayload',
                type: 'object',
            },
        ],
        outputKeys: ['exchangePayload'],
    },
    service: {
        type: 'service',
        componentName: 'serviceInvocation',
        labelIntlKey: 'workflow.label.service_node_name',
        icon: <RoomServiceIcon />,
        iconBgColor: '#26A69A',
        category: 'action',
        testInputKeys: [
            {
                key: 'serviceInvocationSetting.serviceParams',
                type: 'object',
            },
        ],
        outputKeys: ['payload'],
    },
    select: {
        type: 'select',
        componentName: 'entitySelector',
        labelIntlKey: 'workflow.label.select_node_name',
        icon: <FactCheckIcon />,
        iconBgColor: '#26A69A',
        category: 'action',
        testInputKeys: [
            {
                key: 'entities',
                type: 'array',
            },
        ],
        outputKeys: ['entities'],
    },
    email: {
        type: 'email',
        componentName: 'email',
        labelIntlKey: 'workflow.label.email_node_name',
        icon: <EmailIcon />,
        iconBgColor: '#7E57C2',
        category: 'external',
        testInputKeys: [
            {
                key: 'content',
                type: 'string',
            },
        ],
    },
    webhook: {
        type: 'webhook',
        componentName: 'webhook',
        labelIntlKey: 'workflow.label.webhook_node_name',
        icon: <WebhookIcon />,
        iconBgColor: '#7E57C2',
        category: 'external',
        testInputKeys: [
            {
                key: 'inputArguments',
                type: 'object',
            },
        ],
        outputKeys: ['inputArguments'],
    },
};

/**
 * Status Render Map
 */
export const LogStatusMap: Record<
    WorkflowNodeStatus | 'LOADING',
    { className: string; icon: React.ReactNode }
> = {
    SUCCESS: {
        className: 'ms-log-status__success',
        icon: <CheckCircleIcon />,
    },
    ERROR: {
        className: 'ms-log-status__error',
        icon: <ErrorIcon />,
    },
    LOADING: {
        className: 'ms-log-status__loading',
        icon: <CircularProgress size={16} />,
    },
};
