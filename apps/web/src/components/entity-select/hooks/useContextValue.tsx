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
    props: Pick<EntitySelectProps<V, M, D>, 'value' | 'multiple' | 'onChange'>,
) => {
    const { value, multiple, onChange } = props;

    const [tabType, setTabType] = useState<TabType>('entity');
    const { options } = useOptions({ tabType });
    const { selectedEntityMap, onEntityChange } = useSelectValue<V, M, D>({
        value,
        multiple,
        onChange,
    });

    /** context value */
    const contextValue = useMemo(() => {
        const result: EntitySelectContext<V> = {
            options: (options as V[]) || [],
            tabType,
            setTabType,
            selectedEntityMap,
            onEntityChange,
        };

        return result;
    }, [onEntityChange, options, selectedEntityMap, tabType]);

    return {
        contextValue,
    };
};
