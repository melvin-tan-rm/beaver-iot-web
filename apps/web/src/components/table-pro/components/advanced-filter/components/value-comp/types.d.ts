import { AutocompleteProps, SelectProps, TextFieldProps } from '@mui/material';

export type OperatorValuesType = {
    label: string;
    value: ApiKey;
}[];

export interface TextFieldPropsOverrides<T> extends Omit<TextFieldProps, 'onChange'> {
    onChange: (value: T) => void;
}

export interface AutocompletePropsOverrides<T> extends Omit<AutocompleteProps, 'onChange'> {
    onChange: (value: T) => void;
}

/**
 * Value components base props
 */
export interface ValueCompBaseProps<T extends ApiKey | ApiKey[]>
    extends Pick<TextFieldProps, 'label' | 'size' | 'sx' | 'disabled' | 'fullWidth'> {
    value: T;
    onChange: (value: T) => void;
    /**
     * The optional list for selection
     */
    options?: OperatorValuesType;
}

/**
 * All component types used for advanced filtering values
 */
export type BaseComponentProps = AutocompletePropsOverrides<
    Value,
    Multiple,
    DisableClearable,
    false
> &
    TextFieldPropsOverrides;

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
