import { useCallback, useMemo, useState } from 'react';
import { Autocomplete, Box, TextField } from '@mui/material';
import { isArray, isEqual } from 'lodash-es';
import { useI18n } from '@milesight/shared/src/hooks';
import { SelectValueOptionType } from '../../../../../../types';
import { AutocompletePropsOverrides, ValueCompBaseProps, VirtualSelectProps } from '../../types';
import { useOptions, useSelectedValue } from './hooks';
import { VirtualSelect } from './components';

type IProps<T extends SelectValueOptionType> = AutocompletePropsOverrides & ValueCompBaseProps<T>;

/**
 *  A drop-down selection component for advanced filter
 */
const ValueSelect = <T extends SelectValueOptionType>({
    value,
    onChange,
    multiple = true,
    onOpen,
    onClose,
    onInputChange,
    noOptionsText,
    loadingText,
    placeholder,
    renderOption,
    getFilterValueOptions,
    ...rest
}: IProps<T>) => {
    const { getIntlText } = useI18n();
    const [open, setOpen] = useState<boolean>(false);

    const { options, allOptionsMap, searchLoading, onSearch } = useOptions({
        getFilterValueOptions,
    });

    const { selectedMap, onItemChange } = useSelectedValue({
        value,
        onChange,
        optionsMap: allOptionsMap as VirtualSelectProps<T>['optionsMap'],
        multiple,
    });

    /**
     * Handles opening of the select menu.
     */
    const handleSelectOpen = useCallback(
        async (event: AutocompletePropsOverrides['onOpen']) => {
            setOpen(true);
            onOpen?.(event);
        },
        [onOpen],
    );

    /**
     * Handles closing of the select menu.
     */
    const handleSelectClose = useCallback(
        (...params: AutocompletePropsOverrides['onClose']) => {
            setOpen(false);
            onClose?.(...params);
        },
        [onClose],
    );

    /**
     * Handles the input change event.
     */
    const handleInputChange = useCallback<AutocompletePropsOverrides['onInputChange']>(
        (event: React.SyntheticEvent, value: string, reason: string) => {
            if (reason === 'input') {
                onSearch?.(value);
            }
            if (reason === 'blur' || reason === 'clear') {
                onSearch?.('');
            }
            onInputChange?.(event, value, reason);
        },
        [onInputChange, onSearch],
    );

    const slotProps = useMemo(
        () => ({
            listbox: {
                component: VirtualSelect,
                options,
                selectedMap,
                renderOption,
                onItemChange: (event: React.SyntheticEvent, option: T) => {
                    if (!multiple) {
                        handleSelectClose(event, 'selectOption');
                    }
                    onItemChange(option);
                },
            },
        }),
        [options, selectedMap, multiple, onChange, handleSelectClose],
    );

    return (
        <Autocomplete<T>
            options={options as T[]}
            onChange={(e: React.SyntheticEvent<Element, Event>, value: T | null) => {
                onChange(value as T);
            }}
            multiple={multiple}
            open={open}
            onOpen={handleSelectOpen}
            onClose={handleSelectClose}
            loading={searchLoading}
            isOptionEqualToValue={(option, value) => isEqual(option, value)}
            getOptionLabel={(option: SelectValueOptionType) => option.label}
            onInputChange={handleInputChange}
            renderInput={params => {
                return (
                    <TextField
                        {...params}
                        InputProps={{
                            ...params.InputProps,
                        }}
                        sx={{ minWidth: '225px' }}
                        placeholder={
                            (isArray(value) ? value : [value]).length
                                ? ''
                                : placeholder || getIntlText('common.placeholder.select')
                        }
                    />
                );
            }}
            renderTags={value => {
                return getIntlText('common.label.item_selected', { 1: value.length });
            }}
            noOptionsText={
                noOptionsText || (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: '10px 8px',
                        }}
                    >
                        {getIntlText('common.label.no_options')}
                    </Box>
                )
            }
            loadingText={
                loadingText || (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: '10px 8px',
                        }}
                    >
                        {getIntlText('common.label.loading')}
                    </Box>
                )
            }
            value={value}
            slotProps={slotProps}
            {...rest}
        />
    );
};

export default ValueSelect;
