import type { AutocompleteProps, TextFieldProps } from '@mui/material';

/** Define the possible tab types */
export type TabType = 'entity' | 'device';

/** Define the possible value types for entities */
export type EntityValueType = ApiKey;

/**
 * Represents an option in the EntitySelect component.
 */
export interface EntitySelectOption<T extends EntityValueType = EntityValueType> {
    /** The value of the option */
    value: T;
    /** The display label of the option */
    label: string;
    /** Optional value type */
    valueType?: string;
    /** Optional description of the option */
    description?: string;
    /** Additional raw data associated with the option */
    rawData?: ObjectToCamelCase<Omit<EntityData, 'entity_value_attribute'>> & {
        entityValueAttribute: EntityValueAttributeType;
    };
    /** Optional children options for hierarchical selection */
    children?: EntitySelectOption<T>[];
}

export type EntitySelectValueType = EntitySelectOption<EntityValueType>;

/**
 * Type to represent the value of the EntitySelect component based on its configuration.
 */
export type EntitySelectValue<Value, Multiple, DisableClearable> = Multiple extends true
    ? Array<Value>
    : DisableClearable extends true
      ? NonNullable<Value>
      : Value | null;

/**
 * Props for the EntitySelect component.
 */
export interface EntitySelectProps<
    Value extends EntitySelectValueType = EntitySelectValueType,
    Multiple extends boolean | undefined = false,
    DisableClearable extends boolean | undefined = false,
> extends Pick<TextFieldProps, 'title' | 'required'>,
        Omit<
            AutocompleteProps<Value, Multiple, DisableClearable, false>,
            'renderInput' | 'options'
        > {
    /** Whether multiple selection is enabled */
    multiple?: Multiple;
    /** The current value of the select */
    value?: EntitySelectValue<Value, Multiple, DisableClearable>;
    /** Callback function when the value changes */
    onChange?: (value: EntitySelectValue<Value, Multiple, DisableClearable>) => void;
    /** Whether the clear button is disabled */
    disableClearable?: DisableClearable;
    /**
     * maximum number of items that can be selected
     * @default 5
     * @description This prop is only used when `multiple` is true
     */
    maxCount?: Multiple extends true ? number : never;
}

/**
 * Context for the EntitySelect component.
 */
export interface EntitySelectContext<V extends EntitySelectValueType = EntitySelectValueType> {
    /**
     * maximum number of items that can be selected
     * @default 5
     * @description This prop is only used when `multiple` is true
     */
    maxCount?: number;
    /** Available options for selection */
    options: V[];
    /** The current tab type */
    tabType: TabType;
    /** Function to set the tab type */
    setTabType: (tabType: TabType) => void;
    /** The map of selected entities */
    selectedEntityMap: Map<V['value'], V>;
    /** Callback function when an entity is selected or changed */
    onEntityChange: (selectedItem: EntitySelectValue<Value, Multiple, DisableClearable>) => void;
}
