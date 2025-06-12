import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Stack } from '@mui/material';
import { useRequest } from 'ahooks';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '@milesight/shared/src/hooks';
import { AddIcon, DeleteOutlineIcon, toast, CodeIcon } from '@milesight/shared/src/components';
import { TablePro, useConfirm } from '@/components';
import { awaitWrap, isRequestSuccess, getResponseData } from '@/services/http';
import { InteEntityType } from '../../../hooks';
import useColumns, { type UseColumnsProps, type TableRowDataType } from './useColumns';

import './style.less';

interface IProps {
    /** Entity list */
    entities?: InteEntityType[];

    /** Edit successful callback */
    onUpdateSuccess?: () => void;
}

/**
 * device binding component
 */
const DeviceBind: React.FC<IProps> = ({ entities, onUpdateSuccess }) => {
    const { getIntlText } = useI18n();
    const navigate = useNavigate();
    const confirm = useConfirm();
    const [addOpen, setAddOpen] = useState<boolean>(false);

    // ---------- list data related to ----------
    const [keyword, setKeyword] = useState<string>();
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    const [selectedIds, setSelectedIds] = useState<readonly ApiKey[]>([]);

    // ---------- Table rendering related to ----------
    const toolbarRender = useMemo(() => {
        return (
            <Stack className="ms-operations-btns" direction="row" spacing="12px">
                <Button
                    variant="contained"
                    className="md:d-none"
                    sx={{ height: 36, textTransform: 'none' }}
                    startIcon={<AddIcon />}
                    // onClick={() => setModalOpen(true)}
                >
                    {getIntlText('common.label.add')}
                </Button>
                <Button
                    variant="outlined"
                    className="md:d-none"
                    disabled={!selectedIds.length}
                    sx={{ height: 36, textTransform: 'none' }}
                    startIcon={<DeleteOutlineIcon />}
                    // onClick={() => handleDeleteConfirm()}
                >
                    {getIntlText('common.label.delete')}
                </Button>
            </Stack>
        );
    }, [getIntlText, selectedIds]);

    const handleTableBtnClick: UseColumnsProps<TableRowDataType>['onButtonClick'] = useCallback(
        (type, record) => {
            // console.log(type, record);
            switch (type) {
                case 'detail': {
                    navigate(`/device/detail/${record.id}`, { state: record });
                    break;
                }
                case 'delete': {
                    // handleDeleteConfirm([record.id]);
                    break;
                }
                default: {
                    break;
                }
            }
        },
        [navigate],
    );
    const columns = useColumns<TableRowDataType>({ onButtonClick: handleTableBtnClick });

    return (
        <div className="ms-view-ai-device-bind">
            <TablePro<TableRowDataType>
                // checkboxSelection={hasPermission(PERMISSIONS.DEVICE_DELETE)}
                // loading={loading}
                columns={columns}
                // rows={deviceData?.content}
                // rowCount={deviceData?.total || 0}
                paginationModel={paginationModel}
                rowSelectionModel={selectedIds}
                isRowSelectable={({ row }) => row.deletable}
                toolbarRender={toolbarRender}
                onPaginationModelChange={setPaginationModel}
                onRowSelectionModelChange={setSelectedIds}
                onRowDoubleClick={({ row }) => {
                    navigate(`/device/detail/${row.id}`, { state: row });
                }}
                onSearch={value => {
                    setKeyword(value);
                    setPaginationModel(model => ({ ...model, page: 0 }));
                }}
                // onRefreshButtonClick={getDeviceList}
            />
        </div>
    );
};

export default DeviceBind;
