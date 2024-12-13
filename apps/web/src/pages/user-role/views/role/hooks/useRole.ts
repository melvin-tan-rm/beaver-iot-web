import { useState } from 'react';
import { useMemoizedFn } from 'ahooks';

import { toast } from '@milesight/shared/src/components';
import { useI18n } from '@milesight/shared/src/hooks';

import { type RoleType } from '@/services/http';
import { ROLE_MORE_OPERATION } from '../components';
import { MODAL_TYPE } from '../constants';

/**
 * Handle role add、rename、delete etc...
 */
export function useRole() {
    const { getIntlText } = useI18n();

    const [roleData, setRoleData] = useState<RoleType[]>([]);
    const [activeRole, setActiveRole] = useState<RoleType>();

    /**
     * edit modal status
     */
    const [addModalVisible, setAddModalVisible] = useState(false);
    const [modalTitles, setModalTitles] = useState(getIntlText('user.label.add_role'));
    const [modalData, setModalData] = useState<string>('');

    const handleAddRole = useMemoizedFn((name: string): Promise<void> => {
        return new Promise(resolve => {
            setTimeout(() => {
                setRoleData(
                    Array.from({ length: 8 }).map((_, index) => ({
                        role_id: index,
                        name: `${name} ${index}`,
                    })),
                );

                resolve();
                setAddModalVisible(false);
                toast.success('onSubmit');
            }, 1000);
        });
    });

    const showAddModal = useMemoizedFn((type: MODAL_TYPE) => {
        setModalTitles(
            type === MODAL_TYPE.ADD
                ? getIntlText('user.label.add_role')
                : getIntlText('user.label.rename_role'),
        );
        setModalData(type === MODAL_TYPE.EDIT ? activeRole?.name || '' : '');
        setAddModalVisible(true);
    });

    const handleSearch = useMemoizedFn((value: string) => {
        console.log('Search value:', value);
    });

    const handleRoleClick = useMemoizedFn((role: RoleType) => {
        setActiveRole(role);
    });

    const handleRoleOperate = useMemoizedFn((operate: ROLE_MORE_OPERATION) => {
        if (operate === ROLE_MORE_OPERATION.RENAME) {
            showAddModal(MODAL_TYPE.EDIT);
        }

        console.log('operate ? ', operate);
    });

    return {
        roleData,
        activeRole,
        handleAddRole,
        handleSearch,
        handleRoleClick,
        handleRoleOperate,
        addModalVisible,
        setAddModalVisible,
        showAddModal,
        modalTitles,
        modalData,
    };
}
