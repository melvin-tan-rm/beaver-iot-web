import React, { useState, useMemo } from 'react';
import { useRequest, useMemoizedFn } from 'ahooks';

import { Button, Stack } from '@mui/material';
import { useI18n } from '@milesight/shared/src/hooks';
import { objectToCamelCase } from '@milesight/shared/src/utils/tools';
import { toast, AddIcon, RemoveCircleOutlineIcon } from '@milesight/shared/src/components';
import { TablePro, useConfirm } from '@/components';
import { userAPI, awaitWrap, getResponseData, isRequestSuccess } from '@/services/http';

import { useColumns, type UseColumnsProps, type TableRowDataType } from './hooks';

/**
 * User members under the role
 */
const Members: React.FC = () => {
    const { getIntlText } = useI18n();

    // ---------- user member list ----------
    const [keyword, setKeyword] = useState<string>('');
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    const [selectedIds, setSelectedIds] = useState<readonly ApiKey[]>([]);

    const {
        data: userMembers,
        loading,
        run: getUserMembers,
    } = useRequest(
        async () => {
            const { page, pageSize } = paginationModel;
            // const [error, resp] = await awaitWrap(
            //     userAPI.getRoleAllUsers({
            //         keyword,
            //         role_id: '123',
            //         page_size: pageSize,
            //         page_number: page + 1,
            //     }),
            // );
            // const data = getResponseData(resp);

            // if (error || !data || !isRequestSuccess(resp)) return;

            return {
                total: 2,
                content: [
                    {
                        roleId: '1',
                        userId: '1',
                        userNickname: 'hello',
                        userEmail: 'hello@gmail.com',
                    },
                    {
                        roleId: '2',
                        userId: '2',
                        userNickname: 'world',
                        userEmail: 'world@gmail.com',
                    },
                    {
                        roleId: '3',
                        userId: '3',
                        userNickname: 'ok',
                        userEmail: 'ok@gmail.com',
                    },
                ],
            };
        },
        {
            debounceWait: 300,
            refreshDeps: [keyword, paginationModel],
        },
    );

    // ---------- user members remove ----------
    const confirm = useConfirm();
    const handleRemoveConfirm = useMemoizedFn((ids?: ApiKey[]) => {
        const idsToDelete = ids || [...selectedIds];
        if (!Array.isArray(idsToDelete)) return;

        const title = () => {
            if (idsToDelete?.length === 1) {
                return getIntlText('common.label.removal');
            }

            return getIntlText('common.label.bulk_removal');
        };

        const description = () => {
            if (idsToDelete?.length === 1) {
                const selectedMember = userMembers?.content?.find(u => u.userId === idsToDelete[0]);

                return getIntlText('user.role.single_member_remove_tip', {
                    0: selectedMember?.userNickname || '',
                });
            }

            return getIntlText('user.role.bulk_member_remove_tip', {
                0: idsToDelete.length,
            });
        };

        confirm({
            title: title(),
            description: description(),
            confirmButtonText: getIntlText('common.label.remove'),
            onConfirm: () => {
                console.log('remove users', idsToDelete);

                getUserMembers();
                setSelectedIds([]);
                toast.success('移除成功');
            },
        });
    });

    // ---------- Table render bar ----------
    const toolbarRender = useMemo(() => {
        return (
            <Stack className="ms-operations-btns" direction="row" spacing="12px">
                <Button
                    variant="contained"
                    sx={{ height: 36, textTransform: 'none' }}
                    startIcon={<AddIcon />}
                    onClick={() => console.log('add user member')}
                >
                    {getIntlText('common.label.add')}
                </Button>
                <Button
                    variant="outlined"
                    color="error"
                    disabled={!selectedIds.length}
                    sx={{ height: 36, textTransform: 'none' }}
                    startIcon={<RemoveCircleOutlineIcon />}
                    onClick={() => handleRemoveConfirm()}
                >
                    {getIntlText('common.label.remove')}
                </Button>
            </Stack>
        );
    }, [getIntlText, handleRemoveConfirm, selectedIds]);

    const handleTableBtnClick: UseColumnsProps<TableRowDataType>['onButtonClick'] = useMemoizedFn(
        (type, record) => {
            switch (type) {
                case 'remove': {
                    handleRemoveConfirm([record.userId]);
                    break;
                }
                default: {
                    break;
                }
            }
        },
    );

    const columns = useColumns<TableRowDataType>({ onButtonClick: handleTableBtnClick });

    return (
        <div>
            <TablePro<TableRowDataType>
                checkboxSelection
                loading={loading}
                columns={columns}
                getRowId={row => row.userId}
                rows={userMembers?.content}
                rowCount={userMembers?.total || 0}
                paginationModel={paginationModel}
                rowSelectionModel={selectedIds}
                isRowSelectable={({ row }) => true}
                toolbarRender={toolbarRender}
                onPaginationModelChange={setPaginationModel}
                onRowSelectionModelChange={setSelectedIds}
                onSearch={setKeyword}
                onRefreshButtonClick={getUserMembers}
            />
        </div>
    );
};

export default Members;
