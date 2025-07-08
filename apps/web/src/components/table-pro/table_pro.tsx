import React, { useEffect, useMemo, useState } from 'react';
import { isArray, isUndefined } from 'lodash-es';
import { OutlinedInput, InputAdornment } from '@mui/material';
import { DataGrid, type GridValidRowModel, useGridApiRef } from '@mui/x-data-grid';
import { useI18n, useTheme } from '@milesight/shared/src/hooks';
import { SearchIcon } from '@milesight/shared/src/components';
import Tooltip from '../tooltip';
import {
    useFilterProps,
    useHeader,
    usePinnedColumn,
    useColumnsCacheKey,
    useTable,
    DEFAULT_PAGINATION_MODEL,
} from './hook';
import { ColumnsSetting, Footer, NoDataOverlay, NoResultsOverlay } from './components';
import type { TableProProps, ColumnSettingProps } from './types';

import './style.less';

/**
 * Data form element
 */
const TablePro = <DataType extends GridValidRowModel>({
    columns,
    initialState,
    slots,
    slotProps,
    toolbarRender,
    toolbarSort,
    onSearch,
    onRefreshButtonClick,
    onFilterInfoChange,
    paginationMode = 'server',
    tableName,
    columnSetting = false,
    settingShowOpeColumn = false,
    showSelectedAndTotal = true,
    filterSettingColumns,
    ...props
}: TableProProps<DataType>) => {
    const { getIntlText } = useI18n();
    const { matchMobile } = useTheme();

    const apiRef = useGridApiRef();
    const { getCacheKey } = useColumnsCacheKey(tableName);
    const columnsDisplayCacheKey = getCacheKey('display');
    const columnsWidthCacheKey = getCacheKey('width');

    const { getColumnFilterProps } = useFilterProps();
    const { renderHeader } = useHeader({
        onFilterInfoChange,
        columns,
    });
    const { pageSizeOptions } = useTable({
        apiRef,
        props,
    });

    const [resultColumns, setResultColumns] = useState<ColumnSettingProps<DataType>[]>(columns);
    const { pinnedColumnPos, sxFieldClass, sortGroupByFixed } = usePinnedColumn({
        apiRef,
        columns: resultColumns,
        restProps: props,
    });

    const columnSettingEnable = useMemo(() => {
        return !matchMobile && columnSetting;
    }, [matchMobile, columnSetting]);

    /**
     * Column display or width or fixed change event
     */
    const handleColumnSettingChange = (newColumns: ColumnSettingProps<DataType>[]) => {
        setResultColumns(newColumns);
    };

    const memoColumns = useMemo(() => {
        const result = (
            columnSettingEnable ? resultColumns.filter(col => col.checked) : resultColumns
        ).map((column, index) => {
            const filterDropdown = column.filterSearchType
                ? getColumnFilterProps(column.filterSearchType)
                : {};

            const col = { ...column, ...filterDropdown };

            col.sortable = isUndefined(col.sortable) ? false : col.sortable;
            col.filterable = isUndefined(col.filterable) ? false : col.filterable;
            col.disableColumnMenu = isUndefined(col.disableColumnMenu)
                ? true
                : column.disableColumnMenu;

            if (columns.length === index + 1) {
                col.align = isUndefined(col.align) ? 'right' : col.align;
                col.headerAlign = isUndefined(col.headerAlign) ? 'right' : col.headerAlign;
                col.resizable = isUndefined(col.resizable) ? false : col.resizable;
            }
            /** has filter condition */
            if (col.filterDropdown || col.filters) {
                col.renderHeader = col.renderHeader || (() => renderHeader(col));
            }
            col.headerClassName = pinnedColumnPos[col.field]?.headerClassName || '';
            col.cellClassName = pinnedColumnPos[col.field]?.cellClassName || '';

            if (col.ellipsis) {
                const originalRenderCell = col.renderCell;

                col.renderCell = (...args) => {
                    const { value } = args[0];
                    const title = originalRenderCell?.(...args) || value;

                    return (
                        <Tooltip
                            autoEllipsis
                            title={title || '-'}
                            slotProps={{
                                popper: {
                                    modifiers: [{ name: 'offset', options: { offset: [0, -20] } }],
                                },
                            }}
                        />
                    );
                };
            }

            return col;
        });

        return sortGroupByFixed(result);
    }, [resultColumns, pinnedColumnPos]);

    return (
        <div className="ms-table-pro">
            {!!(toolbarRender || onSearch || toolbarSort || columnSettingEnable) && (
                <div className="ms-table-pro__header">
                    <div className="ms-table-pro__topbar-operations">{toolbarRender}</div>
                    {!!onSearch && (
                        <div className="ms-table-pro__topbar-search">
                            <OutlinedInput
                                placeholder={getIntlText('common.label.search')}
                                sx={{ width: 220 }}
                                onChange={e => onSearch?.(e.target.value)}
                                startAdornment={
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                }
                            />
                        </div>
                    )}
                    {columnSettingEnable && (
                        <ColumnsSetting<DataType>
                            apiRef={apiRef}
                            columns={columns}
                            columnsDisplayCacheKey={columnsDisplayCacheKey}
                            columnsWidthCacheKey={columnsWidthCacheKey}
                            onChange={handleColumnSettingChange}
                            settingShowOpeColumn={settingShowOpeColumn}
                            filterSettingColumns={filterSettingColumns}
                        />
                    )}
                    {!!toolbarSort && (
                        <div className="ms-table-pro__topbar-sort">{toolbarSort}</div>
                    )}
                </div>
            )}
            <div className="ms-table-pro__body">
                <DataGrid<DataType>
                    apiRef={apiRef}
                    disableColumnSelector
                    disableRowSelectionOnClick
                    hideFooterSelectedRowCount
                    sx={{
                        border: 0,
                        ...sxFieldClass,
                    }}
                    columnHeaderHeight={44}
                    rowHeight={48}
                    paginationMode={paginationMode}
                    pageSizeOptions={pageSizeOptions}
                    columns={memoColumns}
                    initialState={{
                        pagination: { paginationModel: DEFAULT_PAGINATION_MODEL },
                        ...initialState,
                    }}
                    slots={{
                        noRowsOverlay: NoDataOverlay,
                        noResultsOverlay: NoResultsOverlay,
                        footer: Footer,
                        ...slots,
                    }}
                    slotProps={{
                        footer: {
                            // @ts-ignore
                            onRefreshButtonClick,
                            showSelectedAndTotal,
                            selectedCount: isArray(props.rowSelectionModel)
                                ? props.rowSelectionModel?.length
                                : 0,
                            totalCount: props.rowCount || 0,
                        },
                        baseCheckbox: {
                            // disabled: true,
                            onDoubleClick(e) {
                                e.stopPropagation();
                            },
                        },
                        ...slotProps,
                    }}
                    {...props}
                />
            </div>
        </div>
    );
};

// export type { GridColDef as ColumnType };
export default TablePro;
