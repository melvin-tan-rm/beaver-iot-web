import { useMemo } from 'react';
import { Stack, IconButton } from '@mui/material';
import { useI18n, useTime } from '@milesight/shared/src/hooks';
import { ListAltIcon, DeleteOutlineIcon } from '@milesight/shared/src/components';
import { Tooltip, type ColumnType } from '@/components';
import { ImagePreview, CodePreview } from './components';

type OperationType = 'log' | 'delete';

export type TableRowDataType = Record<string, any>;

export interface UseColumnsProps<T> {
    /**
     * Operation Button click callback
     */
    onButtonClick: (type: OperationType, record: T) => void;
}

const useColumns = <T extends TableRowDataType>({ onButtonClick }: UseColumnsProps<T>) => {
    const { getIntlText } = useI18n();
    const { getTimeFormat } = useTime();

    const columns: ColumnType<T>[] = useMemo(() => {
        return [
            {
                field: 'deviceId',
                headerName: 'Device ID',
                minWidth: 160,
                ellipsis: true,
            },
            {
                field: 'deviceName',
                headerName: 'Device Name',
                minWidth: 160,
                ellipsis: true,
            },
            {
                field: 'aiServiceName',
                headerName: 'AI Service Name',
                minWidth: 160,
                ellipsis: true,
            },
            {
                field: 'originalImageUrl',
                headerName: 'Original Image',
                minWidth: 160,
                cellClassName: 'd-flex align-items-center',
                renderCell({ id, value }) {
                    return <ImagePreview key={id} src={value} />;
                },
            },
            {
                field: 'resultImageUrl',
                headerName: 'Result Image',
                minWidth: 160,
                cellClassName: 'd-flex align-items-center',
                renderCell({ id, value }) {
                    return <ImagePreview key={id} src={value} />;
                },
            },
            {
                field: 'inferenceResult',
                headerName: 'Inference Result',
                minWidth: 160,
                cellClassName: 'd-flex align-items-center',
                renderCell({ id, value }) {
                    return <CodePreview key={id} content={value} />;
                },
            },
            {
                field: 'status',
                headerName: 'Status',
                minWidth: 160,
                ellipsis: true,
            },
            {
                field: 'createdAt',
                headerName: getIntlText('common.label.create_time'),
                flex: 1,
                minWidth: 150,
                ellipsis: true,
                renderCell({ value }) {
                    return getTimeFormat(value);
                },
            },
            {
                field: 'inferenceAt',
                headerName: 'Inference Time',
                ellipsis: true,
                flex: 1,
                minWidth: 150,
                renderCell({ value }) {
                    return getTimeFormat(value);
                },
            },
            {
                field: '$operation',
                headerName: getIntlText('common.label.operation'),
                width: 120,
                display: 'flex',
                align: 'left',
                headerAlign: 'left',
                renderCell({ row }) {
                    return (
                        <Stack
                            direction="row"
                            spacing="4px"
                            sx={{ height: '100%', alignItems: 'center', justifyContent: 'end' }}
                        >
                            <Tooltip title={getIntlText('common.label.detail')}>
                                <IconButton
                                    sx={{ width: 30, height: 30 }}
                                    onClick={() => onButtonClick('log', row)}
                                >
                                    <ListAltIcon sx={{ width: 20, height: 20 }} />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title={getIntlText('common.label.delete')}>
                                <IconButton
                                    // color="error"
                                    disabled={!row.deletable}
                                    sx={{
                                        width: 30,
                                        height: 30,
                                        color: 'text.secondary',
                                        // '&:hover': { color: 'error.light' },
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
    }, [getIntlText, getTimeFormat, onButtonClick]);

    return columns;
};

export default useColumns;
