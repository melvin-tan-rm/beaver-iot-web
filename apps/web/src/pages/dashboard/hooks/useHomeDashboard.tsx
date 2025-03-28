import { useMemo, useState } from 'react';
import { useMemoizedFn } from 'ahooks';
import classNames from 'classnames';

import { useI18n } from '@milesight/shared/src/hooks';
import { StarOutlinedIcon, StarIcon, ErrorIcon } from '@milesight/shared/src/components';
import { useConfirm } from '@/components';

/**
 * Set or unset the home dashboard
 */
function useHomeDashboard() {
    const { getIntlText } = useI18n();
    const confirm = useConfirm();

    /**
     * whether the current dashboard the home dashboard
     */
    const [isHome, setIsHome] = useState(false);

    const toggleHomeDashboard = useMemoizedFn(() => {
        const description = isHome
            ? getIntlText('dashboard.unset_as_home_dashboard_description')
            : getIntlText('dashboard.set_as_home_dashboard_description');

        confirm({
            title: getIntlText('common.label.tip'),
            description,
            icon: <ErrorIcon sx={{ color: 'var(--primary-color-base)' }} />,
            cancelButtonProps: {
                disableRipple: true,
            },
            onConfirm: () => {
                setIsHome(!isHome);
            },
        });
    });

    const homeDashboardTip = useMemo(() => {
        return isHome
            ? getIntlText('dashboard.unset_as_home_dashboard_tip')
            : getIntlText('dashboard.set_as_home_dashboard_tip');
    }, [isHome, getIntlText]);

    const homeDashboardIcon = useMemo(() => {
        return isHome ? <StarIcon /> : <StarOutlinedIcon />;
    }, [isHome]);

    const homeDashboardClassName = useMemo(() => {
        return classNames('home-dashboard', {
            active: isHome,
        });
    }, [isHome]);

    return {
        isHome,
        toggleHomeDashboard,
        homeDashboardTip,
        homeDashboardIcon,
        homeDashboardClassName,
    };
}

export default useHomeDashboard;
