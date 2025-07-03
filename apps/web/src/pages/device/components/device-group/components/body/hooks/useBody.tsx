import { useState, useMemo } from 'react';
import { useMemoizedFn } from 'ahooks';

import { useI18n } from '@milesight/shared/src/hooks';
import {
    FolderOpenOutlinedIcon,
    DashboardIcon,
    HelpOutlinedIcon,
} from '@milesight/shared/src/components';

export enum FixedGroupEnum {
    /** All device */
    ALL = 'ALL',
    /** Ungrouped device */
    UNGROUPED = 'UNGROUPED',
}

export type DeviceGroupItemType = ObjectToCamelCase<{
    id: ApiKey;
    name: string;
}>;

export function useBody(deviceGroups?: DeviceGroupItemType[]) {
    const { getIntlText } = useI18n();

    const FIXED_GROUP = useMemo(
        () => [
            {
                id: FixedGroupEnum.ALL,
                name: getIntlText('device.label.all_devices'),
            },
            {
                id: FixedGroupEnum.UNGROUPED,
                name: getIntlText('device.label.ungrouped_devices'),
            },
        ],
        [getIntlText],
    );

    const data: DeviceGroupItemType[] = useMemo(
        () => [...FIXED_GROUP, ...(deviceGroups || [])],
        [FIXED_GROUP, deviceGroups],
    );

    const [activeGroup, setActiveGroup] = useState<DeviceGroupItemType>(data[0]);

    const handleGroupClick = useMemoizedFn((item: DeviceGroupItemType) => {
        setActiveGroup(item);
    });

    const hiddenMore = useMemoizedFn((id: ApiKey) => {
        return ([FixedGroupEnum.ALL, FixedGroupEnum.UNGROUPED] as ApiKey[]).includes(id);
    });

    const groupItemIcon = useMemoizedFn((id: ApiKey) => {
        if (id === FixedGroupEnum.ALL) {
            return <DashboardIcon color="action" />;
        }

        if (id === FixedGroupEnum.UNGROUPED) {
            return <HelpOutlinedIcon color="action" />;
        }

        return <FolderOpenOutlinedIcon color="action" />;
    });

    return {
        data,
        /** Current selected group */
        activeGroup,
        handleGroupClick,
        /** Whether to hidden the more dropdown */
        hiddenMore,
        groupItemIcon,
    };
}
