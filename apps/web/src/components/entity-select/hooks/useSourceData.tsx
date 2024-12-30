import { useCallback, useMemo } from 'react';
import { useRequest } from 'ahooks';
import { awaitWrap, entityAPI, getResponseData, isRequestSuccess } from '@/services/http';
import type { EntitySelectProps } from '../types';

export const useSourceData = (
    props: Pick<
        EntitySelectProps,
        'entityType' | 'entityAccessMod' | 'excludeChildren' | 'entityValueType'
    >,
) => {
    const { entityType, entityAccessMod, excludeChildren, entityValueType } = props;
    const {
        run: getEntityList,
        data: entityList,
        loading,
    } = useRequest(
        async (keyword?: string) => {
            const [error, resp] = await awaitWrap(
                entityAPI.getList({
                    page_number: 1,
                    page_size: 9999,
                    entity_type: entityType,
                    entity_access_mod: entityAccessMod,
                    exclude_children: excludeChildren,
                    entity_value_type: entityValueType,
                    keyword,
                }),
            );
            if (error || !isRequestSuccess(resp)) return;

            const data = getResponseData(resp)!;
            return data?.content || [];
        },
        {
            refreshDeps: [
                entityType,
                entityType,
                entityAccessMod,
                excludeChildren,
                entityValueType,
            ],
            debounceWait: 300,
        },
    );

    /** search entity list by keyword */
    const onSearch = useCallback(
        async (keyword: string) => {
            if (!keyword) {
                getEntityList();
                return;
            }

            getEntityList(keyword);
        },
        [getEntityList],
    );

    return {
        entityList: useMemo(() => entityList || [], [entityList]),
        loading,
        onSearch,
    };
};
