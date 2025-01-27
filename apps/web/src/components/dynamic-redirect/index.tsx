import { useMemo } from 'react';
import { Navigate } from 'react-router-dom';

import routes from '@/routes/routes';
import { useUserPermissions } from '@/hooks';

/**
 * the initial default redirect path
 */
const DynamicRedirect: React.FC = () => {
    const { hasPermission } = useUserPermissions();

    /**
     * find the first route that has permission and returns
     */
    const navigatePath = useMemo(() => {
        const permissionRoute = routes?.find(
            r =>
                r.path &&
                r.handle?.layout !== 'blank' &&
                !r.handle?.hideInMenuBar &&
                hasPermission(r.handle?.permissions),
        );

        return permissionRoute?.path || '/403';
    }, [hasPermission]);

    return <Navigate to={navigatePath} />;
};

export default DynamicRedirect;
