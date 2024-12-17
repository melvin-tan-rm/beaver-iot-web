import React, { useState } from 'react';
import { useMemoizedFn } from 'ahooks';

import { useI18n } from '@milesight/shared/src/hooks';
import { Modal, type ModalProps } from '@milesight/shared/src/components';
import { TableTransfer } from '@/components';

import { type TableRowDataType, useColumns } from './hooks';

function getRandomTimeToday() {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

    const randomTime = new Date(
        startOfDay.getTime() + Math.random() * (endOfDay.getTime() - startOfDay.getTime()),
    );
    return randomTime;
}

const mockData = Array.from({ length: 22 }).map<{
    userId: ApiKey;
    nickname: string;
    email: string;
    createdAt: number;
}>((_, i) => ({
    userId: i.toString(),
    nickname: `name H ${i + 1}`,
    email: `email${i + 1}@gmail.com`,
    createdAt: getRandomTimeToday().getTime(),
}));

/**
 * add member modal
 */
const AddMemberModal: React.FC<ModalProps> = props => {
    const { visible, onOk, ...restProps } = props;

    const { getIntlText } = useI18n();
    const columns = useColumns();

    const [keyword, setKeyword] = useState<string>('');
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    const [chosenMember, setChosenMember] = useState<TableRowDataType[]>([]);

    const handleOk = useMemoizedFn(() => {
        onOk?.();

        console.log('handleOk ? ', chosenMember);
    });

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
                            rows: mockData,
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
