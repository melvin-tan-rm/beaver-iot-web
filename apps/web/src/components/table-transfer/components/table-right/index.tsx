import React, { useState } from 'react';

import TablePro from '../../../table-pro';

const mockData = Array.from({ length: 5 }).map<{
    userId: ApiKey;
    userNickname: string;
    userEmail: string;
}>((_, i) => ({
    userId: i.toString(),
    userNickname: `name ${i + 1 + 10}`,
    userEmail: `email${i + 1 + 10}@gmail.com`,
}));

/**
 * Table left component
 */

export const TableRight: React.FC = () => {
    const [keyword, setKeyword] = useState<string>('');
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    const [selectedIds, setSelectedIds] = useState<readonly ApiKey[]>([]);

    return (
        <TablePro<any>
            checkboxSelection
            columns={[
                {
                    field: 'userNickname',
                    headerName: 'User Name',
                    flex: 1,
                    ellipsis: true,
                },
                {
                    field: 'userEmail',
                    headerName: 'Email',
                    flex: 1,
                    align: 'center',
                    headerAlign: 'center',
                    ellipsis: true,
                },
            ]}
            getRowId={row => row.userId}
            rows={mockData}
            rowCount={2}
            paginationModel={paginationModel}
            rowSelectionModel={selectedIds}
            onPaginationModelChange={setPaginationModel}
            onRowSelectionModelChange={setSelectedIds}
            onSearch={setKeyword}
        />
    );
};

export default TableRight;
