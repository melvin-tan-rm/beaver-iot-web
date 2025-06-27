import { client, attachAPI, API_PREFIX } from './client';

export interface TagItemProps {
    id: ApiKey;
    name: string;
    color: string;
    description?: string;
    tag_entities: number;
    created_at: number;
}

/**
 * Tag Management API
 */
export interface DashboardAPISchema extends APISchema {
    /** Get list */
    getTagList: {
        request: SearchRequestType & {
            keyword?: string;
        };
        response: SearchResponseType<TagItemProps[]>;
    };
}

/**
 * Tag-related API services
 */
export default attachAPI<DashboardAPISchema>(client, {
    apis: {
        getTagList: `POST ${API_PREFIX}/tag/list`,
    },
});
