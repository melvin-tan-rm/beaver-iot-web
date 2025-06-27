import React, { useState, useMemo, useCallback } from 'react';
import { useRequest, useMemoizedFn } from 'ahooks';
import { pick } from 'lodash-es';

import { Button, Stack } from '@mui/material';
import { useI18n } from '@milesight/shared/src/hooks';
import { objectToCamelCase } from '@milesight/shared/src/utils/tools';
import { AddIcon, RemoveCircleOutlineIcon } from '@milesight/shared/src/components';
import { TablePro, Breadcrumbs } from '@/components';
import { tagAPI, awaitWrap, getResponseData, isRequestSuccess } from '@/services/http';
import { OperateTagModal } from './components';

import { useColumns, type UseColumnsProps, type TableRowDataType, useTagModal } from './hooks';

import './style.less';

const TagManagement: React.FC = () => {
    const { getIntlText } = useI18n();

    // ---------- Tag list ----------
    const [keyword, setKeyword] = useState<string>('');
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    const [selectedIds, setSelectedIds] = useState<readonly ApiKey[]>([]);

    const handleSearch = useCallback((value: string) => {
        setKeyword(value);
        setPaginationModel(model => ({ ...model, page: 0 }));
    }, []);

    const {
        data: allTags,
        loading,
        run: getAllTags,
    } = useRequest(
        async () => {
            const { page, pageSize } = paginationModel;
            const [error, resp] = await awaitWrap(
                tagAPI.getTagList({
                    keyword,
                    page_size: pageSize,
                    page_number: page + 1,
                }),
            );
            const respData = getResponseData(resp);

            // if (error || !respData || !isRequestSuccess(resp)) return;

            // return objectToCamelCase(respData);
            return {
                content: [
                    {
                        id: 1,
                        name: 'Tag Name',
                        color: '#7B4EFA',
                        description: 'This is description of tag',
                        tagEntities: 16,
                        createdAt: Date.now(),
                    },
                ],
                total: 1,
            };
        },
        {
            debounceWait: 300,
            refreshDeps: [keyword, paginationModel],
        },
    );

    const {
        tagModalVisible,
        openAddTag,
        openEditTag,
        onFormSubmit,
        hideModal,
        operateType,
        modalTitle,
        currentTag,
    } = useTagModal(getAllTags);

    // ---------- Table render bar ----------
    const toolbarRender = useMemo(() => {
        return (
            <Stack className="ms-operations-btns" direction="row" spacing="12px">
                <Button
                    variant="contained"
                    className="md:d-none"
                    sx={{ height: 36, textTransform: 'none' }}
                    startIcon={<AddIcon />}
                    onClick={openAddTag}
                >
                    {getIntlText('common.label.add')}
                </Button>
                <Button
                    variant="outlined"
                    className="md:d-none"
                    disabled={!selectedIds.length}
                    sx={{ height: 36, textTransform: 'none' }}
                    startIcon={<RemoveCircleOutlineIcon />}
                    onClick={() => {
                        console.log('delete tag');
                    }}
                >
                    {getIntlText('common.label.delete')}
                </Button>
            </Stack>
        );
    }, [getIntlText, selectedIds, openAddTag]);

    const handleTableBtnClick: UseColumnsProps<TableRowDataType>['onButtonClick'] = useMemoizedFn(
        (type, record) => {
            switch (type) {
                case 'edit': {
                    console.log('edit', record);
                    openEditTag(record);
                    break;
                }
                case 'delete': {
                    console.log('delete', record);
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
        <div className="ms-main">
            <Breadcrumbs />
            <div className="ms-view ms-view-tag">
                <div className="ms-view__inner">
                    <TablePro<TableRowDataType>
                        checkboxSelection
                        loading={loading}
                        columns={columns}
                        getRowId={row => row.id}
                        rows={allTags?.content}
                        rowCount={allTags?.total || 0}
                        paginationModel={paginationModel}
                        rowSelectionModel={selectedIds}
                        toolbarRender={toolbarRender}
                        onPaginationModelChange={setPaginationModel}
                        onRowSelectionModelChange={setSelectedIds}
                        onSearch={handleSearch}
                        onRefreshButtonClick={getAllTags}
                    />
                    {tagModalVisible && (
                        <OperateTagModal
                            data={currentTag}
                            title={modalTitle}
                            operateType={operateType}
                            visible={tagModalVisible}
                            onCancel={hideModal}
                            onFormSubmit={onFormSubmit}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default TagManagement;
