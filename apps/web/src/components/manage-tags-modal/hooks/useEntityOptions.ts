import { useMemo } from 'react';
import { isEmpty } from 'lodash-es';

export function useEntityOptions(selectedEntities?: ObjectToCamelCase<EntityData>[]) {
    const entityOptions: TagProps[] = useMemo(() => {
        if (!Array.isArray(selectedEntities) || isEmpty(selectedEntities)) {
            return [];
        }

        const newTags: Map<ApiKey, TagProps> = new Map();
        selectedEntities.forEach(entity => {
            (entity?.entityTags || []).forEach(tag => {
                if (tag?.id && !newTags.has(tag.id)) {
                    newTags.set(tag.id, tag);
                }
            });
        });

        return Array.from(newTags.values());
    }, [selectedEntities]);

    return {
        entityOptions,
    };
}
