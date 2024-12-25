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
            role_id: ApiKey;
            name: string;
            description?: string;
        };
        response: void;
    };
    deleteRole: {
        request: {
            role_id: ApiKey;
        };
        response: void;
    };
    getAllRoles: {
        request: SearchRequestType & {
            keyword?: string;
        };
        response: SearchResponseType<RoleType[]>;
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
    /**
     * distributed users under the role
     */
    distributeUsersToRole: {
        request: {
            role_id: ApiKey;
            user_ids: ApiKey[];
        };
        response: void;
    };
    /**
     * Remove users from the role
     */
    removeUsersFromRole: {
        request: {
            role_id: ApiKey;
            user_ids: ApiKey[];
        };
        response: void;
    };
}

/**
 * User API
 */
export default attachAPI<UserAPISchema>(client, {
    apis: {
        addUserMember: `POST ${API_PREFIX}/user/members`,
        addRole: `POST ${API_PREFIX}/user/roles`,
        editRole: `PUT ${API_PREFIX}/user/roles/:role_id`,
        deleteRole: `DELETE ${API_PREFIX}/user/roles/:role_id`,
        getAllRoles: `POST ${API_PREFIX}/user/roles/search`,
        getRoleAllUsers: `POST ${API_PREFIX}/user/roles/:role_id/members`,
        getRoleUndistributedUsers: `POST ${API_PREFIX}/user/roles/:role_id/undistributed-users`,
        distributeUsersToRole: `POST ${API_PREFIX}/user/roles/:role_id/associate-user`,
        removeUsersFromRole: `POST ${API_PREFIX}/user/roles/:role_id/disassociate-user`,
    },
});
