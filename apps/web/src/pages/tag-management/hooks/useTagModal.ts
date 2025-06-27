import { useState } from 'react';
import { useMemoizedFn } from 'ahooks';

import { useI18n } from '@milesight/shared/src/hooks';
import { toast } from '@milesight/shared/src/components';

import {
    tagAPI,
    awaitWrap,
    isRequestSuccess,
    getResponseData,
    type TagItemProps,
} from '@/services/http';
import { type OperateTagProps, type OperateModalType } from '../components/operate-tag-modal';
import { type TableRowDataType } from './useColumns';

export default function useTagModal(getAllTags?: () => void) {
    const { getIntlText } = useI18n();

    const [tagModalVisible, setTagModalVisible] = useState(false);
    const [operateType, setOperateType] = useState<OperateModalType>('add');
    const [modalTitle, setModalTitle] = useState(getIntlText('tag.title.add_tag'));
    const [currentTag, setCurrentTag] = useState<TableRowDataType>();

    const hideModal = useMemoizedFn(() => {
        setTagModalVisible(false);
    });

    const openAddTag = useMemoizedFn(() => {
        setOperateType('add');
        setModalTitle(getIntlText('tag.title.add_tag'));
        setTagModalVisible(true);
    });

    const openEditTag = useMemoizedFn((item: TableRowDataType) => {
        setOperateType('edit');
        setModalTitle(getIntlText('tag.title.edit_tag'));
        setTagModalVisible(true);
        setCurrentTag(item);
    });

    const handleAddTag = useMemoizedFn(async (data: OperateTagProps, callback: () => void) => {
        console.log('handleAddTag ? ', data);

        await new Promise(resolve => {
            setTimeout(() => {
                resolve(true);
            }, 1000);
        });

        getAllTags?.();
        setTagModalVisible(false);
        toast.success(getIntlText('common.message.add_success'));
        callback?.();
    });

    const handleEditTag = useMemoizedFn(async (data: OperateTagProps, callback: () => void) => {
        console.log('handleEditTag ? ', data);

        await new Promise(resolve => {
            setTimeout(() => {
                resolve(true);
            }, 1000);
        });

        getAllTags?.();
        setTagModalVisible(false);
        toast.success(getIntlText('common.message.operation_success'));
        callback?.();
    });

    const onFormSubmit = useMemoizedFn(async (data: OperateTagProps, callback: () => void) => {
        if (!data) return;

        if (operateType === 'add') {
            await handleAddTag(data, callback);
            return;
        }

        await handleEditTag(data, callback);
    });

    return {
        tagModalVisible,
        modalTitle,
        currentTag,
        operateType,
        hideModal,
        openAddTag,
        openEditTag,
        onFormSubmit,
    };
}
