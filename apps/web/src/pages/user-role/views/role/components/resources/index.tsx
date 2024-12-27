import React, { useState, useMemo } from 'react';
import { useMemoizedFn } from 'ahooks';
import { Tabs, Tab } from '@mui/material';

import { useI18n } from '@milesight/shared/src/hooks';
import { TabPanel } from '@/components';

import { ROLE_RESOURCES_TABS } from '../../constants';
import { Integration, Device } from './components';

import styles from './style.module.less';

/**
 * Resources component
 */
const Resources: React.FC = () => {
    const { getIntlText } = useI18n();

    const [currentTab, setCurrentTab] = useState(ROLE_RESOURCES_TABS.INTEGRATION);

    const handleTabChange = useMemoizedFn(
        (e: React.SyntheticEvent, newValue: ROLE_RESOURCES_TABS) => {
            setCurrentTab(newValue);
        },
    );

    const roleTabsOptions = useMemo(
        () => [
            {
                label: getIntlText('user.role.tab_title_resource_integration'),
                title: getIntlText('user.role.tab_title_resource_integration'),
                value: ROLE_RESOURCES_TABS.INTEGRATION,
                content: <Integration />,
            },
            {
                label: getIntlText('user.role.tab_title_functions_resource_device'),
                title: getIntlText('user.role.tab_title_functions_resource_device'),
                value: ROLE_RESOURCES_TABS.DEVICE,
                content: <Device />,
            },
            {
                label: getIntlText('user.role.tab_title_resources_resource_dashboard'),
                title: getIntlText('user.role.tab_title_resources_resource_dashboard'),
                value: ROLE_RESOURCES_TABS.DASHBOARD,
                content: 'DASHBOARD',
            },
        ],
        [getIntlText],
    );

    const renderTabs = () => {
        return (
            <>
                <div className={styles['resources-container__tabs']}>
                    <Tabs value={currentTab} onChange={handleTabChange}>
                        {roleTabsOptions.map(tab => (
                            <Tab
                                key={tab.value}
                                label={tab.label}
                                title={tab.title}
                                value={tab.value}
                            />
                        ))}
                    </Tabs>
                </div>
                <div className={styles['resources-container__tab-panel']}>
                    {roleTabsOptions.map(tab => (
                        <TabPanel key={tab.value} value={currentTab} index={tab.value}>
                            {tab.content}
                        </TabPanel>
                    ))}
                </div>
            </>
        );
    };

    return <div className={styles['resources-container']}>{renderTabs()}</div>;
};

export default Resources;
