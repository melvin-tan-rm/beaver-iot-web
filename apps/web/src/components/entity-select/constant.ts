import type { TabType } from './types';

export const TabOptions: { label: string; value: TabType }[] = [
    {
        label: 'common.label.entity',
        value: 'entity',
    },
    {
        label: 'common.label.by_device',
        value: 'device',
    },
];

// default max count of selected entities
export const DEFAULT_MAX_COUNT = 5;
