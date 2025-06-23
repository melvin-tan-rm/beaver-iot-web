import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Stack } from '@mui/material';
import { useRequest } from 'ahooks';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '@milesight/shared/src/hooks';
import { AddIcon, DeleteOutlineIcon, toast, CodeIcon } from '@milesight/shared/src/components';
import { TablePro, useConfirm } from '@/components';
import { aiApi, awaitWrap, isRequestSuccess, getResponseData } from '@/services/http';
import { InteEntityType } from '../../../hooks';
import { LogModal, BindModal } from './components';
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
const DeviceBind: React.FC<IProps> = ({ entities }) => {
    const { getIntlText } = useI18n();
    const navigate = useNavigate();
    const confirm = useConfirm();

    // ---------- Render table and handle actions ----------
    const [keyword, setKeyword] = useState<string>();
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    const [selectedIds, setSelectedIds] = useState<readonly ApiKey[]>([]);
    const [openBind, setOpenBind] = useState(false);
    const [logDevice, setLogDevice] = useState<TableRowDataType | null>(null);
    const [detailDevice, setDetailDevice] = useState<TableRowDataType | null>(null);
    const toolbarRender = useMemo(() => {
        return (
            <Stack className="ms-operations-btns" direction="row" spacing="12px">
                <Button
                    variant="contained"
                    className="md:d-none"
                    sx={{ height: 36, textTransform: 'none' }}
                    startIcon={<AddIcon />}
                    onClick={() => setOpenBind(true)}
                >
                    {getIntlText('setting.integration.ai_bind_device')}
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
            switch (type) {
                case 'detail': {
                    setOpenBind(true);
                    setDetailDevice(record);
                    break;
                }
                case 'log': {
                    setLogDevice(record);
                    break;
                }
                case 'delete': {
                    break;
                }
                default: {
                    break;
                }
            }
        },
        [],
    );
    const columns = useColumns<TableRowDataType>({ onButtonClick: handleTableBtnClick });

    // ---------- Get device list ----------
    const {
        loading,
        run: getBoundDevices,
        data: deviceData,
    } = useRequest(
        async () => {
            const { pageSize, page } = paginationModel;
            const [err, resp] = await awaitWrap(
                aiApi.getBoundDevices({
                    name: keyword,
                    page_size: pageSize,
                    page_number: page + 1,
                }),
            );
            if (err || !isRequestSuccess(resp)) return;
            return getResponseData(resp);
        },
        {
            debounceWait: 300,
            refreshDeps: [keyword, paginationModel],
        },
    );

    return (
        <div className="ms-view-ai-device-bind">
            <TablePro<TableRowDataType>
                checkboxSelection
                getRowId={record => record.device_id}
                loading={loading}
                columns={columns}
                rows={deviceData?.content || []}
                rowCount={deviceData?.total || 0}
                paginationModel={paginationModel}
                rowSelectionModel={selectedIds}
                toolbarRender={toolbarRender}
                onPaginationModelChange={setPaginationModel}
                onRowSelectionModelChange={setSelectedIds}
                // onRowDoubleClick={({ row }) => {
                //     navigate(`/device/detail/${row.id}`, { state: row });
                // }}
                onSearch={value => {
                    setKeyword(value);
                    setPaginationModel(model => ({ ...model, page: 0 }));
                }}
                onRefreshButtonClick={getBoundDevices}
            />
            <LogModal
                device={logDevice}
                visible={!!logDevice}
                onCancel={() => setLogDevice(null)}
            />
            <BindModal
                visible={openBind}
                device={detailDevice}
                onCancel={() => {
                    setOpenBind(false);
                    setDetailDevice(null);
                }}
            />
        </div>
    );
};

export default DeviceBind;
