import React, { useState } from 'react';
import { useMemoizedFn, useRequest } from 'ahooks';

import { useI18n } from '@milesight/shared/src/hooks';
import { Modal, type ModalProps } from '@milesight/shared/src/components';
import { objectToCamelCase } from '@milesight/shared/src/utils/tools';

import { userAPI, awaitWrap, getResponseData, isRequestSuccess } from '@/services/http';
import useUserRoleStore from '@/pages/user-role/store';
import { TableTransfer } from '@/components';
import { type TableRowDataType, useColumns } from './hooks';

/**
 * add member modal
 */
const AddMemberModal: React.FC<ModalProps> = props => {
    const { visible, onOk, ...restProps } = props;

    const { activeRole } = useUserRoleStore();
    const { getIntlText } = useI18n();
    const columns = useColumns();

    const [keyword, setKeyword] = useState<string>('');
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    const [chosenMember, setChosenMember] = useState<TableRowDataType[]>([]);

    const { data: undistributedMembers, loading } = useRequest(
        async () => {
            if (!activeRole) return;

            const { page, pageSize } = paginationModel;
            const [error, resp] = await awaitWrap(
                userAPI.getRoleUndistributedUsers({
                    keyword,
                    role_id: activeRole.roleId,
                    page_size: pageSize,
                    page_number: page + 1,
                }),
            );
            const respData = getResponseData(resp);

            if (error || !respData || !isRequestSuccess(resp)) return;

            return objectToCamelCase(respData);
        },
        {
            debounceWait: 300,
            refreshDeps: [keyword, paginationModel, activeRole],
        },
    );

    const handleOk = useMemoizedFn(() => {
        // onOk?.();

        console.log('handleOk ? ', chosenMember, undistributedMembers);
    });

    /**
     * right table selected items filter method
     */
    const handleSelectedFilter = useMemoizedFn((keyword, row: TableRowDataType) => {
        return (
            row.nickname?.toLowerCase()?.includes(keyword) ||
            row.email?.toLowerCase()?.includes(keyword)
        );
    });

    const renderModal = () => {
        if (visible) {
            return (
                <Modal
                    width="1200px"
                    visible={visible}
                    title={getIntlText('user.role.add_user_member_modal_title')}
                    sx={{
                        '& .MuiDialogContent-root': {
                            display: 'flex',
                        },
                    }}
                    onOk={handleOk}
                    {...restProps}
                >
                    <TableTransfer<TableRowDataType>
                        onChosen={setChosenMember}
                        selectedFilter={handleSelectedFilter}
                        sortField="createdAt"
                        tableProps={{
                            rows: undistributedMembers as any,
                            columns,
                            getRowId: row => row.userId,
                            paginationModel,
                            onPaginationModelChange: setPaginationModel,
                            onSearch: setKeyword,
                        }}
                    />
                </Modal>
            );
        }

        return null;
    };

    return renderModal();
};

export default AddMemberModal;
