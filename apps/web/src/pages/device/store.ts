import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { FIXED_GROUP } from './constants';
import { type DeviceGroupItemType } from './components/device-group/components/body/hooks/useBody';

interface DeviceStore {
    /** current selected group */
    activeGroup?: DeviceGroupItemType;
    /** update current selected group data */
    updateActiveGroup: (group?: DeviceGroupItemType) => void;
}

/**
 * device global data
 */
const useDeviceStore = create(
    immer<DeviceStore>(set => ({
        activeGroup: FIXED_GROUP[0],
        updateActiveGroup(group) {
            set(state => {
                state.activeGroup = group;
            });
        },
    })),
);

export default useDeviceStore;
