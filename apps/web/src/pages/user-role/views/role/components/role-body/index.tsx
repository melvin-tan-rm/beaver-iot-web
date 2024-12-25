import React, { useState, useMemo } from 'react';
import { useMemoizedFn } from 'ahooks';
import { Tabs, Tab } from '@mui/material';

import { useI18n } from '@milesight/shared/src/hooks';
import { TabPanel } from '@/components';

import { ROLE_MAIN_TABS } from '../../constants';
import Members from '../members';
import Functions from '../functions';

import styles from './style.module.less';

/**
 * Role Body
 * About Permissions Choose
 */
const RoleBody: React.FC = () => {
    const { getIntlText } = useI18n();

    const [currentTab, setCurrentTab] = useState(ROLE_MAIN_TABS.MEMBERS);

    const handleTabChange = useMemoizedFn((e: React.SyntheticEvent, newValue: ROLE_MAIN_TABS) => {
        console.log('handleTabChange ?  ', e, newValue);

        setCurrentTab(newValue);
    });

    const roleTabsOptions = useMemo(
        () => [
            {
                label: getIntlText('user.role.tab_title_members'),
                title: getIntlText('user.role.tab_title_members'),
                value: ROLE_MAIN_TABS.MEMBERS,
                content: <Members />,
            },
            {
                label: getIntlText('user.role.tab_title_functions'),
                title: getIntlText('user.role.tab_title_functions'),
                value: ROLE_MAIN_TABS.FUNCTIONS,
                content: <Functions />,
            },
            {
                label: getIntlText('user.role.tab_title_resources'),
                title: getIntlText('user.role.tab_title_resources'),
                value: ROLE_MAIN_TABS.RESOURCES,
                content: 'resources',
            },
        ],
        [getIntlText],
    );

    const renderTabs = () => {
        return (
            <>
                <div className={styles['role-body__tabs']}>
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
                <div className={styles['role-body__tab-panel']}>
                    {roleTabsOptions.map(tab => (
                        <TabPanel key={tab.value} value={currentTab} index={tab.value}>
                            {tab.content}
                        </TabPanel>
                    ))}
                </div>
            </>
        );
    };

    return <div className={styles['role-body']}>{renderTabs()}</div>;
};

export default RoleBody;
