import { useState } from 'react';
import { useMemoizedFn } from 'ahooks';

import { useI18n } from '@milesight/shared/src/hooks';
import { toast } from '@milesight/shared/src/components';

import { type ChangeGroupProps } from '../components/change-group-modal';
import { type TableRowDataType } from './useColumns';

export type OperateModalType = 'add' | 'edit';

export default function useGroupModal(getDevices?: () => void) {
    const { getIntlText } = useI18n();

    const [groupModalVisible, setGroupModalVisible] = useState(false);
    const [selectedDevices, setSelectedDevices] = useState<TableRowDataType[]>([]);

    const hiddenGroupModal = useMemoizedFn(() => {
        setGroupModalVisible(false);
    });

    /**
     * Change the group to which a single device belongs
     */
    const singleChangeGroupModal = useMemoizedFn((device: TableRowDataType) => {
        setGroupModalVisible(true);
        setSelectedDevices([device]);
    });

    /**
     * Bulk change the group to which a device belongs
     */
    const batchChangeGroupModal = useMemoizedFn((devices: TableRowDataType[]) => {
        setGroupModalVisible(true);
        setSelectedDevices(devices);
    });

    const changeGroupFormSubmit = useMemoizedFn(
        async (data: ChangeGroupProps, callback: () => void) => {
            console.log('changeGroupFormSubmit data ? ', data, selectedDevices);

            await new Promise(resolve => {
                setTimeout(() => {
                    resolve(null);
                }, 1000);
            });

            getDevices?.();
            callback?.();
            setGroupModalVisible(false);
            toast.success(getIntlText('common.message.operation_success'));
        },
    );

    return {
        groupModalVisible,
        singleChangeGroupModal,
        batchChangeGroupModal,
        hiddenGroupModal,
        changeGroupFormSubmit,
    };
}
