import { useState } from 'react';
import { useMemoizedFn } from 'ahooks';

import { useI18n } from '@milesight/shared/src/hooks';
import { toast } from '@milesight/shared/src/components';

import { type BatchAddProps, type BatchAddStatus } from '../components/batch-add-modal';

export default function useBatchAddModal(getDevices?: () => void) {
    const { getIntlText } = useI18n();

    const [batchAddModalVisible, setBatchAddModalVisible] = useState(false);
    const [batchAddStatus, setBatchAddStatus] = useState<BatchAddStatus>('beforeAdd');

    const openBatchGroupModal = useMemoizedFn(() => {
        setBatchAddModalVisible(true);
        setBatchAddStatus('beforeAdd');
    });

    const hiddenBatchGroupModal = useMemoizedFn(() => {
        setBatchAddModalVisible(false);
    });

    const batchAddFormSubmit = useMemoizedFn(async (data: BatchAddProps, callback: () => void) => {
        console.log('batchAddFormSubmit data ? ', data);

        /**
         * Currently it the process of adding, indicating that
         * the addition is completed and close modal
         */
        if (batchAddStatus === 'adding') {
            setBatchAddModalVisible(false);
            getDevices?.();
            callback?.();
            toast.success(getIntlText('common.message.operation_success'));
            return;
        }

        /**
         * The current status is before add, indicating that
         * it is about to enter the adding status
         */
        await new Promise(resolve => {
            setTimeout(() => {
                resolve(null);
            }, 1000);
        });

        setBatchAddStatus('adding');
    });

    return {
        batchAddModalVisible,
        batchAddStatus,
        openBatchGroupModal,
        hiddenBatchGroupModal,
        batchAddFormSubmit,
    };
}
