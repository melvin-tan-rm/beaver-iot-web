import React from 'react';

import { type GridValidRowModel } from '@mui/x-data-grid';
import { useI18n } from '@milesight/shared/src/hooks';

import TablePro, { type Props as TableProProps } from '../../../table-pro';
import TableSort from '../table-sort';

export interface TableLeftProps<T extends GridValidRowModel> {
    leftRows: readonly T[];
    leftCheckedIds: readonly ApiKey[];
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
    const { leftRows, leftCheckedIds, setLeftCheckedIds, tableProps, showTimeSort } = props;

    const { getIntlText } = useI18n();

    const renderTopBar = () => {
        return (
            <div className="ms-table-transfer__statistics">
                <div className="ms-table-transfer__statistics-title">
                    {getIntlText('common.label.choices')}
                </div>
                <div className="ms-table-transfer__statistics-value">
                    {leftCheckedIds.length}/{leftRows.length} {getIntlText('common.label.selected')}
                </div>
            </div>
        );
    };

    return (
        <TablePro<T>
            {...tableProps}
            checkboxSelection
            toolbarRender={renderTopBar()}
            toolbarSort={showTimeSort ? <TableSort /> : undefined}
            rows={leftRows}
            rowSelectionModel={leftCheckedIds}
            onRowSelectionModelChange={setLeftCheckedIds}
        />
    );
};

export default TableLeft;
