import { useState, useEffect, useMemo } from 'react';
import cls from 'classnames';
import { isEmpty, isNil } from 'lodash-es';
import { useRequest } from 'ahooks';
import { Tabs, Tab, Toolbar, CircularProgress } from '@mui/material';
import { AddIcon, toast } from '@milesight/shared/src/components';
import { useI18n, usePreventLeave } from '@milesight/shared/src/hooks';
import { dashboardAPI, awaitWrap, isRequestSuccess, getResponseData } from '@/services/http';
import { DashboardDetail } from '@/services/http/dashboard';
import { useMqtt, MQTT_STATUS, MQTT_EVENT_TYPE, BATCH_PUSH_TIME } from '@/hooks';
import {
    TabPanel,
    useConfirm,
    PermissionControlHidden,
    Empty,
    SidebarController,
} from '@/components';
import { useActivityEntity } from '@/plugin/hooks';
import { PERMISSIONS } from '@/constants';
import { useDashboardStore } from '@/stores';
import DashboardContent from './components/dashboard-content';
import AddDashboard from './components/add-dashboard';
import './style.less';

export default () => {
    const { getIntlText } = useI18n();
    const confirm = useConfirm();
    const { updateIsEditing } = useDashboardStore();

    const [tabs, setTabs] = useState<DashboardDetail[]>([]);
    const [tabKey, setTabKey] = useState<ApiKey>();
    const [showAdd, setShowAdd] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [loading, setLoading] = useState<boolean>();
    const [isTooSmallScreen, setIsTooSmallScreen] = useState(false);

    const { showPrevent } = usePreventLeave({
        confirm,
        isPreventLeave: isEdit,
    });

    const { run: getDashboards } = useRequest(
        async () => {
            setLoading(true);
            const [error, resp] = await awaitWrap(dashboardAPI.getDashboards());
            setLoading(false);
            if (error || !isRequestSuccess(resp)) return;

            const data = getResponseData(resp);

            setTabs(data || []);
            setTabKey(key => {
                const isExist = data?.some(item => item.dashboard_id === key);

                if (!key || !isExist) return data?.[0]?.dashboard_id || '';
                return key;
            });
        },
        {
            debounceWait: 300,
        },
    );

    /** To storage the dashboard isEditing status */
    useEffect(() => {
        updateIsEditing(isEdit);
    }, [isEdit]);

    /** To judge current screen whether too small */
    useEffect(() => {
        const getWindowWidth = () => {
            const windowWidth =
                document.body.clientWidth ||
                document.documentElement.clientWidth ||
                window.innerWidth;

            const isTooSmall = windowWidth <= 720;
            setIsTooSmallScreen(isTooSmall);

            if (isTooSmall) {
                setIsEdit(false);
            }
        };
        getWindowWidth();

        window.addEventListener('resize', getWindowWidth);

        return () => {
            window.removeEventListener('resize', getWindowWidth);
        };
    }, []);

    // Switch dashboard tabs
    const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
        // Determine whether to edit the state and block the jump
        if (isEdit) {
            showPrevent({
                onOk: () => {
                    setTabKey(newValue);
                    setIsEdit(false);
                },
            });
        } else {
            setTabKey(newValue);
        }
    };

    // The new dashboard pop-up is displayed
    const showAddDashboard = () => {
        setShowAdd(true);
    };

    const handleCloseAdd = () => {
        setShowAdd(false);
    };

    // Add dashboard
    const handleAdd = async (data: DashboardDetail) => {
        const [_, res] = await awaitWrap(dashboardAPI.addDashboard(data));
        if (isRequestSuccess(res)) {
            const resData: any = getResponseData(res);
            setTabs([...tabs, { ...data, dashboard_id: resData.dashboard_id, widgets: [] }]);
            setShowAdd(false);
            toast.success(getIntlText('common.message.operation_success'));
            // If the dashboard is newly added, a prompt is displayed indicating whether to switch to a new tab page
            if (!data.dashboard_id) {
                if (isEdit) {
                    confirm({
                        title: getIntlText('common.modal.title_leave_current_page'),
                        description: getIntlText('dashboard.leave_to_new_dashboard_description'),
                        confirmButtonText: getIntlText('common.button.confirm'),
                        onConfirm: () => {
                            setTabKey(resData.dashboard_id);
                            setIsEdit(false);
                        },
                    });
                } else {
                    setTabKey(resData.dashboard_id);
                }
            }
        }
    };

    const tabContent = useMemo(() => {
        if (loading || isNil(loading)) {
            return (
                <div className="ms-tab-content__empty">
                    <CircularProgress />
                </div>
            );
        }

        if (!Array.isArray(tabs) || isEmpty(tabs)) {
            return (
                <div className="ms-tab-content__empty">
                    <Empty text={getIntlText('common.label.empty')} />
                </div>
            );
        }

        return tabs?.map(tabItem => {
            return (
                <TabPanel
                    key={tabItem.dashboard_id}
                    value={tabKey || ''}
                    index={tabItem.dashboard_id}
                >
                    <DashboardContent
                        dashboardDetail={tabItem}
                        getDashboards={getDashboards}
                        isEdit={isEdit}
                        onChangeIsEdit={setIsEdit}
                        isTooSmallScreen={isTooSmallScreen}
                        existedHomeDashboard={(tabs || [])?.some(t => Boolean(t.home))}
                    />
                </TabPanel>
            );
        });
    }, [getDashboards, getIntlText, isEdit, isTooSmallScreen, loading, tabKey, tabs]);

    // ---------- Listen the entities change by Mqtt ----------
    const { status: mqttStatus, client: mqttClient } = useMqtt();
    const { triggerEntityListener } = useActivityEntity();

    useEffect(() => {
        if (!tabKey || !mqttClient || mqttStatus !== MQTT_STATUS.CONNECTED) return;

        const removeTriggerListener = mqttClient.subscribe(MQTT_EVENT_TYPE.EXCHANGE, payload => {
            // console.log('[MQTT] Receive the message', payload);
            triggerEntityListener(payload.payload?.entity_ids || [], {
                dashboardId: tabKey,
                payload,
                periodTime: BATCH_PUSH_TIME,
            });
        });

        return removeTriggerListener;
    }, [mqttStatus, mqttClient, tabKey, triggerEntityListener]);

    // Unsubscribe the topic when the dashboard page is unmounted
    useEffect(() => {
        return () => {
            mqttClient?.unsubscribe(MQTT_EVENT_TYPE.EXCHANGE);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="ms-main dashboard">
            <div className="ms-view ms-view-dashboard">
                <Toolbar className="dashboard-toolbar">
                    <SidebarController />
                    <Tabs
                        variant="scrollable"
                        scrollButtons="auto"
                        className="ms-tabs"
                        value={tabKey}
                        onChange={handleChange}
                        sx={{
                            '& .MuiTabs-scrollButtons': {
                                '&.Mui-disabled': {
                                    width: 0, // Hide disabled scroll buttons
                                },
                            },
                            '& .MuiTabs-scrollButtons.Mui-disabled': {
                                display: 'none', // Completely hides disabled scroll buttons
                            },
                            '.MuiTabs-flexContainer': {
                                borderBottom: 'none',
                                padding: '0 16px',
                            },
                        }}
                    >
                        {tabs?.map(tabItem => {
                            return (
                                <Tab
                                    key={tabItem.dashboard_id}
                                    disableRipple
                                    title={tabItem.name}
                                    label={tabItem.name}
                                    value={tabItem.dashboard_id}
                                />
                            );
                        })}
                    </Tabs>
                    <PermissionControlHidden permissions={PERMISSIONS.DASHBOARD_ADD}>
                        <div
                            className={cls('dashboard-add-contain md:d-none', {
                                'dashboard-add-contain-list': !!tabs?.length,
                            })}
                        >
                            <div className="dashboard-add" onClick={showAddDashboard}>
                                <AddIcon className="dashboard-add-icon" />
                            </div>
                        </div>
                    </PermissionControlHidden>
                </Toolbar>
                <div className="ms-tab-content">{tabContent}</div>
            </div>
            {showAdd && <AddDashboard onCancel={handleCloseAdd} onOk={handleAdd} />}
        </div>
    );
};
