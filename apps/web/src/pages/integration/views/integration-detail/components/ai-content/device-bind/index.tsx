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
const DeviceBind: React.FC<IProps> = ({ entities, onUpdateSuccess }) => {
    const { getIntlText } = useI18n();
    const navigate = useNavigate();
    const confirm = useConfirm();

    // ---------- Render table and handle actions ----------
    const [keyword, setKeyword] = useState<string>();
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    const [selectedIds, setSelectedIds] = useState<readonly ApiKey[]>([]);
    const [openBind, setOpenBind] = useState(false);
    const [logDevice, setLogDevice] = useState<TableRowDataType | null>(null);
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
            // console.log(type, record);
            switch (type) {
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
    const { data: deviceList } = useRequest(
        async () => {
            return [
                {
                    id: '123',
                    deviceId: '123',
                    deviceName: 'device1',
                    aiServiceName: 'service1',
                    originalImageUrl:
                        'http://192.168.43.48:9000/beaver-iot-resource/beaver-iot-public/abc856a0-5d17-46e3-bdd3-26b3aa7ec343-20200108-213609-uqZwL.jpg',
                    resultImageUrl:
                        'http://192.168.43.48:9000/beaver-iot-resource/beaver-iot-public/abc856a0-5d17-46e3-bdd3-26b3aa7ec343-20200108-213609-uqZwL.jpg',
                    inferenceResult: '1231',
                    status: 'normal',
                    createdAt: Date.now(),
                    inferenceAt: Date.now(),
                },
            ];
            // const [err, res] = await awaitWrap(aiApi.getDeviceList({ keyword }));
            // if (err || !isRequestSuccess(res)) return;
            // return getResponseData(res);
        },
        {
            debounceWait: 300,
        },
    );

    return (
        <div className="ms-view-ai-device-bind">
            <TablePro<TableRowDataType>
                checkboxSelection
                // loading={loading}
                columns={columns}
                rows={deviceList || []}
                rowCount={deviceList?.length || 0}
                paginationModel={paginationModel}
                rowSelectionModel={selectedIds}
                // isRowSelectable={({ row }) => row.deletable}
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
            <LogModal
                device={logDevice}
                visible={!!logDevice}
                onCancel={() => setLogDevice(null)}
            />
            <BindModal visible={openBind} onCancel={() => setOpenBind(false)} />
        </div>
    );
};

export default DeviceBind;
