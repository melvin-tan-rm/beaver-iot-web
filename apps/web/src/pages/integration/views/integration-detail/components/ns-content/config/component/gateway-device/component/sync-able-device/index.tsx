import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Stack, Alert } from '@mui/material';
import { useRequest } from 'ahooks';
import { useI18n } from '@milesight/shared/src/hooks';
import { objectToCamelCase } from '@milesight/shared/src/utils/tools';
import { TablePro, useConfirm } from '@/components';
import { ErrorIcon, CloudSyncOutlinedIcon, toast } from '@milesight/shared/src/components';
import {
    awaitWrap,
    isRequestSuccess,
    embeddedNSApi,
    getResponseData,
    GatewayDetailType,
} from '@/services/http';
import { DeviceModelItem } from '@/services/http/embedded-ns';
import { paginationList } from '../../../../utils/utils';
import useColumns, { TableRowDataType } from './hook/useColumn';

import './style.less';

interface IProps {
    // gateway detail
    gatewayInfo: ObjectToCamelCase<GatewayDetailType>;
    // device count change event
    deviceCountChange: (count: number) => void;
    // update event
    onUpdateSuccess?: () => void;
    // refresh table
    refreshTable: () => void;
}

/**
 * syncAble device component
 */
const SyncAbleDevice: React.FC<IProps> = props => {
    const { gatewayInfo, deviceCountChange, onUpdateSuccess, refreshTable } = props;
    const { getIntlText } = useI18n();

    // ---------- list data related to ----------
    const [keyword, setKeyword] = useState<string>();
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    const [selectedIds, setSelectedIds] = useState<readonly ApiKey[]>([]);
    const [modelOption, setModelOption] = useState<DeviceModelItem[]>([]);

    // select device model map
    const [modelMap, setModelMap] = useState<Map<string, string>>(new Map());

    const {
        data: deviceData,
        loading,
        run: getDevicesList,
    } = useRequest(
        async () => {
            const { page, pageSize } = paginationModel;
            const [error, resp] = await awaitWrap(
                embeddedNSApi.getSyncAbleDevices({ eui: gatewayInfo.eui }),
            );
            const data = getResponseData(resp);
            if (error || !data || !isRequestSuccess(resp)) {
                return;
            }
            const pageData = paginationList({
                dataList: data,
                search: keyword,
                pageSize,
                pageNumber: page + 1,
                filterCondition: (item, search: string) => {
                    return [item?.name, item.eui]
                        .map(v => v?.toLocaleLowerCase() || '')
                        .filter(i => !!i)
                        .some(value => value.includes(search.toLocaleLowerCase()));
                },
            });
            // not search to update top bar count
            if (!keyword) {
                deviceCountChange(pageData.total);
            }
            return objectToCamelCase(pageData);
        },
        {
            debounceWait: 300,
            refreshDeps: [keyword, paginationModel],
        },
    );

    useEffect(() => {
        initModelOption();
    }, []);

    useEffect(() => {
        const modelMapTmp = new Map();
        deviceData?.content?.forEach(item => {
            if (item.guessModelId) {
                modelMapTmp.set(item.eui, item.guessModelId);
            }
        });
        setModelMap(modelMapTmp);
    }, deviceData?.content);

    // get model option
    const initModelOption = async () => {
        const [error, resp] = await awaitWrap(embeddedNSApi.getDeviceModels());
        if (!error && resp) {
            const data = getResponseData(resp);
            // transform to modelOption
            const options = Object.entries(data || {}).map(([key, value]) => ({
                label: value,
                value: key,
            })) as DeviceModelItem[];
            setModelOption(options);
        }
    };

    // ---------- Data Deletion related ----------
    const confirm = useConfirm();
    // delete device
    const handleSyncDevices = useCallback(async () => {
        if (!selectedIds.length || !deviceData?.content) {
            return;
        }
        // unSelect model device
        const unSelectModel = deviceData?.content
            .filter((item: TableRowDataType) => selectedIds.includes(item.eui))
            .filter((item: TableRowDataType) => !modelMap.get(item.eui));
        if (unSelectModel?.length) {
            toast.error(getIntlText('setting.integration.sync_device_empty_model'));
            return;
        }
        confirm({
            title: getIntlText('setting.integration.message.sync_device_title'),
            description: getIntlText('setting.integration.message.sync_device_tip'),
            confirmButtonText: getIntlText('common.button.confirm'),
            type: 'warning',
            onConfirm: async () => {
                const syncDevices = deviceData?.content
                    .filter((item: TableRowDataType) => selectedIds.includes(item.eui))
                    .map((item: TableRowDataType) => ({
                        eui: item.eui,
                        model_id: modelMap?.get(item.eui) || item.guessModelId || '',
                    }));

                const [error, resp] = await awaitWrap(
                    embeddedNSApi.syncDevices({
                        eui: gatewayInfo?.eui,
                        devices: syncDevices,
                    }),
                );

                if (error || !isRequestSuccess(resp)) {
                    return;
                }
                getDevicesList();
                onUpdateSuccess?.();
                refreshTable();
                setModelMap(new Map());
                setSelectedIds([]);
                toast.success(getIntlText('setting.integration.message.device_sync_success'));
            },
        });
    }, [confirm, getIntlText, getDevicesList, selectedIds, modelMap]);

    // ---------- Table rendering related to ----------
    const toolbarRender = useMemo(() => {
        return (
            <Stack className="ms-operations-btns" direction="row" spacing="12px">
                <Button
                    variant="contained"
                    disabled={!selectedIds.length}
                    sx={{ height: 36, textTransform: 'none' }}
                    startIcon={<CloudSyncOutlinedIcon />}
                    onClick={() => handleSyncDevices()}
                >
                    {getIntlText('setting.integration.label.synchronize')}
                </Button>
            </Stack>
        );
    }, [getIntlText, handleSyncDevices, selectedIds]);

    const columns = useColumns<TableRowDataType>({
        modelOptions: modelOption,
        selectedIds,
        modelMap,
        setModelMap,
    });

    return (
        <div className="ms-ns-device">
            <div className="ms-ns-device-tip">
                <Alert severity="warning">
                    <div>{getIntlText('setting.integration.device.sync_tip')}</div>
                </Alert>
            </div>
            <div className="ms-ns-device-inner">
                <TablePro<TableRowDataType>
                    filterCondition={[keyword]}
                    checkboxSelection
                    getRowId={(row: TableRowDataType) => row.eui}
                    loading={loading}
                    columns={columns}
                    rows={deviceData?.content}
                    rowCount={deviceData?.total || 0}
                    paginationModel={paginationModel}
                    rowSelectionModel={selectedIds}
                    toolbarRender={toolbarRender}
                    onPaginationModelChange={setPaginationModel}
                    onRowSelectionModelChange={setSelectedIds}
                    onSearch={value => {
                        setKeyword(value);
                        setPaginationModel(model => ({ ...model, page: 0 }));
                    }}
                    onRefreshButtonClick={getDevicesList}
                />
            </div>
        </div>
    );
};

export default SyncAbleDevice;
