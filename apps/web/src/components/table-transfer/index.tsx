import React from 'react';
import { Button } from '@mui/material';
import { ChevronLeftIcon, ChevronRightIcon } from '@milesight/shared/src/components';

import { TableLeft, TableRight } from './components';
import { useTransfer } from './hooks';

import styles from './style.module.less';

/**
 * Table Transfer component
 */
const TableTransfer: React.FC = () => {
    const { checked } = useTransfer();

    return (
        <div className={styles['table-transfer']}>
            <div className={styles['table-transfer__list']}>
                <TableLeft />
            </div>
            <div className={styles['table-transfer__operation']}>
                <Button variant="contained" sx={{ width: 32, minWidth: 32 }}>
                    <ChevronLeftIcon />
                </Button>
                <Button variant="contained" sx={{ width: 32, minWidth: 32 }}>
                    <ChevronRightIcon />
                </Button>
            </div>
            <div className={styles['table-transfer__list']}>
                <TableRight />
            </div>
        </div>
    );
};

export default TableTransfer;
