import { useEffect, useMemo } from 'react';
import { DataGridProps } from '@mui/x-data-grid';
import { isObject } from 'lodash-es';
import { useI18n } from '@milesight/shared/src/hooks';
import { GridApiCommunity } from '@mui/x-data-grid/internals';

/** The number of options per page is displayed by default */
const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 30, 40, 50];

/** Default paging model */
export const DEFAULT_PAGINATION_MODEL = { page: 0, pageSize: DEFAULT_PAGE_SIZE_OPTIONS[0] };

interface UseTableProProps {
    /**
     * Hook that instantiate a [[GridApiRef]].
     */
    apiRef: React.MutableRefObject<GridApiCommunity>;
    props: Partial<DataGridProps>;
}

/**
 * Table hooks about
 */
const useTable = ({ apiRef, props }: UseTableProProps) => {
    const { getIntlText } = useI18n();

    useEffect(() => {
        // If the keepNonExistentRowsSelected enabled, the current selection needs to be reset when the total changes
        if (props.keepNonExistentRowsSelected) {
            // apiRef.current.setRowSelectionModel([]);
        }
    }, [props.rowCount]);

    /**
     * Generate has search column
     */
    const pageSizeOptions = useMemo(() => {
        if (isObject(props.pageSizeOptions?.[0])) {
            return props.pageSizeOptions;
        }

        return ((props.pageSizeOptions as number[]) || DEFAULT_PAGE_SIZE_OPTIONS).map(
            (size: number) => ({
                value: size,
                label: `${size} / ${getIntlText('common.label.page')}`,
            }),
        );
    }, [getIntlText, props.pageSizeOptions]);

    return {
        pageSizeOptions,
    };
};

export default useTable;
