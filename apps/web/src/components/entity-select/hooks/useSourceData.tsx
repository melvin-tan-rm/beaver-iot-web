import { useCallback, useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useMemoizedFn, useRequest } from 'ahooks';
import useEntityStore from '../store';
import type { EntitySelectProps } from '../types';

export const useSourceData = (
    props: Pick<
        EntitySelectProps,
        'entityType' | 'entityAccessMod' | 'excludeChildren' | 'entityValueType'
    >,
) => {
    const { entityType, entityAccessMod, excludeChildren, entityValueType } = props;
    const [keyword, setKeyword] = useState('');
    const { entityList, getEntityList, entityLoading, initEntityList, status } = useEntityStore(
        useShallow(state => ({
            entityList: state.entityList,
            entityLoading: state.entityLoading,
            getEntityList: state.getEntityList,
            initEntityList: state.initEntityList,
            status: state.status,
        })),
    );

    const init = useMemoizedFn(() => {
        initEntityList({ entityType, entityAccessMod, excludeChildren, entityValueType });
    });
    useEffect(() => {
        if (status !== 'ready') return;

        init();
    }, [init, initEntityList, status]);

    const { data: searchEntityList, loading: searchLoading } = useRequest(
        async () => {
            if (!keyword) return;

            const params = {
                keyword,
                entityType,
                entityAccessMod,
                excludeChildren,
                entityValueType,
            };
            return getEntityList(params);
        },
        { refreshDeps: [keyword], debounceWait: 300 },
    );
    /** search entity list by keyword */
    const onSearch = useCallback((keyword: string) => {
        setKeyword(keyword);
    }, []);

    return {
        entityList: keyword ? searchEntityList : entityList,
        loading: keyword ? searchLoading : entityLoading,
        onSearch,
    };
};
