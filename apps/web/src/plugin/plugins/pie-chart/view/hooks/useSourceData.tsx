import { useEffect, useMemo } from 'react';
import { useRequest } from 'ahooks';
import ws, { getExChangeTopic } from '@/services/ws';
import {
    awaitWrap,
    entityAPI,
    type EntityAPISchema,
    getResponseData,
    isRequestSuccess,
} from '@/services/http';
import type { ViewConfigProps } from '../../typings';

interface AggregateHistoryList {
    entity: EntityOptionType;
    data: EntityAPISchema['getAggregateHistory']['response'];
}
interface IProps {
    config: ViewConfigProps;
    configJson: CustomComponentProps;
}
export const useSourceData = (props: IProps) => {
    const { config, configJson } = props;
    const { isPreview } = configJson || {};
    const { entity, metrics, time } = config || {};

    const { data: countData, runAsync: getData } = useRequest(
        async () => {
            if (!entity?.value) return;

            const run = async (selectEntity: EntityOptionType) => {
                const { value: entityId } = selectEntity || {};
                if (!entityId) return;

                const now = Date.now();
                const [error, resp] = await awaitWrap(
                    entityAPI.getAggregateHistory({
                        entity_id: entityId,
                        aggregate_type: metrics,
                        start_timestamp: now - time,
                        end_timestamp: now,
                    }),
                );
                if (error || !isRequestSuccess(resp)) return;

                const data = getResponseData(resp);
                return {
                    entity,
                    data,
                } as AggregateHistoryList;
            };
            return Promise.resolve(run(entity));
        },
        { refreshDeps: [entity, time, metrics] },
    );

    const topic = useMemo(() => {
        const entityKey = entity?.value?.toString();
        return entityKey && getExChangeTopic(entityKey);
    }, [entity]);
    // Subscribe to WS topics
    useEffect(() => {
        if (!topic || isPreview) return;

        const unsubscribe = ws.subscribe(topic, getData);
        return () => {
            unsubscribe?.();
        };
    }, [topic, isPreview]);

    return {
        countData,
    };
};
