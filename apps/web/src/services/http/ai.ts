import { client, attachAPI, API_PREFIX } from './client';

export interface SyncModelDetailType {
    output: {
        name: string;
        type: string;
        description: string;
        item_schema: Record<string, any>;
    }[];
}

/**
 * ai integration interface definition
 */
export interface AiAPISchema extends APISchema {
    /** sync model detail */
    syncModelDetail: {
        request: {
            model_id: ApiKey;
        };
        response: SyncModelDetailType;
    };
}

/**
 * ai integration API services
 */
export default attachAPI<AiAPISchema>(client, {
    apis: {
        syncModelDetail: `POST ${API_PREFIX}/ai-inference/model/:model_id/sync-detail`,
    },
});
