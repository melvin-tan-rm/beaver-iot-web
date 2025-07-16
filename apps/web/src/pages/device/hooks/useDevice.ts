import { useMemo, useState, useRef } from 'react';
import { useMemoizedFn } from 'ahooks';

import useDeviceStore from '../store';
import { type DeviceGroupExposeProps } from '../components/device-group';

export default function useDevice() {
    const { activeGroup } = useDeviceStore();

    const [isShrink, setIsShrink] = useState(false);

    const deviceGroupRef = useRef<DeviceGroupExposeProps>(null);

    const activeGroupName = useMemo(() => {
        return activeGroup?.name || '';
    }, [activeGroup]);

    const toggleShrink = useMemoizedFn(() => {
        setIsShrink(!isShrink);
    });

    return {
        /**
         * Whether to shrink the device group
         */
        isShrink,
        /**
         * The current active group name
         */
        activeGroupName,
        /**
         * toggle the device group shrink status
         */
        deviceGroupRef,
        toggleShrink,
    };
}
