import React, { useState, useCallback, useMemo } from 'react';
import { Autocomplete, TextField, AutocompleteProps, Chip } from '@mui/material';
import Tooltip from '@/components/tooltip';
import { EntityList, EntityPaper, EntityPopper } from './components';
import type { EntitySelectInnerProps, EntitySelectValueType } from './types';

/**
 * EntitySelect Component
 */
const EntitySelect = <
    Value extends EntitySelectValueType = EntitySelectValueType,
    Multiple extends boolean | undefined = false,
    DisableClearable extends boolean | undefined = false,
    EntityAutocompleteProps extends Required<
        AutocompleteProps<Value, Multiple, DisableClearable, false>
    > = Required<AutocompleteProps<Value, Multiple, DisableClearable, false>>,
>(
    props: EntitySelectInnerProps<Value, Multiple, DisableClearable>,
) => {
    const {
        label,
        required,
        value,
        multiple,
        loading,
        onChange,
        onOpen,
        onClose,
        onInputChange,
        onSearch,
        error,
        helperText,
        placeholder,
        tabType,
        setTabType,
        popperWidth,
        options,
        selectedEntityMap,
        selectedDeviceMap,
        maxCount,
        onEntityChange,
        ...rest
    } = props;

    // State to manage the open/close status of the select menu
    const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
    const open = Boolean(anchorEl);

    /**
     * Handles opening of the select menu.
     */
    const handleSelectOpen = useCallback<Required<EntityAutocompleteProps>['onOpen']>(
        event => {
            setAnchorEl(event.currentTarget as HTMLDivElement);
            onOpen?.(event);
        },
        [onOpen],
    );

    /**
     * Handles closing of the select menu.
     */
    const handleSelectClose = useCallback<Required<EntityAutocompleteProps>['onClose']>(
        (...params) => {
            setAnchorEl(null);
            onClose?.(...params);
        },
        [onClose],
    );

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
     * Handles the input change event.
     */
    const handleInputChange = useCallback<EntityAutocompleteProps['onInputChange']>(
        (event, value, reason) => {
            onSearch?.(reason === 'input' ? value : '');

            onInputChange?.(event, value, reason);
        },
        [onInputChange, onSearch],
    );

    /**
     * Renders the input component for the Autocomplete.
     */
    const renderInput = useCallback<EntityAutocompleteProps['renderInput']>(
        params => (
            <TextField
                {...params}
                error={error}
                helperText={helperText}
                label={label}
                required={required}
                placeholder={placeholder}
            />
        ),
        [error, helperText, label, required, placeholder],
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

    const filterOptions = useCallback<EntityAutocompleteProps['filterOptions']>(
        options => options,
        [],
    );

    // Memoize custom slots and slot props to optimize rendering
    const slotProps = useMemo(
        () => ({
            listbox: {
                component: EntityList,
                tabType,
                options,
                maxCount,
                selectedEntityMap,
                selectedDeviceMap,
                onEntityChange,
            },
            paper: { component: EntityPaper, tabType, setTabType },
            popper: { component: EntityPopper, popperWidth },
        }),
        [
            popperWidth,
            setTabType,
            tabType,
            options,
            selectedEntityMap,
            selectedDeviceMap,
            maxCount,
            onEntityChange,
        ],
    );
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
            onInputChange={handleInputChange}
            getOptionLabel={getOptionLabel}
            renderTags={renderTags}
            renderInput={renderInput}
            slotProps={slotProps}
            loading={loading}
            filterOptions={filterOptions}
        />
    );
};
export default React.memo(EntitySelect) as unknown as typeof EntitySelect;
