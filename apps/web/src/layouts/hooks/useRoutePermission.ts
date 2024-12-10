import { useEffect, useRef, useState } from 'react';
import { useMatches } from 'react-router';
import { useLocation, useNavigate } from 'react-router-dom';
import { isEmpty } from 'lodash-es';

import { PERMISSIONS } from '@/constants';

/**
 * Router Permissions Controller
 */
export const useRoutePermission = () => {
    const routeMatches = useMatches();
    const location = useLocation();
    const navigate = useNavigate();

    const [permissionLoading, setPermissionLoading] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout>>();

    /**
     * Determine whether the user has permission to access the current page.
     * No permission to jump directly to 403
     */
    useEffect(() => {
        setPermissionLoading(true);

        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = undefined;
        }

        timerRef.current = setTimeout(() => {
            /**
             * To query permissions
             */
            const getPermission = () => {
                /**
                 * Convert back-end permission information based on back-end data
                 */
                const userInfo = {
                    isSuperAdmin: false,
                    permissions: [PERMISSIONS.DASHBOARD_VIEW, PERMISSIONS.INTEGRATION_VIEW],
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

                const route = routeMatches.find(r => r.pathname === location.pathname);
                const { permissions } = (route?.handle || {}) as Record<string, any>;
                if (!Array.isArray(permissions) || isEmpty(permissions)) {
                    return;
                }

                if (permissions && !hasPermission(permissions)) {
                    navigate('/403', { replace: true });
                }
            };

            getPermission();
            setPermissionLoading(false);
        }, 150);

        /**
         * Clean up the timer when the component unmounts.
         */
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
                timerRef.current = undefined;
            }
        };
    }, [navigate, routeMatches, location]);

    return {
        permissionLoading,
    };
};
