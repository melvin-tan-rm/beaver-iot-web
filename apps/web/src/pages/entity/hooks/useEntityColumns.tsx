import { useMemo } from 'react';
import { Stack, IconButton, Chip, type ChipProps } from '@mui/material';
import { useI18n, useTime } from '@milesight/shared/src/hooks';
import { ListAltIcon, EditIcon, FilterAltIcon } from '@milesight/shared/src/components';
import {
    Tooltip,
    type ColumnType,
    PermissionControlHidden,
    FILTER_OPERATORS,
    getOperatorsByExclude,
} from '@/components';
import { ENTITY_DATA_VALUE_TYPE, PERMISSIONS } from '@/constants';
import { type EntityAPISchema } from '@/services/http';

type OperationType = 'detail' | 'edit' | 'filter' | 'editTag';

export type TableRowDataType = ObjectToCamelCase<
    EntityAPISchema['getList']['response']['content'][0]
>;

// Entity type Tag Color mapping
const entityTypeColorMap: Record<string, ChipProps['color']> = {
    event: 'success',
    service: 'warning',
    property: 'primary',
};

export interface UseColumnsProps<T> {
    /**
     * Operation Button click callback
     */
    onButtonClick: (type: OperationType, record: T, tag?: string) => void;
    /**
     * filtered info
     */
    filteredInfo: Record<string, any>;
}

const useEntityColumns = <T extends TableRowDataType>({
    onButtonClick,
    filteredInfo,
}: UseColumnsProps<T>) => {
    const { getIntlText } = useI18n();
    const { getTimeFormat } = useTime();

    const columns: ColumnType<T>[] = useMemo(() => {
        return [
            {
                field: 'entityName',
                headerName: getIntlText('device.label.param_entity_name'),
                flex: 1,
                minWidth: 250,
                ellipsis: true,
                operators: getOperatorsByExclude([
                    FILTER_OPERATORS.IS_EMPTY,
                    FILTER_OPERATORS.IS_NOT_EMPTY,
                    FILTER_OPERATORS.ANY_EQUALS,
                ]),
                operatorValueCompType: 'input',
            },
            {
                field: 'deviceName',
                headerName: getIntlText('common.label.device'),
                flex: 1,
                minWidth: 120,
                ellipsis: true,
                operators: getOperatorsByExclude([
                    FILTER_OPERATORS.IS_EMPTY,
                    FILTER_OPERATORS.IS_NOT_EMPTY,
                    FILTER_OPERATORS.ANY_EQUALS,
                ]),
                operatorValueCompType: 'input',
            },
            {
                field: 'deviceGroup',
                headerName: getIntlText('entity.label.device_group'),
                flex: 1,
                minWidth: 180,
                ellipsis: true,
                operators: [FILTER_OPERATORS.ANY_EQUALS],
                getFilterValueOptions: async () => {
                    return [
                        {
                            label: '222',
                            value: '22222',
                        },
                        {
                            label: '3333',
                            value: '333344',
                        },
                    ];
                },
                operatorValueCompType: 'select',
            },
            {
                field: 'entityTags',
                headerName: getIntlText('entity.label.entity_tags'),
                flex: 1,
                minWidth: 280,
                align: 'left',
                renderCell({ value }) {
                    return (
                        <Stack
                            direction="row"
                            spacing={1}
                            sx={{ height: '100%', alignItems: 'center', justifyContent: 'start' }}
                        >
                            <Tooltip title="getIntlText(buildbuild)">
                                <Chip
                                    label="buildbuildbuildbuild"
                                    sx={{
                                        maxWidth: 60,
                                        borderRadius: 1,
                                        backgroundColor: 'red',
                                        '&:hover': {
                                            backgroundColor: 'red',
                                        },
                                    }}
                                    variant="filled"
                                    onClick={e => onButtonClick('filter', row, tag)}
                                />
                            </Tooltip>
                            <Tooltip title="build">
                                <Chip
                                    sx={{
                                        maxWidth: 60,
                                        borderRadius: 1,
                                        backgroundColor: 'red',
                                        '&:hover': {
                                            backgroundColor: 'red',
                                        },
                                    }}
                                    label="build"
                                    variant="filled"
                                    onClick={e => onButtonClick('filter', row, tag)}
                                />
                            </Tooltip>
                        </Stack>
                    );
                },
                operators: getOperatorsByExclude([
                    FILTER_OPERATORS.NE,
                    FILTER_OPERATORS.START_WITH,
                    FILTER_OPERATORS.END_WITH,
                ]),
                operatorValues: [
                    {
                        label: '222',
                        value: '22222',
                    },
                    {
                        label: '3333',
                        value: '333344',
                    },
                ],
                operatorValueCompType: 'select',
            },
            {
                field: 'entityParentName',
                headerName: getIntlText('entity.label.parent_entity'),
                align: 'left',
                flex: 1,
                minWidth: 180,
                ellipsis: true,
                operators: getOperatorsByExclude([FILTER_OPERATORS.ANY_EQUALS]),
                operatorValueCompType: 'input',
            },
            {
                field: 'entityValueType',
                headerName: getIntlText('common.label.type'),
                align: 'left',
                flex: 1,
                minWidth: 100,
                maxWidth: 100,
                ellipsis: true,
                operators: [FILTER_OPERATORS.ANY_EQUALS],
                getFilterValueOptions: async () => {
                    return Object.keys(ENTITY_DATA_VALUE_TYPE).map(key => ({
                        label: key,
                        value: key,
                    }));
                },
                operatorValueCompType: 'select',
            },
            {
                field: 'entityLatestValue',
                headerName: getIntlText('entity.label.latest_value'),
                flex: 1,
                minWidth: 120,
                ellipsis: true,
            },
            {
                field: 'integrationName',
                headerName: getIntlText('common.label.integration'),
                flex: 1,
                minWidth: 250,
                ellipsis: true,
                operators: getOperatorsByExclude([
                    FILTER_OPERATORS.IS_EMPTY,
                    FILTER_OPERATORS.IS_NOT_EMPTY,
                    FILTER_OPERATORS.ANY_EQUALS,
                ]),
                operatorValueCompType: 'input',
            },
            {
                field: 'entityKey',
                headerName: getIntlText('device.label.param_entity_id'),
                flex: 1,
                minWidth: 300,
                ellipsis: true,
                hidden: true,
                operators: getOperatorsByExclude([
                    FILTER_OPERATORS.IS_EMPTY,
                    FILTER_OPERATORS.IS_NOT_EMPTY,
                    FILTER_OPERATORS.ANY_EQUALS,
                ]),
                operatorValueCompType: 'input',
            },
            {
                field: '$operation',
                headerName: getIntlText('common.label.operation'),
                width: 120,
                flex: 0,
                display: 'flex',
                align: 'left',
                fixed: 'right',
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
                                    onClick={() => onButtonClick('detail', row)}
                                >
                                    <ListAltIcon sx={{ width: 20, height: 20 }} />
                                </IconButton>
                            </Tooltip>
                            <PermissionControlHidden permissions={PERMISSIONS.ENTITY_DATA_EDIT}>
                                <Tooltip title={getIntlText('common.button.edit')}>
                                    <IconButton
                                        sx={{
                                            width: 30,
                                            height: 30,
                                        }}
                                        onClick={() => onButtonClick('edit', row)}
                                    >
                                        <EditIcon sx={{ width: 20, height: 20 }} />
                                    </IconButton>
                                </Tooltip>
                            </PermissionControlHidden>
                        </Stack>
                    );
                },
            },
        ];
    }, [getIntlText, getTimeFormat, onButtonClick, filteredInfo]);

    return columns;
};

export default useEntityColumns;
