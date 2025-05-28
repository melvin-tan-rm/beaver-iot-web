import { useCallback } from 'react';
import { create } from 'zustand';
import { isUndefined, isNull } from 'lodash-es';
import { EventEmitter } from '@milesight/shared/src/utils/event-emitter';
import type { DashboardAPISchema } from '@/services/http';

type ListenerOptions = {
    widgetId?: ApiKey;
    dashboardId: ApiKey;
    callback?: (
        payload: any,
        options: Omit<ListenerOptions, 'callback'> & { entityId: ApiKey },
    ) => void;
};

interface ActivityEntityStore {
    /**
     * Entity details
     * @description The latest details of the entity that is currently being displayed in dashboard
     */
    entities?: Record<ApiKey, DashboardAPISchema['getDashboardDetail']['response']> | null;

    /**
     * Set latest entity details
     * @description Set the latest details of the entity that is currently being
     * displayed in dashboard
     */
    setLatestEntities: (entities: ActivityEntityStore['entities']) => void;
}

const eventEmitter = new EventEmitter();
const TOPIC_SEPARATOR = '/';
const genTopic = (dashboardId: ApiKey, entityId: ApiKey) => {
    return `${dashboardId}${TOPIC_SEPARATOR}${entityId}`;
};

const useActivityEntityStore = create<ActivityEntityStore>(set => ({
    entities: {},
    setLatestEntities: entities => set({ entities }),
}));

type EntityPoolValue = {
    /** The timer for periodic batch pushing messages to the view */
    timer?: number | null;
    /** The entity list that wait to be triggered */
    entities?: ApiKey[] | null;
};

const entityPool: Record<ApiKey, EntityPoolValue> = {};
const setEntityPool = (dashboardId: ApiKey, { timer, entities }: EntityPoolValue) => {
    const result = entityPool?.[dashboardId] || {};

    if (!isUndefined(timer)) result.timer = timer;
    if (!isUndefined(entities)) {
        let ids: EntityPoolValue['entities'] = null;

        if (!isNull(entities)) {
            ids = Array.isArray(entities) ? entities : [entities];
            ids = [...new Set([...(result.entities || []), ...(ids || [])])];
        }

        result.entities = ids;
    }

    entityPool[dashboardId] = result;
};

/**
 * Activity entity hook
 * @description The hook for managing the entity that is currently being displayed in dashboard
 */
const useActivityEntity = () => {
    const { entities, setLatestEntities } = useActivityEntityStore();

    const getLatestEntityDetail = useCallback(
        (entityId: ApiKey) => {
            return entities?.[entityId] || null;
        },
        [entities],
    );

    const addEntityListener = useCallback(
        (
            entityId: ApiKey | ApiKey[],
            { widgetId, dashboardId, callback = () => {} }: ListenerOptions,
        ) => {
            const topics = !Array.isArray(entityId)
                ? [genTopic(dashboardId, entityId)]
                : entityId.map(entityId => genTopic(dashboardId, entityId));

            topics.forEach(topic => {
                eventEmitter.subscribe(topic, callback, { widgetId, dashboardId });
            });

            return () => {
                topics.forEach(topic => {
                    eventEmitter.unsubscribe(topic, callback);
                });
            };
        },
        [],
    );

    const removeEntityListener = useCallback(
        (entityId: ApiKey | ApiKey[], { dashboardId, callback }: ListenerOptions) => {
            const topics = !Array.isArray(entityId)
                ? [genTopic(dashboardId, entityId)]
                : entityId.map(entityId => genTopic(dashboardId, entityId));

            topics.forEach(topic => {
                eventEmitter.unsubscribe(topic, callback);
            });
        },
        [],
    );

    const triggerEntityListener = useCallback(
        (
            entityId: ApiKey | ApiKey[],
            options: { dashboardId: ApiKey; payload?: any; periodTime?: number },
        ) => {
            const entityIds = Array.isArray(entityId) ? entityId : [entityId];
            const timer = entityPool[options.dashboardId]?.timer;

            if (entityIds.length) {
                setEntityPool(options.dashboardId, {
                    entities: entityIds,
                });
            }
            if (timer) return;

            const periodTimer = window.setTimeout(() => {
                const entities = entityPool[options.dashboardId]?.entities;

                entities?.forEach(entityId => {
                    const topic = genTopic(options.dashboardId, entityId);
                    const subscriber = eventEmitter.getSubscriber(topic);

                    if (!subscriber) return;
                    eventEmitter.publish(topic, options.payload, subscriber?.attrs);
                });
                setEntityPool(options.dashboardId, {
                    timer: null,
                    entities: null,
                });
            }, options.periodTime || 0);

            setEntityPool(options.dashboardId, {
                timer: periodTimer,
            });

            return () => {
                const timer = entityPool[options.dashboardId]?.timer;

                if (timer) window.clearTimeout(timer);
                setEntityPool(options.dashboardId, {
                    timer: null,
                    entities: null,
                });
            };
        },
        [],
    );

    const getCurrentEntityIds = useCallback((dashboardId: ApiKey) => {
        const topics = eventEmitter.getTopics();
        const result: string[] = [];

        topics.forEach(topic => {
            const [_dashboardId, _entityId] = topic.split(TOPIC_SEPARATOR);

            if (_dashboardId === dashboardId) result.push(_entityId);
        });

        return result;
    }, []);

    return {
        /**
         * The latest details of the entity that is currently being displayed in dashboard
         */
        entities,

        /**
         * Set latest entity details
         */
        setLatestEntities,

        /**
         * Get latest entity detail by entity id
         */
        getLatestEntityDetail,

        /**
         * Add entity listener
         */
        addEntityListener,

        /**
         * Remove entity listener
         */
        removeEntityListener,

        /**
         * Trigger entity listener to publish entity topic periodically
         */
        triggerEntityListener,

        /**
         * Get entity ids in the current dashboard
         */
        getCurrentEntityIds,
    };
};

export default useActivityEntity;
