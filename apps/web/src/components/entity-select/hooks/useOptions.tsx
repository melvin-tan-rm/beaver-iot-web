import { useCallback, useMemo } from 'react';
import { useI18n } from '@milesight/shared/src/hooks';
import { objectToCamelCase } from '@milesight/shared/src/utils/tools';
// import { safeJsonParse } from '../helper';
import type {
    EntitySelectComponentProps,
    EntitySelectOption,
    EntitySelectValueType,
    EntityValueType,
    TabType,
} from '../types';

interface IProps<
    Value extends EntitySelectValueType = EntitySelectValueType,
    Multiple extends boolean | undefined = false,
    DisableClearable extends boolean | undefined = false,
> extends Pick<
        EntitySelectComponentProps<Value, Multiple, DisableClearable>,
        'fieldName' | 'filterOption'
    > {
    tabType: TabType;
    entityList: EntityData[];
}
export const useOptions = <
    Value extends EntitySelectValueType = EntitySelectValueType,
    Multiple extends boolean | undefined = false,
    DisableClearable extends boolean | undefined = false,
>({
    tabType,
    entityList,
    fieldName,
    filterOption,
}: IProps<Value, Multiple, DisableClearable>) => {
    const { getIntlText } = useI18n();

    /** Get description text */
    const getDescription = useCallback(
        (entityType: string, entityKey: string, deviceName?: string) => {
            const comma = getIntlText('common.symbol.comma');
            // Extract meaningful part of the entity key
            const entityKeyText = entityKey.split('.').slice(3).join('.');

            // Join entity type, entity key, and device name with commas
            return [entityType, entityKeyText, deviceName].filter(Boolean).join(`${comma} `);
        },
        [getIntlText],
    );

    /** Get value of the option based on entity data */
    const getOptionValue = useCallback(
        (entityData: ObjectToCamelCase<EntityData>) => {
            const {
                deviceName,
                entityId,
                entityName,
                entityType,
                entityKey,
                entityValueType,
                entityValueAttribute: entityValueAttributeString,
            } = entityData || {};

            // // Parse the entity value attribute from JSON string
            // const entityValueAttribute = safeJsonParse(
            //     entityValueAttributeString,
            // ) as EntityValueAttributeType;
            const entityValueAttribute =
                entityValueAttributeString as unknown as EntityValueAttributeType;

            // Create an entity item for the select option
            const entityItem: EntitySelectOption<EntityValueType> = {
                value: fieldName ? entityData[fieldName] : entityId,
                label: entityName,
                valueType: entityValueType,
                description: getDescription(entityType, entityKey, deviceName),
                rawData: {
                    ...entityData,
                    entityValueAttribute,
                },
            };
            return entityItem;
        },
        [fieldName, getDescription],
    );

    const optionList = useMemo(() => {
        const result = (entityList || []).map(entity => {
            // Convert entity data to camel case
            const entityData = objectToCamelCase(entity || {});

            return getOptionValue(entityData);
        });
        return filterOption ? filterOption(result) : result;
    }, [entityList, filterOption, getOptionValue]);

    /** Get entity drop-down options and device drop-down options */
    const { entityOptions, deviceOptions } = useMemo(() => {
        const { entityOptions, deviceMap } = (optionList || []).reduce<{
            deviceMap: Map<string, EntitySelectOption<EntityValueType>>;
            entityOptions: EntitySelectOption<EntityValueType>[];
        }>(
            (prev, entity) => {
                const { entityOptions, deviceMap } = prev;

                const { rawData } = entity || {};
                const { deviceName, entityType, entityKey } = rawData! || {};
                entityOptions.push(entity);

                // Create or update device group
                let deviceGroup = deviceMap.get(deviceName);
                if (!deviceGroup) {
                    deviceGroup = {
                        value: deviceName,
                        label: deviceName,
                        children: [],
                    };
                }
                deviceGroup.children?.push({
                    ...entity,
                    description: getDescription(entityType, entityKey),
                });
                deviceMap.set(deviceName, deviceGroup);

                return {
                    deviceMap,
                    entityOptions,
                };
            },
            {
                deviceMap: new Map<string, EntitySelectOption<EntityValueType>>(),
                entityOptions: [],
            },
        );

        return {
            entityOptions,
            deviceOptions: Array.from(deviceMap.values()),
        };
    }, [optionList, getDescription]);

    /** Get the corresponding drop-down rendering options based on `tabType` */
    const options = useMemo(
        () => (tabType === 'entity' ? entityOptions : deviceOptions),
        [deviceOptions, entityOptions, tabType],
    );

    const entityOptionMap = useMemo(() => {
        return (optionList || []).reduce((acc, option) => {
            const { value } = option;

            acc.set(value, option);
            return acc;
        }, new Map<EntityValueType, EntitySelectOption<EntityValueType>>());
    }, [optionList]);

    return {
        options,
        entityOptionMap,
    };
};
