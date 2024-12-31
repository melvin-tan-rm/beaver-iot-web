import { useCallback, useMemo } from 'react';
import type { EntitySelectContext, EntitySelectProps, EntitySelectValueType } from '../types';

export const useSelectValue = <
    V extends EntitySelectValueType = EntitySelectValueType,
    M extends boolean | undefined = false,
    D extends boolean | undefined = false,
>(
    props: Pick<EntitySelectProps<V, M, D>, 'value' | 'multiple' | 'onChange'>,
) => {
    const { value, multiple, onChange } = props;

    /** selected Value to entity map */
    const selectedEntityMap = useMemo(() => {
        if (!value) return new Map<V['value'], V>();

        const valueList: V[] = Array.isArray(value) ? value : ([value] as unknown as V[]);
        return valueList.reduce<Map<V['value'], V>>((acc, curr) => {
            acc.set(curr.value, curr);
            return acc;
        }, new Map());
    }, [value]);

    /** selected device to entity map */
    const selectedDeviceMap = useMemo(() => {
        if (!value) return new Map<string, V[]>();

        const valueList: V[] = Array.isArray(value) ? value : ([value] as unknown as V[]);
        return valueList.reduce<Map<string, V[]>>((acc, curr) => {
            const { rawData } = curr || {};
            const { deviceName = '' } = rawData || {};

            const deviceList = acc.get(deviceName) || [];
            deviceList.push(curr);
            acc.set(deviceName, deviceList);
            return acc;
        }, new Map());
    }, [value]);

    /** Select/cancel entity selection callback */
    const onEntityChange = useCallback<EntitySelectContext['onEntityChange']>(
        selectedItem => {
            const { value } = selectedItem || {};
            if (!value) return;

            if (!multiple) {
                // single select
                onChange?.(selectedItem);
                return;
            }

            // multiple select
            if (selectedEntityMap.has(value)) {
                selectedEntityMap.delete(value);
            } else {
                selectedEntityMap.set(value, selectedItem!);
            }
            const onMultipleChange = onChange as EntitySelectProps<V, true, D>['onChange'];
            onMultipleChange?.(Array.from(selectedEntityMap.values()));
        },
        [multiple, onChange, selectedEntityMap],
    );

    return {
        selectedEntityMap,
        selectedDeviceMap,
        onEntityChange,
    };
};
