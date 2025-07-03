import { useState } from 'react';
import { useMemoizedFn } from 'ahooks';

import { useI18n } from '@milesight/shared/src/hooks';
import { toast } from '@milesight/shared/src/components';

import { type OperateGroupProps } from '../components/operate-group-modal';
import { type DeviceGroupItemType } from '../components/body/hooks/useBody';

export type OperateModalType = 'add' | 'edit';

export function useGroupModal(getAllGroups?: () => void) {
    const { getIntlText } = useI18n();

    const [groupModalVisible, setGroupModalVisible] = useState(false);
    const [groupModalTitle, setGroupModalTitle] = useState(
        getIntlText('device.label.add_device_group'),
    );
    const [operateType, setOperateType] = useState<OperateModalType>('add');
    const [currentGroup, setCurrentGroup] = useState<DeviceGroupItemType>();

    const hiddenGroupModal = useMemoizedFn(() => {
        setGroupModalVisible(false);
    });

    const addGroupModal = useMemoizedFn(() => {
        setGroupModalVisible(true);
        setGroupModalTitle(getIntlText('device.label.add_device_group'));
        setOperateType('add');
        setCurrentGroup(undefined);
    });

    const editGroupModal = useMemoizedFn((record?: DeviceGroupItemType) => {
        setGroupModalVisible(true);
        setGroupModalTitle(getIntlText('device.label.edit_device_group'));
        setOperateType('edit');
        setCurrentGroup(record);
    });

    const handleAddModel = useMemoizedFn(async (data: OperateGroupProps, callback: () => void) => {
        console.log('handleAddModel ? ', data);

        await new Promise(resolve => {
            setTimeout(() => {
                resolve(null);
            }, 2000);
        });

        getAllGroups?.();
        setGroupModalVisible(false);
        toast.success(getIntlText('common.message.add_success'));
        callback?.();
    });

    const handleEditModel = useMemoizedFn(async (data: OperateGroupProps, callback: () => void) => {
        console.log('handleEditModel ? ', data, currentGroup);

        await new Promise(resolve => {
            setTimeout(() => {
                resolve(null);
            }, 2000);
        });

        getAllGroups?.();
        setGroupModalVisible(false);
        toast.success(getIntlText('common.message.operation_success'));
        callback?.();
    });

    const onFormSubmit = useMemoizedFn(async (data: OperateGroupProps, callback: () => void) => {
        if (!data) return;

        if (operateType === 'add') {
            await handleAddModel(data, callback);
            return;
        }

        await handleEditModel(data, callback);
    });

    return {
        groupModalVisible,
        groupModalTitle,
        currentGroup,
        addGroupModal,
        editGroupModal,
        hiddenGroupModal,
        onFormSubmit,
    };
}
