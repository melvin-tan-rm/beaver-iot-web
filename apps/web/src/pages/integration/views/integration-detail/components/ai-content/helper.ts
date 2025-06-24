import { cloneDeep } from 'lodash-es';
import { InteEntityType } from '../../hooks';
import { AI_SERVICE_KEYWORD } from './constants';

type InteServiceType = InteEntityType & {
    children?: InteServiceType[];
};

export const entitiesCompose = (entities?: InteEntityType[], excludeKeys?: ApiKey[]) => {
    const services = entities?.filter(item => {
        return (
            item.type === 'SERVICE' && !excludeKeys?.some(key => `${item.key}`.includes(`${key}`))
        );
    });
    const result: InteServiceType[] = cloneDeep(services || []);

    // TODO: Multi-level (>2) service parameter processing
    result?.forEach(item => {
        if (!item.parent) return;

        const service = result.find(it => it.key === item.parent);

        if (!service) return;
        service.children = service.children || [];
        service.children.push(item);
    });

    /**
     * If the sub entity is empty, and the entity value type is not BINARY, ENUM, or OBJECT,
     * use the entity itself as the sub entity.
     */
    result.forEach(item => {
        if (
            item.parent ||
            item.children?.length ||
            (['BINARY', 'ENUM', 'OBJECT'] as EntityValueDataType[]).includes(item.valueType)
        ) {
            return;
        }
        item.children = item.children || [];
        item.children.push(item);
    });

    return result.filter(item => !item.parent);
};

/**
 * Get AI model ID form service entity key
 */
export const getModelId = (key: ApiKey) => {
    return `${key}`.split('.').pop()?.replace(`${AI_SERVICE_KEYWORD}`, '');
};
