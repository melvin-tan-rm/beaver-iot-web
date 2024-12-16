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

export interface RoleUserType {
    role_id: ApiKey;
    user_id: ApiKey;
    user_nickname: string;
    user_email: string;
}

export interface UserAPISchema extends APISchema {
    addUserMember: {
        request: {
            email: string;
            nickname: string;
            password: string;
        };
        response: void;
    };
    getAllRoles: {
        request: void;
        response: RoleType[];
    };
    /**
     * Get all users under the  role
     */
    getRoleAllUsers: {
        request: SearchRequestType & {
            role_id: ApiKey;
            keyword: string;
        };
        response: SearchResponseType<RoleUserType[]>;
    };
}

/**
 * User API
 */
export default attachAPI<UserAPISchema>(client, {
    apis: {
        addUserMember: `POST ${API_PREFIX}/user/members`,
        getAllRoles: `GET ${API_PREFIX}/user/roles`,
        getRoleAllUsers: `GET ${API_PREFIX}/user/roles/:role_id/members`,
    },
});
