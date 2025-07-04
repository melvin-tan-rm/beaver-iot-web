import intl from 'react-intl-universal';

export enum FixedGroupEnum {
    /** All device */
    ALL = 'ALL',
    /** Ungrouped device */
    UNGROUPED = 'UNGROUPED',
}

export const FIXED_GROUP = [
    {
        id: FixedGroupEnum.ALL,
        name: intl.get('device.label.all_devices').d('device.label.all_devices'),
    },
    {
        id: FixedGroupEnum.UNGROUPED,
        name: intl.get('device.label.ungrouped_devices').d('device.label.ungrouped_devices'),
    },
];
