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
    /** Sync model detail */
    syncModelDetail: {
        request: {
            model_id: ApiKey;
        };
        response: SyncModelDetailType;
    };

    /** Get devices */
    getDevices: {
        request: void | {
            /** Search keyword */
            name?: string;
        };
        response: {
            content: {
                id: ApiKey;
                name: string;
                integration_id: ApiKey;
                integration_name: string;
            }[];
        };
    };

    /** Get image entities of device */
    getDeviceImageEntities: {
        request: {
            /** Device ID */
            id: ApiKey;
        };
        response: {
            content: {
                id: ApiKey;
                key: string;
                name: string;
                format: 'IMAGE:URL' | 'IMAGE:BASE64';
                /** url or base64 string */
                value?: string;
            }[];
        };
    };
}

/**
 * ai integration API services
 */
export default attachAPI<AiAPISchema>(client, {
    apis: {
        syncModelDetail: `POST ${API_PREFIX}/ai-inference/model/:model_id/sync-detail`,
        getDevices: `POST ${API_PREFIX}/ai-inference/device/search`,
        getDeviceImageEntities: `POST ${API_PREFIX}/ai-inference/device/:id/image-entities`,
    },
});
