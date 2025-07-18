import { useState } from 'react';
import { useMemoizedFn } from 'ahooks';
import { isEmpty } from 'lodash-es';

import { useI18n } from '@milesight/shared/src/hooks';
import { toast } from '@milesight/shared/src/components';

import { tagAPI, awaitWrap, isRequestSuccess, TagOperationEnums } from '@/services/http';
import { type ManageTagsProps } from '../index';

/**
 * Operate the manage tags modal
 */
export function useManageTagsModal(refreshList?: () => void) {
    const { getIntlText } = useI18n();

    const [manageTagsModalVisible, setManageTagsModalVisible] = useState(false);
    const [selectedEntities, setSelectedEntities] = useState<ObjectToCamelCase<EntityData>[]>();

    /**
     * Open Modal
     */
    const openManageTagsModal = useMemoizedFn(() => {
        setManageTagsModalVisible(true);
    });

    /**
     * Close Modal
     */
    const closeManageTagsModal = useMemoizedFn(() => {
        setManageTagsModalVisible(false);
    });

    const openManageTagsModalAtEntity = useMemoizedFn(
        (
            entities?: ObjectToCamelCase<SearchResponseType<EntityData[]>>,
            entityIds?: readonly ApiKey[],
        ) => {
            openManageTagsModal();
            setSelectedEntities(
                (entities?.content || []).filter(e => (entityIds || []).includes(e.entityId)),
            );
        },
    );

    const handleTagsParams = useMemoizedFn((data: ManageTagsProps) => {
        const { tags, originalTag, replaceTag, action } = data || {};
        const result: { newTags?: ApiKey[]; removeTags?: ApiKey[] } = {};

        if (action === TagOperationEnums.REPLACE && originalTag && replaceTag) {
            result.newTags = [replaceTag];
            result.removeTags = [originalTag];
            return result;
        }

        if (!Array.isArray(tags) || isEmpty(tags)) {
            return result;
        }

        if (action === TagOperationEnums.REMOVE) {
            result.removeTags = tags;
            return result;
        }

        result.newTags = tags;
        return result;
    });

    const manageTagsFormSubmit = useMemoizedFn(
        async (data: ManageTagsProps, callback: () => void) => {
            const tags = handleTagsParams(data);
            const entityIds = (selectedEntities || [])
                .map(entity => entity.entityId)
                .filter(Boolean);

            if (
                !data?.action ||
                !Array.isArray(entityIds) ||
                isEmpty(entityIds) ||
                (!tags?.newTags && !tags?.removeTags)
            ) {
                return;
            }

            const [error, resp] = await awaitWrap(
                tagAPI.updateEntitiesTags({
                    operation: data.action,
                    added_tag_ids: tags?.newTags,
                    removed_tag_ids: tags?.removeTags,
                    entity_ids: entityIds,
                }),
            );

            if (error || !isRequestSuccess(resp)) {
                return;
            }

            refreshList?.();
            setManageTagsModalVisible(false);
            toast.success(getIntlText('common.message.operation_success'));
            callback?.();
        },
    );

    return {
        manageTagsModalVisible,
        selectedEntities,
        openManageTagsModal,
        closeManageTagsModal,
        /**
         * Handle manage tags modal form submit function
         */
        manageTagsFormSubmit,
        /**
         * Open manage tags modal at entity data module
         */
        openManageTagsModalAtEntity,
    };
}
