import { useMemo } from 'react';
import { Stack, IconButton } from '@mui/material';
import { useI18n, useTime } from '@milesight/shared/src/hooks';
import { DeleteOutlineIcon, EditIcon } from '@milesight/shared/src/components';
import { Tooltip, type ColumnType, Tag } from '@/components';
import { type TagItemProps } from '@/services/http';

type OperationType = 'edit' | 'delete';

export type TableRowDataType = ObjectToCamelCase<TagItemProps>;

export interface UseColumnsProps<T> {
    /**
     * operation Button callbacks
     */
    onButtonClick: (type: OperationType, record: T) => void;
}

const useColumns = <T extends TableRowDataType>({ onButtonClick }: UseColumnsProps<T>) => {
    const { getIntlText } = useI18n();
    const { getTimeFormat } = useTime();

    const columns: ColumnType<T>[] = useMemo(() => {
        return [
            {
                field: 'name',
                headerName: getIntlText('tag.title.tag_name'),
                flex: 1,
                minWidth: 350,
                ellipsis: false,
                renderCell({ row }) {
                    return <Tag label={row.name} arbitraryColor={row.color} />;
                },
            },
            {
                field: 'description',
                headerName: getIntlText('common.label.description'),
                flex: 1,
                minWidth: 150,
                ellipsis: true,
            },
            {
                field: 'taggedEntitiesCount',
                headerName: getIntlText('tag.title.tagged_entities'),
                flex: 1,
                minWidth: 150,
                ellipsis: true,
            },
            {
                field: 'createdAt',
                headerName: getIntlText('common.label.create_time'),
                flex: 1,
                minWidth: 150,
                ellipsis: true,
                renderCell({ value }) {
                    return getTimeFormat(Number(value), 'fullDateTimeSecondFormat');
                },
            },
            {
                field: '$operation',
                headerName: getIntlText('common.label.operation'),
                display: 'flex',
                width: 120,
                align: 'left',
                headerAlign: 'left',
                fixed: 'right',
                renderCell({ row }) {
                    return (
                        <Stack
                            direction="row"
                            spacing="4px"
                            sx={{ height: '100%', alignItems: 'center', justifyContent: 'end' }}
                        >
                            <Tooltip title={getIntlText('common.button.edit')}>
                                <IconButton
                                    sx={{ width: 30, height: 30 }}
                                    onClick={() => onButtonClick('edit', row)}
                                >
                                    <EditIcon sx={{ width: 20, height: 20 }} />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title={getIntlText('common.label.delete')}>
                                <IconButton
                                    sx={{
                                        width: 30,
                                        height: 30,
                                        color: 'text.secondary',
                                    }}
                                    onClick={() => onButtonClick('delete', row)}
                                >
                                    <DeleteOutlineIcon sx={{ width: 20, height: 20 }} />
                                </IconButton>
                            </Tooltip>
                        </Stack>
                    );
                },
            },
        ];
    }, [getIntlText, onButtonClick, getTimeFormat]);

    return columns;
};

export default useColumns;
