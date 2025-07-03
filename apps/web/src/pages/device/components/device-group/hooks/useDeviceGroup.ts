import { useRequest, useMemoizedFn } from 'ahooks';

import { useI18n } from '@milesight/shared/src/hooks';
import { toast } from '@milesight/shared/src/components';

import { useConfirm } from '@/components';
import type { DeviceGroupItemType } from '../components/body/hooks/useBody';

/**
 * Handle device group many operation
 */
export function useDeviceGroup() {
    const { getIntlText } = useI18n();
    const confirm = useConfirm();

    const {
        run: getDeviceGroups,
        data: deviceGroups,
        loading,
    } = useRequest(
        async (keyword?: string) => {
            console.log('getDeviceGroups ? ', keyword);

            await new Promise(resolve => {
                setTimeout(() => {
                    resolve(null);
                }, 1000);
            });

            return [
                ...Array.from({ length: 100 }).map((_, index) => ({
                    id: index + 1,
                    name: `分组${index + 1}`,
                })),
            ] as DeviceGroupItemType[];
        },
        {
            debounceWait: 300,
        },
    );

    const handleGroupDelete = useMemoizedFn((record: DeviceGroupItemType) => {
        confirm({
            title: getIntlText('common.label.delete'),
            description: getIntlText('device.tip.delete_device_group'),
            confirmButtonText: getIntlText('common.label.delete'),
            confirmButtonProps: {
                color: 'error',
            },
            onConfirm: async () => {
                if (!record?.id) return;

                console.log('handleGroupDelete ? ', record);

                getDeviceGroups?.();
                toast.success(getIntlText('common.message.delete_success'));
            },
        });
    });

    return {
        loading,
        deviceGroups,
        getDeviceGroups,
        handleGroupDelete,
    };
}
