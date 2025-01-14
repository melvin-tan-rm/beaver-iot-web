import { useCallback, useMemo } from 'react';
import { useI18n } from '@milesight/shared/src/hooks';
import { DEFAULT_DEVICE_LABEL_KEY } from '../constant';
import type {
    EntitySelectInnerProps,
    EntitySelectComponentProps,
    EntitySelectValueType,
    SelectedParameterType,
    EntitySelectOption,
    EntitySelectProps,
    EntityValueType,
} from '../types';

interface IProps<
    V extends EntitySelectValueType = EntitySelectValueType,
    M extends boolean | undefined = false,
    D extends boolean | undefined = false,
> extends Pick<
        EntitySelectComponentProps<V, M, D>,
        'value' | 'multiple' | 'onChange' | 'getOptionValue' | 'onSearch'
    > {
    entityOptionMap: Map<EntityValueType, EntitySelectOption<EntityValueType>>;
}
export const useSelectValue = <
    V extends EntitySelectValueType = EntitySelectValueType,
    M extends boolean | undefined = false,
    D extends boolean | undefined = false,
>(
    props: IProps<V, M, D>,
): SelectedParameterType => {
    const { getIntlText } = useI18n();
    const { entityOptionMap, value, multiple, onChange, getOptionValue, onSearch } = props;

    const valueList = useMemo<EntityValueType[]>(() => {
        const valueList = (Array.isArray(value) ? value : [value]) as unknown as V[];

        return valueList.map(getOptionValue);
    }, [getOptionValue, value]);

    /** selected Value to entity map */
    const selectedEntityMap = useMemo(() => {
        if (!valueList?.length)
            return new Map<EntityValueType, EntitySelectOption<EntityValueType>>();

        return valueList.reduce<Map<EntityValueType, EntitySelectOption<EntityValueType>>>(
            (acc, curr) => {
                const option = entityOptionMap.get(curr);
                if (!option) return acc;

                acc.set(curr, option);
                return acc;
            },
            new Map(),
        );
    }, [entityOptionMap, valueList]);

    /** selected device to entity map */
    const selectedDeviceMap = useMemo(() => {
        if (!valueList?.length) return new Map<string, EntitySelectOption<EntityValueType>[]>();

        return valueList.reduce<Map<string, EntitySelectOption<EntityValueType>[]>>((acc, curr) => {
            const option = entityOptionMap.get(curr);
            if (!option) return acc;

            const { rawData } = option || {};
            const { deviceName = getIntlText(DEFAULT_DEVICE_LABEL_KEY) } = rawData || {};

            const deviceList = acc.get(deviceName) || [];
            deviceList.push(option);
            acc.set(deviceName, deviceList);
            return acc;
        }, new Map());
    }, [entityOptionMap, getIntlText, valueList]);

    /** Select/cancel entity selection callback */
    const onEntityChange = useCallback<EntitySelectInnerProps<V, M, D>['onEntityChange']>(
        selectedItem => {
            const { value } = selectedItem || {};
            if (!value) return;

            // When elected, clear the search content
            onSearch?.('');

            if (!multiple) {
                const onSingleChange = onChange as EntitySelectProps<V, false, D>['onChange'];
                // single select
                onSingleChange?.(selectedItem);
                return;
            }

            const realValue = value;
            // multiple select
            if (selectedEntityMap.has(realValue)) {
                selectedEntityMap.delete(realValue);
            } else {
                selectedEntityMap.set(realValue, selectedItem!);
            }
            const onMultipleChange = onChange as EntitySelectProps<V, true, D>['onChange'];
            onMultipleChange?.(Array.from(selectedEntityMap.values()));
        },
        [multiple, onChange, onSearch, selectedEntityMap],
    );

    return {
        selectedEntityMap,
        selectedDeviceMap,
        onEntityChange,
    };
};
