import { useState } from 'react';
import { useMemoizedFn } from 'ahooks';

export default function useDevice() {
    const [isShrink, setIsShrink] = useState(false);

    const toggleShrink = useMemoizedFn(() => {
        setIsShrink(!isShrink);
    });

    return {
        /**
         * Whether to shrink the device group
         */
        isShrink,
        /**
         * toggle the device group shrink status
         */
        toggleShrink,
    };
}
