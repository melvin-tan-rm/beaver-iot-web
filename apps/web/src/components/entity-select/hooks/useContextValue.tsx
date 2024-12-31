import { useMemo, useState } from 'react';
import { useOptions } from './useOptions';
import { useSelectValue } from './useSelectValue';
import type {
    TabType,
    EntitySelectContext,
    EntitySelectProps,
    EntitySelectValueType,
} from '../types';

export const useContextValue = <
    V extends EntitySelectValueType = EntitySelectValueType,
    M extends boolean | undefined = false,
    D extends boolean | undefined = false,
>(
    props: Pick<
        EntitySelectProps<V, M, D>,
        'value' | 'multiple' | 'onChange' | 'maxCount' | 'filterOption' | 'popperWidth'
    > & {
        entityList: EntityData[];
    },
) => {
    const { value, multiple, maxCount, entityList, popperWidth, onChange, filterOption } = props;

    const [tabType, setTabType] = useState<TabType>('entity');
    const { options: _options } = useOptions({ tabType, entityList });
    const options = useMemo(
        () => (filterOption ? filterOption(_options) : _options),
        [_options, filterOption],
    );
    const { selectedEntityMap, selectedDeviceMap, onEntityChange } = useSelectValue<V, M, D>({
        value,
        multiple,
        onChange,
    });

    /** context value */
    const contextValue = useMemo(() => {
        const result: EntitySelectContext<V> = {
            popperWidth,
            maxCount,
            options: (options as V[]) || [],
            tabType,
            setTabType,
            selectedEntityMap,
            selectedDeviceMap,
            onEntityChange,
        };

        return result;
    }, [
        popperWidth,
        maxCount,
        onEntityChange,
        options,
        selectedDeviceMap,
        selectedEntityMap,
        tabType,
    ]);

    return {
        contextValue,
    };
};
