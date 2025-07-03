import React, { useEffect, useState, useCallback, useRef } from 'react';
import { groupBy, isNumber, keyBy, reject } from 'lodash-es';
import update from 'immutability-helper';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Checkbox, IconButton, List, ListItem, Popover, Tooltip } from '@mui/material';
import { GridApiCommunity } from '@mui/x-data-grid/internals';
import { GridColumnResizeParams, GridValidRowModel } from '@mui/x-data-grid';
import { bindPopover, bindTrigger, usePopupState } from 'material-ui-popup-state/hooks';
import { useI18n } from '@milesight/shared/src/hooks';
import { iotLocalStorage } from '@milesight/shared/src/utils/storage';
import { ColumnSettingIcon, DragIndicatorIcon } from '@milesight/shared/src/components';
import { DragCard, DragContainer } from '@/components/drag';
import { ColumnType } from '../../types';
import { isOperationColumn } from '../../utlis';

import './style.less';

/** Column display/fixed type */
interface CacheDisplayType {
    /** Column field */
    field: ColumnType['field'];
    /** Is fixed */
    fixed?: ColumnType['fixed'];
    /** Is it visible */
    checked?: boolean;
}

/** Column width cache type */
interface CacheWidthType {
    /** Column field */
    field: ColumnType['field'];
    width?: number;
    flex?: number;
}

export type ColumnSettingProps<T extends GridValidRowModel> = ColumnType<T> & {
    /**
     * Is column visible
     */
    checked?: boolean;
};

/**
 * Drag the block data type
 */
type SettingItemType<T extends GridValidRowModel> = {
    fixed?: 'left' | 'right';

    /** Sub columns children, group by fixed */
    children: ColumnSettingProps<T>[];
};

interface IProps<T extends GridValidRowModel> {
    /**
     * Table instance api
     */
    apiRef: React.MutableRefObject<GridApiCommunity>;
    /**
     * ColumnType<T>
     */
    columns: ColumnSettingProps<T>[];
    /**
     * Unique columns display storage key
     */
    columnsDisplayCacheKey: string;
    /**
     * Unique columns width storage key
     */
    columnsWidthCacheKey: string;
    /**
     * Whether to default to a show operation column in setting
     */
    settingShowOpeColumn?: boolean;
    /**
     * Columns change eg: resize, fixed change
     */
    onChange?: (columns: ColumnSettingProps<T>[]) => void;
}

// Render custom column content
const ColumnCardItem = <T extends GridValidRowModel>({
    column,
    onChange,
}: {
    column: ColumnSettingProps<T>;
    onChange: (event: React.ChangeEvent, column: ColumnSettingProps<T>) => void;
}) => {
    return (
        <ListItem>
            <div className="ms-column-setting-list-area-item">
                <span>
                    <DragIndicatorIcon
                        sx={{
                            height: 16,
                            width: 16,
                        }}
                    />
                </span>
                <Checkbox
                    defaultChecked={!!column?.checked}
                    onChange={event => onChange(event, column)}
                    sx={{
                        height: 16,
                        width: 16,
                        mr: 1,
                        ml: 1,
                    }}
                />
                {column.headerName}
            </div>
        </ListItem>
    );
};

/**
 * Customize the display|hide|fixed|width change of the columns in the table
 */
const ColumnsSetting = <T extends GridValidRowModel>({
    apiRef,
    columns,
    columnsDisplayCacheKey,
    columnsWidthCacheKey,
    settingShowOpeColumn,
    onChange: onColumnsChange,
}: IProps<T>) => {
    const { getIntlText } = useI18n();

    const popupState = usePopupState({
        variant: 'popover',
        popupId: 'columnsSettingPopover',
    });

    const columnsRef = useRef<SettingItemType<T>[]>([]);
    const [columnsList, setColumnsList] = useState<SettingItemType<T>[]>([]);

    // Filter the selection columns and create new columns, and whether storage is needed
    const updateColumns = (columnsList: SettingItemType<T>[], isStorage = true) => {
        const columnsCopy = [...columnsList];
        const newArr = columnsCopy.map(i => i.children).flat();
        const newColumns = newArr.filter(item => item?.checked);

        // storage
        if (isStorage && !!columnsDisplayCacheKey) {
            iotLocalStorage.setItem(
                columnsDisplayCacheKey,
                newArr.map((column: ColumnSettingProps<T>) => {
                    return {
                        field: column?.field,
                        fixed: column?.fixed,
                        checked: column?.checked,
                    };
                }),
            );
        }

        if (isStorage && !!columnsWidthCacheKey) {
            iotLocalStorage.setItem(
                columnsWidthCacheKey,
                newArr.map((column: ColumnSettingProps<T>) => {
                    return {
                        field: column?.field,
                        width: column?.width,
                        // flex will affect the width. If it is 0, the modified width will be maintained
                        flex: column?.flex,
                    };
                }),
            );
        }
        onColumnsChange && onColumnsChange(newColumns);
    };

    // Column checked change
    const onChange = ({ target }: { target: any }, item: ColumnSettingProps<T>) => {
        const { checked } = target;
        item.checked = !!checked;
        setColumnsList([...columnsList]);
        updateColumns(columnsList);
    };

    // Column width change
    const onColumnWidthChange = (column: GridColumnResizeParams) => {
        const resizeColumn = reject(columnsList, 'fixed')[0]?.children.find(
            (col: ColumnSettingProps<T>) => col.field === column.colDef.field,
        );

        if (resizeColumn) {
            resizeColumn.width = Math.floor(column.width);
            resizeColumn.flex = column.colDef.flex;
            setColumnsList([...columnsList]);
            updateColumns(columnsList);
        }
    };

    // ColumnResize change event
    useEffect(() => {
        apiRef.current?.subscribeEvent('columnResize', (column: GridColumnResizeParams) => {
            onColumnWidthChange(column);
        });
    }, [apiRef.current]);

    // Group by fixed
    const transformColumns = (columns: ColumnSettingProps<T>[]): SettingItemType<T>[] => {
        const groupColumn = groupBy(columns, item => item.fixed ?? '');
        return [
            {
                fixed: 'left',
                children: groupColumn.left || [],
            },
            {
                children: groupColumn[''] || [],
            },
            {
                fixed: 'right',
                children: groupColumn.right || [],
            },
        ];
    };

    useEffect(() => {
        let columnsCopy = [...columns];
        const columnsDisplayStorage =
            (columnsDisplayCacheKey &&
                iotLocalStorage.getItem<CacheDisplayType[]>(columnsDisplayCacheKey)) ||
            [];
        const columnsWidthStorage =
            (columnsWidthCacheKey &&
                iotLocalStorage.getItem<CacheWidthType[]>(columnsWidthCacheKey)) ||
            [];
        // If the columns are different, the cache is unavailable
        const displayCacheUnable =
            !columnsDisplayStorage.length ||
            columnsCopy.some(col => {
                return !columnsDisplayStorage.find(cl => cl.field === col.field);
            });

        // If the columns are different, the cache is unavailable
        const widthCacheUnable =
            !columnsWidthStorage.length ||
            columnsCopy.some(col => {
                return !columnsWidthStorage.find(cl => cl.field === col.field);
            });

        const columnsWidthObj: Record<string, CacheWidthType> = widthCacheUnable
            ? {}
            : keyBy(columnsWidthStorage, 'field');

        const hasHiddenColumn = columnsCopy.some(col => col.hidden);

        if (widthCacheUnable) {
            iotLocalStorage.removeItem(columnsWidthCacheKey);
        }

        // Cache is unavailable. use by default
        if (displayCacheUnable) {
            iotLocalStorage.removeItem(columnsDisplayCacheKey);
            columnsCopy = columnsCopy.map((item: ColumnSettingProps<T>) => {
                item.checked = !item.hidden;
                item.width = columnsWidthObj[item.field]?.width || item.width;
                item.flex = columnsWidthObj[item.field]?.flex || item.flex;
                return item;
            });
        } else {
            const data: ColumnSettingProps<T>[] = [];
            columnsDisplayStorage.forEach(item => {
                const column = columnsCopy.find(
                    (col: ColumnSettingProps<T>) => col?.field === item?.field,
                );
                if (column) {
                    column.checked = !!item?.checked;
                    column.fixed = item?.fixed;
                    column.width = columnsWidthObj[item.field]?.width || column.width;
                    column.flex = isNumber(columnsWidthObj[item.field]?.flex)
                        ? columnsWidthObj[item.field]?.flex
                        : 0;
                    data.push(column);
                }
            });
            columnsCopy = data;
        }

        columnsCopy.forEach(col => {
            if (col.fixed && !col.width) {
                col.width = col.minWidth;
            }
        });

        const sortData = transformColumns(columnsCopy);
        setColumnsList(sortData);
        updateColumns(sortData, hasHiddenColumn);
    }, [columnsDisplayCacheKey, columnsWidthCacheKey, columns]);

    /**
     * Whether or not Filter operation column
     */
    const filterColumn = (columns: ColumnSettingProps<T>[]) => {
        return settingShowOpeColumn
            ? columns
            : columns.filter(col => !isOperationColumn(col.field));
    };

    // Drag event
    const moveCard = useCallback<
        (
            dragIndex: number,
            dragParentIndex: number,
            hoverIndex: number,
            hoverParentIndex: number,
        ) => void
    >((dragIndex, dragParentIndex, hoverIndex, hoverParentIndex) => {
        setColumnsList(prevColumnsList => {
            const dragItem = prevColumnsList[dragParentIndex].children[dragIndex];
            if (hoverParentIndex === 0) {
                dragItem.fixed = 'left';
            } else if (hoverParentIndex === 2) {
                dragItem.fixed = 'right';
            } else {
                dragItem.fixed = undefined;
            }
            const dragData = update(prevColumnsList, {
                [dragParentIndex]: {
                    children: { $splice: [[dragIndex, 1]] },
                },
            });
            const dropData = update(dragData, {
                [hoverParentIndex]: {
                    children: { $splice: [[hoverIndex, 0, dragItem]] },
                },
            });
            columnsRef.current = dropData;
            return dropData;
        });
    }, []);

    const onDragEnd = () => {
        if (columnsRef.current.length === 0) {
            return;
        }
        updateColumns(columnsRef.current);
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="ms-column-setting-btn">
                <Tooltip title={getIntlText('common.label.columns_setting')}>
                    <IconButton
                        size="medium"
                        className="ms-column-setting-btn-icon"
                        {...bindTrigger(popupState)}
                    >
                        <ColumnSettingIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            </div>
            <Popover
                {...bindPopover(popupState)}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <div className="ms-column-setting">
                    <div className="ms-column-setting-header">
                        <h3>{getIntlText('common.label.columns_setting')}</h3>
                    </div>
                    <List className="ms-column-setting-list">
                        <DragContainer>
                            {columnsList.map((column, columnIndex) => (
                                // eslint-disable-next-line
                                <div key={columnIndex} className="ms-column-setting-list-item">
                                    <div className="ms-column-setting-list-title">
                                        {column?.fixed === 'right' &&
                                            getIntlText('common.label.column_setting_fixed_right')}
                                        {column?.fixed === 'left' &&
                                            getIntlText('common.label.column_setting_fixed_left')}
                                        {!column?.fixed &&
                                            getIntlText(
                                                'common.label.column_setting_non_fixed_column',
                                            )}
                                    </div>
                                    <DragContainer className="ms-column-setting-list-area">
                                        {filterColumn(column.children).map((col, index) => (
                                            <DragCard
                                                key={col.field}
                                                parentIndex={columnIndex}
                                                index={index}
                                                id={col?.field}
                                                moveCard={moveCard}
                                                onDragEnd={onDragEnd}
                                            >
                                                <ColumnCardItem
                                                    column={col}
                                                    onChange={(event, col) => onChange(event, col)}
                                                />
                                            </DragCard>
                                        ))}
                                        {filterColumn(column.children).length === 0 && (
                                            <DragCard
                                                parentIndex={columnIndex}
                                                index={0}
                                                canDrag
                                                moveCard={moveCard}
                                                onDragEnd={onDragEnd}
                                            >
                                                <div className="ms-column-setting-list-empty">
                                                    {getIntlText('common.label.empty')}
                                                </div>
                                            </DragCard>
                                        )}
                                    </DragContainer>
                                </div>
                            ))}
                        </DragContainer>
                    </List>
                </div>
            </Popover>
        </DndProvider>
    );
};

export default ColumnsSetting;
