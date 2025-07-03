import { useMemo } from 'react';
import { GridValidRowModel } from '@mui/x-data-grid';
import { isObject } from 'lodash-es';
import { useI18n } from '@milesight/shared/src/hooks';
import { GridApiCommunity } from '@mui/x-data-grid/internals';
import { useDebounceEffect } from 'ahooks';
import { TableProProps } from '../types';

/** The number of options per page is displayed by default */
const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 30, 40, 50];

/** Default paging model */
export const DEFAULT_PAGINATION_MODEL = { page: 0, pageSize: DEFAULT_PAGE_SIZE_OPTIONS[0] };

interface UseTableProps<T extends GridValidRowModel> {
    /**
     * Hook that instantiate a [[GridApiRef]].
     */
    apiRef: React.MutableRefObject<GridApiCommunity>;
    props: Partial<TableProProps<T>>;
}

/**
 * Table hooks about
 */
const useTable = <T extends GridValidRowModel>({ apiRef, props }: UseTableProps<T>) => {
    const { getIntlText } = useI18n();

    // If the search conditions change (such as advanced filter, fuzzy search, etc.),
    // the selected ones need to be reset
    useDebounceEffect(
        () => {
            apiRef.current.setRowSelectionModel([]);
        },
        [JSON.stringify(props.filterCondition)],
        {
            wait: 200,
        },
    );

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
