import { useState } from 'react';
import { useMemoizedFn } from 'ahooks';

import { useI18n } from '@milesight/shared/src/hooks';
import { toast } from '@milesight/shared/src/components';

import { type BatchAddProps } from '../components/batch-add-modal';

export default function useBatchAddModal(getDevices?: () => void) {
    const { getIntlText } = useI18n();

    const [batchAddModalVisible, setBatchAddModalVisible] = useState(false);

    const openBatchGroupModal = useMemoizedFn(() => {
        setBatchAddModalVisible(true);
    });

    const hiddenBatchGroupModal = useMemoizedFn(() => {
        setBatchAddModalVisible(false);
    });

    const batchAddFormSubmit = useMemoizedFn(async (data: BatchAddProps, callback: () => void) => {
        console.log('batchAddFormSubmit data ? ', data);

        await new Promise(resolve => {
            setTimeout(() => {
                resolve(null);
            }, 1000);
        });

        getDevices?.();
        callback?.();
        setBatchAddModalVisible(false);
        toast.success(getIntlText('common.message.operation_success'));
    });

    return {
        batchAddModalVisible,
        openBatchGroupModal,
        hiddenBatchGroupModal,
        batchAddFormSubmit,
    };
}
