import React, { useMemo } from 'react';
import classNames from 'classnames';
import { useMemoizedFn } from 'ahooks';

import { LoadingWrapper } from '@milesight/shared/src/components';

import { Header, Body, OperateGroupModal } from './components';
import { MORE_OPERATION } from './components/more-dropdown';
import type { DeviceGroupItemType } from './components/body/hooks/useBody';
import { useDeviceGroup, useGroupModal } from './hooks';

import './style.less';

export interface DeviceGroupProps {
    isShrink: boolean;
}

const DeviceGroup: React.FC<DeviceGroupProps> = props => {
    const { isShrink } = props;

    const { getDeviceGroups, deviceGroups, loading, handleGroupDelete } = useDeviceGroup();

    const {
        groupModalVisible,
        groupModalTitle,
        currentGroup,
        addGroupModal,
        hiddenGroupModal,
        onFormSubmit,
        editGroupModal,
    } = useGroupModal(getDeviceGroups);

    const handleGroupOperation = useMemoizedFn(
        (type: MORE_OPERATION, record: DeviceGroupItemType) => {
            if (type === MORE_OPERATION.RENAME) {
                editGroupModal?.(record);
            }

            if (type === MORE_OPERATION.DELETE) {
                handleGroupDelete?.(record);
            }
        },
    );

    const groupCls = useMemo(() => {
        return classNames('ms-device-group', {
            shrink: isShrink,
        });
    }, [isShrink]);

    const renderDeviceGroupBody = () => {
        if (!Array.isArray(deviceGroups) || loading) {
            return <LoadingWrapper loading wrapperClassName="ms-device-group__loading-wrapper" />;
        }

        return <Body deviceGroups={deviceGroups} onOperation={handleGroupOperation} />;
    };

    return (
        <div className={groupCls}>
            <Header onSearch={getDeviceGroups} onAdd={addGroupModal} />
            {renderDeviceGroupBody()}
            {groupModalVisible && (
                <OperateGroupModal
                    visible={groupModalVisible}
                    title={groupModalTitle}
                    data={currentGroup?.name}
                    onCancel={hiddenGroupModal}
                    onFormSubmit={onFormSubmit}
                />
            )}
        </div>
    );
};

export default DeviceGroup;
