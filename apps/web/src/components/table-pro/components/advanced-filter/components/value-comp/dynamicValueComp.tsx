import { useMemo } from 'react';
import { ValueCompType } from '../../../../types';
import { ValueComponentSlotProps, ValueCompBaseProps } from './types';
import useValueComp from './useValueComp';

export interface DynamicValueCompProps<T extends ApiKey | ApiKey[]> extends ValueCompBaseProps<T> {
    column: string;
    valueCompType: ValueCompType;
    /**
     * The attribute slots corresponding to the value component (Autocomplete, Textfield, ColumnType.field as key)
     */
    compSlotProps?: ValueComponentSlotProps;
}

/**
 * Value selection component for advancedFilter
 */
const DynamicValueComp = <T extends ApiKey | ApiKey[]>({
    column,
    valueCompType,
    compSlotProps,
    ...rest
}: DynamicValueCompProps<T>) => {
    const { renderValueComponent } = useValueComp<T>();

    const slotProps = useMemo(
        () => ({
            ...(compSlotProps?.[`base${valueCompType.replace(/^./, c => c.toUpperCase())}`] || {}),
            ...(compSlotProps?.[column] || {}),
        }),
        [compSlotProps, valueCompType, column],
    );

    return renderValueComponent(valueCompType, rest, slotProps);
};

export default DynamicValueComp;
