import { useMemo, useState } from 'react';
import { useMemoizedFn } from 'ahooks';

import useDeviceStore from '../store';

export default function useDevice() {
    const { activeGroup } = useDeviceStore();

    const [isShrink, setIsShrink] = useState(false);

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
        toggleShrink,
    };
}
