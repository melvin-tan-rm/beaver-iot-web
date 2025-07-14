import { AutocompleteProps, SelectProps, TextFieldProps } from '@mui/material';
import { OperatorValueOptionType, FilterValueOptionsType } from '../../../../types';

export type SelectedValueType = OperatorValueOptionType | OperatorValueOptionType[];
/** The type of filter value selected for each column */
export type FilterValueType = ApiKey | SelectedValueType;

export type TextFieldPropsOverrides = Omit<TextFieldProps, 'value' | 'onChange'>;

export type AutocompletePropsOverrides<T> = Omit<
    AutocompleteProps<T>,
    'value' | 'onChange' | 'options'
>;

/**
 * Value components base props
 */
export interface ValueCompBaseProps<T extends FilterValueType>
    extends Pick<TextFieldProps, 'label' | 'size' | 'sx' | 'disabled' | 'fullWidth'> {
    value: T;
    onChange: (value: T) => void;
    /**
     * The optional list for selection
     */
    getFilterValueOptions?: FilterValueOptionsType;
}

/**
 * All component types used for advanced filtering values
 */
export type BaseComponentProps = AutocompletePropsOverrides | TextFieldPropsOverrides;

/**
 * The advanced filtering value component props can be passed to the base component or using the column field
 *  @example
 *  valueComponentSlotProps={{
        baseSelect: AutocompleteProps,
        entityType: {
            multiple: false
        }
    }}
 */
export interface ValueComponentProps {
    baseInput: TextFieldPropsOverrides;
    baseSelect: AutocompletePropsOverrides;
    [x: string]: BaseComponentProps;
}

/**
 * Overridable components props dynamically passed to the component at rendering.
 */
export type ValueComponentSlotProps =
    | Partial<{
          [K in keyof ValueComponentProps]: Partial<ValueComponentProps[K]>;
      }>
    | undefined;

export interface VirtualSelectProps<T extends SelectedValueType>
    extends AutocompletePropsOverrides<T> {
    options: OperatorValueOptionType[];
    onItemChange: (value: T) => void;
}
