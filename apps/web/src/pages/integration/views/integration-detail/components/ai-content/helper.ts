import { cloneDeep } from 'lodash-es';
import { objectToCamelCase } from '@milesight/shared/src/utils/tools';
import { type AiAPISchema } from '@/services/http';
import { type InteEntityType } from '../../hooks';
import { AI_SERVICE_KEYWORD } from './constants';

type InteServiceType = InteEntityType & {
    children?: InteServiceType[];
};

/**
 * Parent child entity nesting processing
 */
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

/**
 * Transform AI model inputs to entity form items
 */
export const transModelInputs2Entities = (
    inputs?: AiAPISchema['syncModelDetail']['response']['input_entities'],
) => {
    const result: InteEntityType[] = [];

    inputs?.forEach(item => {
        const valueAttribute = objectToCamelCase(item.attributes);

        if (item.attributes?.enum) {
            valueAttribute.enum = item.attributes.enum;
        }

        result.push({
            id: item.full_identifier,
            key: item.key,
            parent: item.parent_key,
            name: item.name,
            description: item.description,
            type: item.type,
            valueType: item.value_type,
            accessMod: item.access_mod,
            valueAttribute,
        });
    });

    return result;
};
