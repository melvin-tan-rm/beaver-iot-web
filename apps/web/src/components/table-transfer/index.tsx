import React from 'react';
import { Button } from '@mui/material';
import { ChevronLeftIcon, ChevronRightIcon } from '@milesight/shared/src/components';

import { type GridValidRowModel } from '@mui/x-data-grid';
import { type Props as TableProProps } from '../table-pro';
import { TableLeft, TableRight } from './components';
import { useTransfer } from './hooks';

import './style.less';

export interface TableTransferProps<T extends GridValidRowModel> {
    onChosen: (values: T[]) => void;
    /**
     * Methods for filtering selected data
     */
    selectedFilter?: (keyword: string, row: T) => boolean;
    /**
     * table default top bar sort field
     */
    sortField?: string;
    tableProps: TableProProps<T>;
}

/**
 * Table Transfer component
 */
const TableTransfer = <T extends GridValidRowModel>(props: TableTransferProps<T>) => {
    const { onChosen, selectedFilter, sortField, tableProps } = props;
    const { rows, getRowId } = tableProps || {};

    const {
        left,
        right,
        leftCheckedIds,
        setLeftCheckedIds,
        rightCheckedIds,
        setRightCheckedIds,
        handleCheckedLeft,
        handleCheckedRight,
    } = useTransfer<T>({
        rows,
        getRowId,
        onChosen,
    });

    return (
        <div className="ms-table-transfer">
            <div className="ms-table-transfer__list">
                <TableLeft<T>
                    leftRows={left}
                    leftCheckedIds={leftCheckedIds}
                    setLeftCheckedIds={setLeftCheckedIds}
                    tableProps={tableProps}
                />
            </div>
            <div className="ms-table-transfer__operation">
                <Button
                    variant="contained"
                    disabled={Boolean(!rightCheckedIds?.length)}
                    sx={{ width: 32, minWidth: 32 }}
                    onClick={handleCheckedLeft}
                >
                    <ChevronLeftIcon />
                </Button>
                <Button
                    variant="contained"
                    disabled={Boolean(!leftCheckedIds?.length)}
                    sx={{ width: 32, minWidth: 32 }}
                    onClick={handleCheckedRight}
                >
                    <ChevronRightIcon />
                </Button>
            </div>
            <div className="ms-table-transfer__list">
                <TableRight<T>
                    tableProps={tableProps}
                    rightRows={right}
                    rightCheckedIds={rightCheckedIds}
                    setRightCheckedIds={setRightCheckedIds}
                    selectedFilter={selectedFilter}
                    sortField={sortField}
                />
            </div>
        </div>
    );
};

export default TableTransfer;
