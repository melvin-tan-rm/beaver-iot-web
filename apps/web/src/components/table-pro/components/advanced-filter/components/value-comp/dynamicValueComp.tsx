import { useMemo } from 'react';
import { ValueCompType } from '../../../../types';
import { ValueComponentSlotProps, ValueCompBaseProps, FilterValueType } from './types';
import { useValueComp } from './hooks';

export interface DynamicValueCompProps<T extends FilterValueType> extends ValueCompBaseProps<T> {
    column: string;
    valueCompType: ValueCompType;
    /**
     * The attribute slots corresponding to the value component (Autocomplete, Textfield, ColumnType.field as key)
     */
    compSlotProps?: ValueComponentSlotProps;
}

const DEFAULT_COMP_PROPS = {
    baseSelect: {
        multiple: true,
        clearOnEscape: false,
        disableCloseOnSelect: true,
    },
};

/**
 * Value selection component for advancedFilter
 */
const DynamicValueComp = <T extends FilterValueType>({
    column,
    valueCompType,
    compSlotProps,
    ...rest
}: DynamicValueCompProps<T>) => {
    const { renderValueComponent } = useValueComp<T>();

    const slotProps = useMemo(() => {
        const componentType = `base${valueCompType.replace(/^./, c => c.toUpperCase())}`;
        return {
            ...(compSlotProps?.[componentType] ||
                DEFAULT_COMP_PROPS[componentType as keyof ValueComponentSlotProps] ||
                {}),
            ...(compSlotProps?.[column] || {}),
        };
    }, [compSlotProps, valueCompType, column]);

    return renderValueComponent(valueCompType, rest, slotProps);
};

export default DynamicValueComp;
