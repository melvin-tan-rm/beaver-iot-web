import { useState, useMemo, useEffect } from 'react';
import { useMemoizedFn } from 'ahooks';
import { isNil } from 'lodash-es';

import { type GridValidRowModel } from '@mui/x-data-grid';

export interface UseTransferProps<T> {
    rows?: readonly T[];
    getRowId?: (row: T) => ApiKey;
    onChosen: (values: T[]) => void;
}

/**
 * transfer data hooks
 */
const useTransfer = <T extends GridValidRowModel>(props?: UseTransferProps<T>) => {
    const { rows = [], getRowId, onChosen } = props || {};

    const [checked, setChecked] = useState<T[]>([]);
    const [left, setLeft] = useState<readonly T[]>(rows);
    const [leftCheckedIds, setLeftCheckedIds] = useState<readonly ApiKey[]>([]);
    const [right, setRight] = useState<readonly T[]>([]);
    const [rightCheckedIds, setRightCheckedIds] = useState<readonly ApiKey[]>([]);

    /**
     * Getting the data in the a array that does not exist in the b array
     */
    const notExisted = useMemoizedFn((a: readonly T[], b: readonly T[]) => {
        return a.filter(item => {
            if (getRowId) {
                return !b.some(target => getRowId(item) === getRowId(target));
            }

            if (!isNil(item?.id)) {
                return !b.some(target => item.id === target.id);
            }

            return true;
        });
    });

    /**
     * update left data
     */
    useEffect(() => {
        setLeft(notExisted(rows || [], right));
    }, [rows, notExisted, right]);

    /**
     * Getting left intersection
     */
    const leftChecked = useMemo(() => {
        if (getRowId) {
            return left.filter(item => leftCheckedIds.includes(getRowId(item)));
        }

        return left.filter(item => leftCheckedIds.includes(item.id));
    }, [leftCheckedIds, left, getRowId]);

    /**
     * Getting right intersection
     */
    const rightChecked = useMemo(() => {
        if (getRowId) {
            return right.filter(item => rightCheckedIds.includes(getRowId(item)));
        }

        return right.filter(item => rightCheckedIds.includes(item.id));
    }, [rightCheckedIds, right, getRowId]);

    /**
     * Move the selected data to the right
     */
    const handleCheckedRight = useMemoizedFn(() => {
        const newRight = right.concat(leftChecked);

        setRight(newRight);
        setLeftCheckedIds([]);

        onChosen?.(newRight);
    });

    /**
     * Move the selected data to the left
     */
    const handleCheckedLeft = useMemoizedFn(() => {
        const newRight = notExisted(right, rightChecked);

        setRight(notExisted(right, rightChecked));
        setRightCheckedIds([]);

        onChosen?.(newRight);
    });

    return {
        left,
        right,
        checked,
        leftChecked,
        rightChecked,
        setChecked,
        leftCheckedIds,
        setLeftCheckedIds,
        rightCheckedIds,
        setRightCheckedIds,
        handleCheckedRight,
        handleCheckedLeft,
    };
};

export default useTransfer;
