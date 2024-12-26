import React from 'react';
import { isNil } from 'lodash-es';
import { useMemoizedFn } from 'ahooks';

import { type GridValidRowModel } from '@mui/x-data-grid';
import { useI18n } from '@milesight/shared/src/hooks';

import TablePro, { type Props as TableProProps } from '../../../table-pro';
import TableSort from '../table-sort';

export interface TableLeftProps<T extends GridValidRowModel> {
    leftRows: readonly T[];
    notMovedLeftChecked: readonly T[];
    leftCheckedIds: readonly ApiKey[];
    rightRows: readonly T[];
    setLeftCheckedIds: React.Dispatch<React.SetStateAction<readonly ApiKey[]>>;
    /**
     * show time sort
     */
    showTimeSort?: boolean;
    tableProps: TableProProps<T>;
}

/**
 * Table left component
 */

const TableLeft = <T extends GridValidRowModel>(props: TableLeftProps<T>) => {
    const {
        leftRows,
        notMovedLeftChecked,
        leftCheckedIds,
        rightRows,
        setLeftCheckedIds,
        tableProps,
        showTimeSort,
    } = props;

    const { getRowId, rowCount } = tableProps || {};

    const { getIntlText } = useI18n();

    const renderTopBar = () => {
        const statistics = `${notMovedLeftChecked?.length || 0}/${rowCount ?? leftRows.length}`;

        return (
            <div className="ms-table-transfer__statistics">
                <div className="ms-table-transfer__statistics-title">
                    {getIntlText('common.label.choices')}
                </div>
                <div className="ms-table-transfer__statistics-value">
                    {statistics} {getIntlText('common.label.selected')}
                </div>
            </div>
        );
    };

    const handleIsRowSelectable = useMemoizedFn((rowId: ApiKey) => {
        const isSelected = rightRows?.some(r => {
            if (getRowId) {
                return getRowId(r) === rowId;
            }

            if (!isNil(r?.id)) {
                return r.id === rowId;
            }

            return true;
        });

        return isNil(isSelected) ? true : !isSelected;
    });

    return (
        <TablePro<T>
            {...tableProps}
            checkboxSelection
            toolbarRender={renderTopBar()}
            toolbarSort={showTimeSort ? <TableSort /> : undefined}
            rows={leftRows}
            rowSelectionModel={leftCheckedIds}
            onRowSelectionModelChange={setLeftCheckedIds}
            isRowSelectable={row => handleIsRowSelectable(row.id)}
        />
    );
};

export default TableLeft;
