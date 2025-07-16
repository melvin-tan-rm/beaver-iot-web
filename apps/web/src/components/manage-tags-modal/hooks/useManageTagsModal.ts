import { useState } from 'react';
import { useMemoizedFn } from 'ahooks';

import { type ManageTagsProps } from '../index';

/**
 * Operate the manage tags modal
 */
export function useManageTagsModal() {
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
            await new Promise(resolve => {
                setTimeout(() => {
                    resolve(null);
                }, 1000);
            });

            console.log('manageTagsFormSubmit data ? ', data, selectedEntities);
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
