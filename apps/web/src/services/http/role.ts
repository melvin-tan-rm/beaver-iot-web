import { client, attachAPI, API_PREFIX } from './client';

export interface RoleType {
    /**
     * The id of the role
     */
    role_id: ApiKey;
    /**
     * The name of the role
     */
    name: string;
    /**
     * The description of the role
     */
    description?: string;
    /**
     * How many users the role has
     */
    user_role_count?: number;
    /**
     * How many integration the role has
     */
    role_integration_count?: number;
}

export interface RoleAPISchema extends APISchema {
    /** get all roles */
    getAllRoles: {
        request: void;
        response: RoleType[];
    };
}

/**
 * Role API
 */
export default attachAPI<RoleAPISchema>(client, {
    apis: {
        getAllRoles: `GET ${API_PREFIX}/user/roles`,
    },
});
