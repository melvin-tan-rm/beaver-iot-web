import { useState } from 'react';
import { useMemoizedFn } from 'ahooks';

/**
 * integrations operate hooks
 */
const useIntegrations = (getRoleIntegrations?: () => void) => {
    // ---------- add new members ------------------------
    const [addModalVisible, setAddModalVisible] = useState(false);

    const showAddModal = useMemoizedFn(() => {
        setAddModalVisible(true);
    });

    const handleModalCancel = useMemoizedFn(() => {
        setAddModalVisible(false);
    });

    const handleModalOk = useMemoizedFn(() => {
        getRoleIntegrations?.();
        setAddModalVisible(false);
    });

    return {
        addModalVisible,
        showAddModal,
        handleModalCancel,
        handleModalOk,
    };
};

export default useIntegrations;
