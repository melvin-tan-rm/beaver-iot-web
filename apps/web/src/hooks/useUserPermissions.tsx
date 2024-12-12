import { PERMISSIONS } from '@/constants';

/**
 * Global User Permissions Controller hooks
 */
const useUserPermissions = () => {
    /**
     * Convert back-end permission information based on back-end data
     */
    const userInfo = {
        isSuperAdmin: false,
        permissions: [PERMISSIONS.USER_ROLE_MODULE, PERMISSIONS.INTEGRATION_MODULE],
    };

    const hasPermission = (p: PERMISSIONS[] | PERMISSIONS) => {
        /**
         * Super Admin has all permissions
         */
        if (userInfo?.isSuperAdmin) {
            return true;
        }

        /**
         * As long as it contains one of the access permissions
         * it can be accessed
         */
        if (Array.isArray(p)) {
            return p.some(item => userInfo.permissions.includes(item));
        }

        /**
         * Determine if you have the specified permission
         */
        return userInfo.permissions.includes(p);
    };

    return {
        hasPermission,
    };
};

export default useUserPermissions;
