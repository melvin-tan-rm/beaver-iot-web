import { useState, useEffect } from 'react';
import { isEmpty, isNil } from 'lodash-es';
import { Tabs, Tab, Toolbar, CircularProgress } from '@mui/material';
import { AddIcon, toast } from '@milesight/shared/src/components';
import { useI18n, usePreventLeave } from '@milesight/shared/src/hooks';
import { dashboardAPI, awaitWrap, isRequestSuccess, getResponseData } from '@/services/http';
import { DashboardDetail } from '@/services/http/dashboard';
import { TabPanel, useConfirm, PermissionControlHidden, Empty } from '@/components';
import { PERMISSIONS } from '@/constants';
import DashboardContent from './components/dashboard-content';
import AddDashboard from './components/add-dashboard';
import './style.less';

export default () => {
    const { getIntlText } = useI18n();
    const confirm = useConfirm();
    const [tabs, setTabs] = useState<DashboardDetail[]>([]);
    const [tabKey, setTabKey] = useState<ApiKey>();
    const [showAdd, setShowAdd] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [loading, setLoading] = useState<boolean>();

    const { showPrevent } = usePreventLeave({
        confirm,
        isPreventLeave: isEdit,
    });

    const getDashboards = async () => {
        try {
            setLoading(true);

            const [_, res] = await awaitWrap(dashboardAPI.getDashboards());
            if (isRequestSuccess(res)) {
                const data = getResponseData(res);
                setTabs(data || []);
                // 没有选择则默认选中第一个
                if (!tabKey) {
                    setTabKey(data?.[0]?.dashboard_id || '');
                } else {
                    // 已选中判断当前选中是否还存在，不存在默认选中第一个
                    const isExist = data?.some(
                        (item: DashboardDetail) => item.dashboard_id === tabKey,
                    );
                    if (!isExist) {
                        setTabKey(data?.[0]?.dashboard_id || '');
                    }
                }
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getDashboards();
    }, []);

    // 切换dashboard页签
    const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
        // 判断是否编辑状态并阻止跳转
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

    // 显示新增dashboard弹框
    const showAddDashboard = () => {
        setShowAdd(true);
    };

    const handleCloseAdd = () => {
        setShowAdd(false);
    };

    // 添加dashboard
    const handleAdd = async (data: DashboardDetail) => {
        const [_, res] = await awaitWrap(dashboardAPI.addDashboard(data));
        if (isRequestSuccess(res)) {
            const resData: any = getResponseData(res);
            setTabs([...tabs, { ...data, dashboard_id: resData.dashboard_id, widgets: [] }]);
            setShowAdd(false);
            toast.success(getIntlText('common.message.operation_success'));
            // 如果是新增的dashboard弹出提示是否要切换到新的tab页
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

    const renderTabContent = () => {
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
                    />
                </TabPanel>
            );
        });
    };

    return (
        <div className="ms-main dashboard">
            <div className="ms-view ms-view-dashboard">
                <Toolbar className="dashboard-toolbar">
                    <Tabs
                        variant="scrollable"
                        scrollButtons="auto"
                        className="ms-tabs"
                        value={tabKey}
                        onChange={handleChange}
                        sx={{
                            '& .MuiTabs-scrollButtons': {
                                '&.Mui-disabled': {
                                    width: 0, // 隐藏禁用的滚动按钮
                                },
                            },
                            '& .MuiTabs-scrollButtons.Mui-disabled': {
                                display: 'none', // 完全隐藏禁用的滚动按钮
                            },
                            '.MuiTabs-flexContainer': {
                                borderBottom: 'none',
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
                        <div className="dashboard-add-contain">
                            <div className="dashboard-add" onClick={showAddDashboard}>
                                <AddIcon className="dashboard-add-icon" />
                            </div>
                        </div>
                    </PermissionControlHidden>
                </Toolbar>
                <div className="ms-tab-content">{renderTabContent()}</div>
            </div>
            {showAdd && <AddDashboard onCancel={handleCloseAdd} onOk={handleAdd} />}
        </div>
    );
};
