import { useEffect, useRef, useState } from 'react';
import { useMatches } from 'react-router';
import { useLocation, useNavigate } from 'react-router-dom';
import { isEmpty } from 'lodash-es';

import { useUserPermissions } from '@/hooks';

/**
 * Router Permissions Controller
 */
const useRoutePermission = () => {
    const routeMatches = useMatches();
    const location = useLocation();
    const navigate = useNavigate();
    const { hasPermission } = useUserPermissions();

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
                const route = routeMatches.find(r => r.pathname === location.pathname);
                const { permissions } = (route?.handle || {}) as Record<string, any>;
                if (isEmpty(permissions)) {
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
    }, [navigate, routeMatches, location, hasPermission]);

    return {
        permissionLoading,
    };
};

export default useRoutePermission;
