import { useCallback, useEffect, useMemo, useState } from 'react';
import { Autocomplete, Box, TextField } from '@mui/material';
import { isEqual } from 'lodash-es';
import { useI18n } from '@milesight/shared/src/hooks';
import { OperatorValueOptionType } from '../../../../../../types';
import { AutocompletePropsOverrides } from '../../types';

/**
 *  A drop-down selection component for advanced filter
 */
const ValueSelect = <T extends OperatorValueOptionType>({
    value,
    multiple = true,
    noOptionsText,
    onOpen,
    onClose,
    placeholder,
    getFilterValueOptions,
    ...rest
}: AutocompletePropsOverrides<T>) => {
    const { getIntlText } = useI18n();
    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [options, setOptions] = useState<ReadonlyArray<T>>([]);

    /**
     * Handles opening of the select menu.
     */
    const handleSelectOpen = useCallback(
        async (event: AutocompletePropsOverrides<T>['onOpen']) => {
            setOpen(true);
            onOpen?.(event);
            setOptions(((await getFilterValueOptions?.()) || []) as unknown as ReadonlyArray<T>);
            setLoading(true);
            setLoading(false);
        },
        [onOpen],
    );

    /**
     * Handles closing of the select menu.
     */
    const handleSelectClose = useCallback(
        (...params: AutocompletePropsOverrides<T>['onClose']) => {
            setOpen(false);
            setOptions([]);
            onClose?.(...params);
        },
        [onClose],
    );

    return (
        <Autocomplete<T>
            options={options}
            multiple={multiple}
            open={open}
            onOpen={handleSelectOpen}
            onClose={handleSelectClose}
            loading={loading}
            isOptionEqualToValue={(option, value) => isEqual(option, value)}
            getOptionLabel={(option: OperatorValueOptionType) => option.label}
            renderInput={params => {
                return (
                    <TextField
                        {...params}
                        InputProps={{
                            ...params.InputProps,
                        }}
                        sx={{ minWidth: '225px' }}
                        placeholder={
                            (multiple ? !!value?.length : !!value)
                                ? ''
                                : placeholder || getIntlText('common.placeholder.select')
                        }
                    />
                );
            }}
            renderTags={value => {
                return <Box>{getIntlText('common.label.item_selected', { 1: value.length })}</Box>;
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
            {...rest}
            value={value}
        />
    );
};

export default ValueSelect;
