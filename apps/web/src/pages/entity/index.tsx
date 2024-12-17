import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Stack, Menu, MenuItem } from '@mui/material';
import { useRequest } from 'ahooks';
import { useI18n } from '@milesight/shared/src/hooks';
import { objectToCamelCase } from '@milesight/shared/src/utils/tools';
import {
    AddIcon,
    DeleteOutlineIcon,
    NoteAddIcon,
    CalculateIcon,
    toast,
} from '@milesight/shared/src/components';
import { Breadcrumbs, TablePro, useConfirm } from '@/components';
import { entityAPI, awaitWrap, getResponseData, isRequestSuccess } from '@/services/http';
import { useColumns, type UseColumnsProps, type TableRowDataType } from './hooks';
import { AddModal } from './components';
import './style.less';

export default () => {
    const navigate = useNavigate();
    const { getIntlText } = useI18n();

    // ---------- 列表数据相关 ----------
    const [keyword, setKeyword] = useState<string>();
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    const [selectedIds, setSelectedIds] = useState<readonly ApiKey[]>([]);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const {
        data: entityData,
        loading,
        run: getDeviceList,
    } = useRequest(
        async () => {
            const { page, pageSize } = paginationModel;
            const [error, resp] = await awaitWrap(
                entityAPI.getList({
                    keyword,
                    page_size: pageSize,
                    page_number: page + 1,
                }),
            );
            const data = getResponseData(resp);

            // console.log({ error, resp });
            if (error || !data || !isRequestSuccess(resp)) return;

            return objectToCamelCase(data);
        },
        {
            debounceWait: 300,
            refreshDeps: [keyword, paginationModel],
        },
    );

    // ---------- 设备添加相关 ----------
    const [modalOpen, setModalOpen] = useState(false);

    // ---------- 数据删除相关 ----------
    const confirm = useConfirm();
    const handleDeleteConfirm = useCallback(
        (ids?: ApiKey[]) => {
            const idsToDelete = ids || [...selectedIds];

            confirm({
                title: getIntlText('common.label.delete'),
                description: getIntlText('device.message.delete_tip'),
                confirmButtonText: getIntlText('common.label.delete'),
                confirmButtonProps: {
                    color: 'error',
                },
                onConfirm: async () => {
                    const [error, resp] = await awaitWrap(
                        entityAPI.deleteEntities({ entity_id_list: idsToDelete }),
                    );

                    // console.log({ error, resp });
                    if (error || !isRequestSuccess(resp)) return;

                    getDeviceList();
                    setSelectedIds([]);
                    toast.success(getIntlText('common.message.delete_success'));
                },
            });
        },
        [confirm, getIntlText, getDeviceList, selectedIds],
    );

    // ---------- Table 渲染相关 ----------
    const toolbarRender = useMemo(() => {
        return (
            <Stack className="ms-operations-btns" direction="row" spacing="12px">
                <Button
                    variant="contained"
                    sx={{ height: 36, textTransform: 'none' }}
                    aria-controls={open ? 'add-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    startIcon={<AddIcon />}
                    onClick={handleClick}
                >
                    {getIntlText('common.label.add')}
                </Button>
                <Button
                    variant="outlined"
                    color="error"
                    disabled={!selectedIds.length}
                    sx={{ height: 36, textTransform: 'none' }}
                    startIcon={<DeleteOutlineIcon />}
                    onClick={() => handleDeleteConfirm()}
                >
                    {getIntlText('common.label.delete')}
                </Button>
            </Stack>
        );
    }, [getIntlText, handleDeleteConfirm, selectedIds]);

    const handleTableBtnClick: UseColumnsProps<TableRowDataType>['onButtonClick'] = useCallback(
        (type, record) => {
            // console.log(type, record);
            switch (type) {
                case 'detail': {
                    navigate(`/device/detail/${record.entityId}`, { state: record });
                    break;
                }
                case 'delete': {
                    handleDeleteConfirm([record.entityId]);
                    break;
                }
                default: {
                    break;
                }
            }
        },
        [navigate, handleDeleteConfirm],
    );
    const columns = useColumns<TableRowDataType>({ onButtonClick: handleTableBtnClick });

    const handleShowAddOnly = () => {
        setModalOpen(true);
        handleClose();
    };

    return (
        <div className="ms-main">
            <Breadcrumbs />
            <div className="ms-view ms-view-entity">
                <div className="ms-view__inner">
                    <TablePro<TableRowDataType>
                        checkboxSelection
                        loading={loading}
                        columns={columns}
                        getRowId={record => record.entityId}
                        rows={entityData?.content}
                        rowCount={entityData?.total || 0}
                        paginationModel={paginationModel}
                        rowSelectionModel={selectedIds}
                        // isRowSelectable={({ row }) => row.deletable}
                        toolbarRender={toolbarRender}
                        onPaginationModelChange={setPaginationModel}
                        onRowSelectionModelChange={setSelectedIds}
                        onRowDoubleClick={({ row }) => {
                            navigate(`/device/detail/${row.entityId}`, { state: row });
                        }}
                        onSearch={setKeyword}
                        onRefreshButtonClick={getDeviceList}
                    />
                </div>
            </div>
            {modalOpen && (
                <AddModal
                    onCancel={() => setModalOpen(false)}
                    onOk={() => {
                        getDeviceList();
                        setModalOpen(false);
                    }}
                />
            )}
            <Menu
                id="add-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem
                    disabled
                    sx={{
                        '&.Mui-disabled': {
                            opacity: 1,
                        },
                    }}
                >
                    <div className="entity-add-menu-group-name">
                        {getIntlText('entity.label.create_property')}
                    </div>
                </MenuItem>
                <MenuItem onClick={handleShowAddOnly}>
                    <div className="entity-add-menu-item">
                        <NoteAddIcon className="entity-add-menu-item-icon" />
                        {getIntlText('entity.label.create_entity_only')}
                    </div>
                </MenuItem>
                <MenuItem
                    disabled
                    sx={{
                        '&.Mui-disabled': {
                            opacity: 1,
                        },
                    }}
                >
                    <div className="entity-add-menu-group-name">
                        {getIntlText('entity.label.create_service')}
                    </div>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <div className="entity-add-menu-item">
                        <CalculateIcon className="entity-add-menu-item-icon" />
                        {getIntlText('entity.label.create_entity_from_workflow')}
                    </div>
                </MenuItem>
            </Menu>
        </div>
    );
};
