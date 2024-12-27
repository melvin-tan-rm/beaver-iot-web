import { useState } from 'react';
import { useMemoizedFn } from 'ahooks';

/**
 * user operate hooks
 */
const useUser = (getAllUsers?: () => void) => {
    // ---------- add new user ------------------------
    const [addModalVisible, setAddModalVisible] = useState(false);

    const showAddModal = useMemoizedFn(() => {
        setAddModalVisible(true);
    });

    const handleModalCancel = useMemoizedFn(() => {
        setAddModalVisible(false);
    });

    const handleAddUser = useMemoizedFn(async (name: string) => {
        getAllUsers?.();
        setAddModalVisible(false);
    });

    return {
        addModalVisible,
        showAddModal,
        handleModalCancel,
        handleAddUser,
    };
};

export default useUser;
