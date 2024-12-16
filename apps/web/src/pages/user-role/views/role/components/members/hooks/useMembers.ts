import { useState } from 'react';
import { useMemoizedFn } from 'ahooks';

/**
 * members operate hooks
 */
const useMembers = () => {
    // ---------- add new members ------------------------
    const [addModalVisible, setAddModalVisible] = useState(false);

    const showAddModal = useMemoizedFn(() => {
        setAddModalVisible(true);
    });

    const handleModalCancel = useMemoizedFn(() => {
        setAddModalVisible(false);
    });

    const handleModalOk = useMemoizedFn(() => {
        // TODO: add new members logic
        console.log('add new members');

        setAddModalVisible(false);
    });

    return {
        addModalVisible,
        showAddModal,
        handleModalCancel,
    };
};

export default useMembers;
