import React, { useState, useContext, useCallback, useMemo } from 'react';
import { Autocomplete, TextField, AutocompleteProps, Chip } from '@mui/material';
import Tooltip from '@/components/tooltip';
import { EntityList, EntityPaper } from './components';
import { EntityContext } from './context';
import type { EntitySelectContext, EntitySelectProps, EntitySelectValueType } from './types';

/**
 * EntitySelect Component
 */
const EntitySelect = <
    Value extends EntitySelectValueType = EntitySelectValueType,
    Multiple extends boolean | undefined = false,
    DisableClearable extends boolean | undefined = false,
    Props extends EntitySelectProps<Value, Multiple, DisableClearable> = EntitySelectProps<
        Value,
        Multiple,
        DisableClearable
    >,
    EntityAutocompleteProps extends Required<
        AutocompleteProps<Value, Multiple, DisableClearable, false>
    > = Required<AutocompleteProps<Value, Multiple, DisableClearable, false>>,
>(
    props: Props,
) => {
    const { title, required, value, multiple, onChange, ...rest } = props;
    const { options } = useContext<EntitySelectContext<Value>>(
        EntityContext as unknown as React.Context<EntitySelectContext<Value>>,
    );

    // State to manage the open/close status of the select menu
    const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
    const open = Boolean(anchorEl);

    /**
     * Handles opening of the select menu.
     */
    const handleSelectOpen = useCallback<Required<EntityAutocompleteProps>['onOpen']>(event => {
        setAnchorEl(event.currentTarget as HTMLDivElement);
    }, []);

    /**
     * Handles closing of the select menu.
     */
    const handleSelectClose = useCallback<Required<EntityAutocompleteProps>['onClose']>(() => {
        setAnchorEl(null);
    }, []);

    /**
     * Handles the change event when an option is selected or cleared.
     */
    const handleChange = useCallback<EntityAutocompleteProps['onChange']>(
        (_event, value) => {
            onChange?.(value);
        },
        [onChange],
    );

    /**
     * Renders the input component for the Autocomplete.
     */
    const renderInput = useCallback<EntityAutocompleteProps['renderInput']>(
        params => <TextField {...params} title={title} required={required} />,
        [required, title],
    );

    /**
     * Renders the tags for the selected values when multiple selection is enabled.
     */
    const renderTags = useCallback<EntityAutocompleteProps['renderTags']>(
        (value, getTagProps) => {
            if (!multiple) return;

            return value.map((option, index) => {
                const { key, ...tagProps } = getTagProps({ index });

                return (
                    <Tooltip key={key} title={option.description}>
                        <Chip label={option.label} {...tagProps} />
                    </Tooltip>
                );
            });
        },
        [multiple],
    );

    /**
     * Gets the display text for the input box based on the selected option.
     */
    const getOptionLabel = useCallback<EntityAutocompleteProps['getOptionLabel']>(
        option => option?.label || '',
        [],
    );

    // Memoize custom slots and slot props to optimize rendering
    const slots = useMemo(() => ({ paper: EntityPaper }), []);
    const slotProps = useMemo(() => ({ listbox: { component: EntityList } }), []);

    return (
        <Autocomplete<Value, Multiple, DisableClearable, false>
            {...rest}
            open={open}
            value={value}
            options={options}
            multiple={multiple}
            onChange={handleChange}
            onOpen={handleSelectOpen}
            onClose={handleSelectClose}
            getOptionLabel={getOptionLabel}
            renderTags={renderTags}
            renderInput={renderInput}
            slots={slots}
            slotProps={slotProps}
        />
    );
};
export default React.memo(EntitySelect) as unknown as typeof EntitySelect;
