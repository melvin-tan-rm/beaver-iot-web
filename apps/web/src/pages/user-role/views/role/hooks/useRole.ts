import { useState } from 'react';
import { useMemoizedFn, useRequest } from 'ahooks';

import { toast } from '@milesight/shared/src/components';
import { useI18n } from '@milesight/shared/src/hooks';

import {
    type RoleType,
    userAPI,
    getResponseData,
    awaitWrap,
    isRequestSuccess,
} from '@/services/http';
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
    const [modalType, setModalType] = useState<MODAL_TYPE>(MODAL_TYPE.ADD);

    /**
     * get all roles list data
     */
    const { loading } = useRequest(
        async () => {
            console.log('getAllRoles');

            const [err, resp] = await awaitWrap(
                userAPI.getAllRoles({
                    page_number: 1,
                    page_size: 999,
                }),
            );

            if (err || !isRequestSuccess(resp)) {
                return;
            }

            const list = getResponseData(resp);

            console.log('roles list ? ', list);
        },
        {
            refreshDeps: [],
        },
    );

    const handleAddRole = useMemoizedFn(async (name: string): Promise<void> => {
        const [err, resp] = await awaitWrap(
            userAPI.addRole({
                name,
            }),
        );

        if (err || !isRequestSuccess(resp)) {
            return;
        }

        setAddModalVisible(false);
        toast.success(getIntlText('common.message.add_success'));
    });

    const handleEditRole = useMemoizedFn(async (name: string): Promise<void> => {
        if (!activeRole) return;

        const [err, resp] = await awaitWrap(
            userAPI.editRole({
                roleId: activeRole.role_id,
                name,
            }),
        );

        if (err || !isRequestSuccess(resp)) {
            return;
        }

        setAddModalVisible(false);
        toast.success(getIntlText('common.message.add_success'));
    });

    const showAddModal = useMemoizedFn((type: MODAL_TYPE) => {
        setModalType(type);
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
        modalType,
        handleEditRole,
        loading: true,
    };
}
