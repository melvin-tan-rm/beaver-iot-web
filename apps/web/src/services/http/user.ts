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

export interface RoleUndistributedUserType {
    email: string;
    nickname: string;
    user_id: ApiKey;
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
    addRole: {
        request: {
            name: string;
            description?: string;
        };
        response: {
            role_id: ApiKey;
        };
    };
    editRole: {
        request: {
            roleId: ApiKey;
            name: string;
            description?: string;
        };
        response: void;
    };
    deleteRole: {
        request: {
            roleId: ApiKey;
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
    /**
     * Get undistributed users under the  role
     */
    getRoleUndistributedUsers: {
        request: SearchRequestType & {
            role_id: ApiKey;
            keyword: string;
        };
        response: SearchResponseType<RoleUndistributedUserType[]>;
    };
}

/**
 * User API
 */
export default attachAPI<UserAPISchema>(client, {
    apis: {
        addUserMember: `POST ${API_PREFIX}/user/members`,
        addRole: `POST ${API_PREFIX}/user/roles`,
        editRole: `PUT ${API_PREFIX}/user/roles/:roleId`,
        deleteRole: `DELETE ${API_PREFIX}/user/roles/:roleId`,
        getAllRoles: `GET ${API_PREFIX}/user/roles`,
        getRoleAllUsers: `GET ${API_PREFIX}/user/roles/:role_id/members`,
        getRoleUndistributedUsers: `GET ${API_PREFIX}/user/roles/:role_id/undistributed-users`,
    },
});
