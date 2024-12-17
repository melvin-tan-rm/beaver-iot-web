import { useMemo } from 'react';
import { useI18n, useTime } from '@milesight/shared/src/hooks';
import { type ColumnType } from '@/components';
import { type UserAPISchema } from '@/services/http';

export type TableRowDataType = ObjectToCamelCase<
    UserAPISchema['getRoleUndistributedUsers']['response']['content'][0]
>;

const useColumns = <T extends TableRowDataType>() => {
    const { getIntlText } = useI18n();
    const { getTimeFormat } = useTime();

    const columns: ColumnType<T>[] = useMemo(() => {
        return [
            {
                field: 'nickname',
                headerName: getIntlText('user.role.user_nickname'),
                flex: 1,
                minWidth: 150,
                ellipsis: true,
            },
            {
                field: 'email',
                headerName: getIntlText('common.label.email'),
                flex: 1,
                align: 'center',
                headerAlign: 'center',
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
                    return getTimeFormat(value);
                },
            },
        ];
    }, [getIntlText, getTimeFormat]);

    return columns;
};

export default useColumns;
