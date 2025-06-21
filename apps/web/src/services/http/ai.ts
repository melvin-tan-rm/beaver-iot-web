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

    /** Bind device */
    bindDevice: {
        request: {
            /** Device ID */
            id: ApiKey;
            model_id: ApiKey;
            /** Image entity key */
            image_entity_key: ApiKey;
            /** The AI model inference input */
            infer_inputs: Record<string, any>;
            /** The AI model inference output definition */
            infer_outputs: {
                field_name: string;
                entity_name: string;
            }[];
        };
        response: void;
    };

    /** Get bound devices */
    getBoundDevices: {
        request: {
            /** Search keyword */
            name?: string;
            page_size: number;
            page_number: number;
        };
        response: {
            page_size: number;
            page_number: number;
            total: number;
            content: {
                device_id: ApiKey;
                device_name: string;
                model_name: string;
                origin_image: string;
                result_image: string;
                /** JSON string */
                infer_outputs_data: string;
                infer_status: 'OK' | 'Failed';
                uplink_at: number;
                infer_at: number;
                create_at: number;
                infer_history_key: string;
            }[];
        };
    };

    /** Get binding detail */
    getBindingDetail: {
        request: {
            id: ApiKey;
        };
        response: Omit<AiAPISchema['bindDevice']['request'], 'id'>;
    };

    /** Unbind device */
    unbindDevices: {
        request: {
            device_ids: ApiKey[];
        };
        response: void;
    };
}

/**
 * ai integration API services
 */
export default attachAPI<AiAPISchema>(client, {
    apis: {
        syncModelDetail: `POST ${API_PREFIX}/ai-inference/model/:model_id/sync-detail`,
        getDevices: `POST ${API_PREFIX}/ai-inference/device/search`,
        getDeviceImageEntities: `GET ${API_PREFIX}/ai-inference/device/:id/image-entities`,
        bindDevice: `POST ${API_PREFIX}/ai-inference/device/:id/bind`,
        getBoundDevices: `POST ${API_PREFIX}/ai-inference/bound-device/search`,
        getBindingDetail: `GET ${API_PREFIX}/ai-inference/device/:id/binding-detail`,
        unbindDevices: `POST ${API_PREFIX}/ai-inference/device/unbind`,
    },
});
