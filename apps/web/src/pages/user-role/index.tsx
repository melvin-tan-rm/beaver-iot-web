import { useState, useMemo } from 'react';
import { Tabs, Tab } from '@mui/material';
import { useI18n } from '@milesight/shared/src/hooks';
import { Breadcrumbs, TabPanel } from '@/components';

import { UserView, RoleView } from './views';

import styles from './style.module.less';

/**
 * User Role Module
 */
function UserRole() {
    const { getIntlText } = useI18n();
    const [tab, setTab] = useState<ApiKey>('1');

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setTab(newValue);
    };

    /**
     * Handle tabs data
     */
    const tabsData = useMemo(() => {
        return [
            {
                title: getIntlText('user.label.tab_name_users'),
                label: getIntlText('user.label.tab_name_users'),
                key: '1',
                content: <UserView />,
            },
            {
                title: getIntlText('user.label.tab_name_roles'),
                label: getIntlText('user.label.tab_name_roles'),
                key: '2',
                content: <RoleView />,
            },
        ];
    }, [getIntlText]);

    const renderTabs = () => {
        return (
            <>
                <Tabs className="ms-tabs" value={tab} onChange={handleChange}>
                    {tabsData.map(item => (
                        <Tab
                            disableRipple
                            key={item.key}
                            title={item.title}
                            label={item.label}
                            value={item.key}
                        />
                    ))}
                </Tabs>
                <div className="ms-tab-content">
                    {tabsData.map(item => (
                        <TabPanel key={item.key} value={tab} index={item.key}>
                            {item.content}
                        </TabPanel>
                    ))}
                </div>
            </>
        );
    };

    return (
        <div className="ms-main">
            <Breadcrumbs />
            <div className={`ms-view ${styles['user-role']}`}>{renderTabs()}</div>
        </div>
    );
}

export default UserRole;
