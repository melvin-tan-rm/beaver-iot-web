import { useCallback, useMemo } from 'react';
import { useI18n } from '@milesight/shared/src/hooks';
import { objectToCamelCase } from '@milesight/shared/src/utils/tools';
import { safeJsonParse } from '../helper';
import type { EntitySelectOption, TabType } from '../types';

interface IProps {
    tabType: TabType;
    entityList: EntityData[];
}
export const useOptions = ({ tabType, entityList }: IProps) => {
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

            // Parse the entity value attribute from JSON string
            const entityValueAttribute = safeJsonParse(
                entityValueAttributeString,
            ) as EntityValueAttributeType;

            // Create an entity item for the select option
            const entityItem: EntitySelectOption = {
                value: entityId,
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
        [getDescription],
    );

    /** Get entity drop-down options and device drop-down options */
    const { entityOptions, deviceOptions } = useMemo(() => {
        const { entityOptions, deviceMap } = (entityList || []).reduce<{
            deviceMap: Map<string, EntitySelectOption>;
            entityOptions: EntitySelectOption[];
        }>(
            (prev, entity) => {
                const { entityOptions, deviceMap } = prev;

                // Convert entity data to camel case
                const entityData = objectToCamelCase(entity || {});
                const { deviceName, entityType, entityKey } = entityData || {};
                const entityItem = getOptionValue(entityData);
                entityOptions.push(entityItem);

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
                    ...entityItem,
                    description: getDescription(entityType, entityKey),
                });
                deviceMap.set(deviceName, deviceGroup);

                return {
                    deviceMap,
                    entityOptions,
                };
            },
            {
                deviceMap: new Map<string, EntitySelectOption>(),
                entityOptions: [],
            },
        );

        return {
            entityOptions,
            deviceOptions: Array.from(deviceMap.values()),
        };
    }, [entityList, getDescription, getOptionValue]);

    /** Get the corresponding drop-down rendering options based on `tabType` */
    const options = useMemo(
        () => (tabType === 'entity' ? entityOptions : deviceOptions),
        [deviceOptions, entityOptions, tabType],
    );

    return {
        options,
    };
};
