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

    const manageTagsFormSubmit = useMemoizedFn(
        async (data: ManageTagsProps, callback: () => void) => {
            const newTags: ApiKey[] = [];
            const removeTags: ApiKey[] = [];
            const entityIds = (selectedEntities || [])
                .map(entity => entity.entityId)
                .filter(Boolean);

            const { tags, originalTag, replaceTag, action } = data || {};
            if (action === TagOperationEnums.REPLACE && originalTag && replaceTag) {
                newTags.push(originalTag);
                removeTags.push(replaceTag);
            } else if (Array.isArray(tags) && !isEmpty(tags)) {
                newTags.push(...tags);
            }

            if (
                !action ||
                !Array.isArray(newTags) ||
                isEmpty(newTags) ||
                !Array.isArray(entityIds) ||
                isEmpty(entityIds)
            ) {
                return;
            }

            const [error, resp] = await awaitWrap(
                tagAPI.updateEntitiesTags({
                    operation: action,
                    added_tag_ids: newTags,
                    removed_tag_ids:
                        Array.isArray(removeTags) && !isEmpty(removeTags) ? removeTags : undefined,
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
