import React, { useCallback, useMemo, useEffect, useState } from 'react';
import {
    Autocomplete,
    Chip,
    TextField,
    Tooltip,
    Popper,
    type PopperProps,
    type AutocompleteProps,
    type AutocompleteValue,
    type ChipTypeMap,
} from '@mui/material';
import cls from 'classnames';
import { useDebounceFn, useMemoizedFn } from 'ahooks';
import { useI18n, useStoreShallow } from '@milesight/shared/src/hooks';
import { KeyboardArrowDownIcon } from '@milesight/shared/src/components';
import { type AiAPISchema } from '@/services/http';
import List from './list';
import useDeviceSelectStore from './store';
import type { ValueType } from './typings';
import './style.less';

type DeviceSelectProps<
    Value extends ValueType = ValueType,
    Multiple extends boolean | undefined = false,
    DisableClearable extends boolean | undefined = false,
    FreeSolo extends boolean | undefined = true,
    ChipComponent extends React.ElementType = ChipTypeMap['defaultComponent'],
> = Omit<
    AutocompleteProps<Value, Multiple, DisableClearable, FreeSolo, ChipComponent>,
    'options' | 'renderInput'
>;

/**
 * DeviceSelect Component
 */
const DeviceSelect = <
    Value extends ValueType = ValueType,
    Multiple extends boolean | undefined = false,
    DisableClearable extends boolean | undefined = false,
    FreeSolo extends boolean | undefined = true,
    ChipComponent extends React.ElementType = ChipTypeMap['defaultComponent'],
>({
    size,
    multiple,
    loadingText,
    noOptionsText,
    className,
    value,
    onChange,
    ...props
}: DeviceSelectProps<Value, Multiple, DisableClearable, FreeSolo, ChipComponent>) => {
    const { getIntlText } = useI18n();

    // ---------- Get Device list ----------
    const { devices, getDevices, refreshDevices } = useDeviceSelectStore(
        useStoreShallow(['devices', 'getDevices', 'refreshDevices']),
    );

    // Only refresh when component mounted
    useEffect(() => {
        refreshDevices();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ---------- Get search result ----------
    const [searchKeyword, setSearchKeyword] = useState('');
    const [searchDevices, setSearchDevices] = useState<ValueType[] | null>();
    const { run: handleSearch } = useDebounceFn(
        async (keyword?: string | null) => {
            if (!keyword) {
                setSearchDevices(undefined);
                return;
            }

            const result = await getDevices({ name: keyword });
            setSearchDevices(result);
        },
        {
            wait: 300,
        },
    );

    // ---------- Interactions ----------
    // Popper open
    const [popperOpen, setPopperOpen] = useState(false);

    // Input Value
    const [inputValue, setInputValue] = useState('');
    const handleInputChange = useCallback<
        NonNullable<
            AutocompleteProps<
                Value,
                Multiple,
                DisableClearable,
                FreeSolo,
                ChipComponent
            >['onInputChange']
        >
    >(
        (_, value, reason) => {
            console.log({ _, value, reason });
            setInputValue(value);

            switch (reason) {
                case 'blur':
                case 'reset':
                    handleSearch('');
                    break;
                case 'input':
                    handleSearch(value);
                    break;
                default:
                    break;
            }
        },
        [handleSearch],
    );

    // Value Change
    const handleChange = useMemoizedFn(
        (value: AutocompleteValue<Value, Multiple, DisableClearable, FreeSolo>) => {
            if (!multiple) {
                setPopperOpen(false);
                setSearchKeyword('');
            }

            onChange?.({} as React.SyntheticEvent, value, 'selectOption');
        },
    );

    // ---------- Render Custom Autocomplete ----------
    /**
     * Renders the input component for the Autocomplete.
     */
    const renderInput = useCallback<
        AutocompleteProps<Value, Multiple, DisableClearable, FreeSolo, ChipComponent>['renderInput']
    >(
        params => (
            <TextField
                {...params}
                InputProps={{
                    ...params.InputProps,
                    size,
                }}
            />
        ),
        [size],
    );

    /**
     * Renders the tags for the selected values when multiple selection is enabled.
     */
    const renderTags = useCallback<
        NonNullable<
            AutocompleteProps<
                Value,
                Multiple,
                DisableClearable,
                FreeSolo,
                ChipComponent
            >['renderTags']
        >
    >(
        (value, getTagProps) => {
            if (!multiple) return;

            // const valueList = value
            //     .map(v => entityOptionMap.get(getOptionValue(v))!)
            //     .filter(Boolean);
            // return valueList.map((option, index) => {
            //     const { key, ...tagProps } = getTagProps({ index });

            //     return (
            //         <Tooltip key={key} title={option.description}>
            //             <Chip label={option.label} {...tagProps} />
            //         </Tooltip>
            //     );
            // });
            console.log('render tag', { value });
            return <>tag</>;
        },
        [multiple],
    );

    /**
     * Gets the display text for the input box based on the selected option.
     */
    const getOptionLabel = useCallback<
        NonNullable<
            AutocompleteProps<
                Value,
                Multiple,
                DisableClearable,
                FreeSolo,
                ChipComponent
            >['getOptionLabel']
        >
    >(option => {
        if (typeof option === 'string') return option;
        return option.name;
    }, []);

    /**
     * Disable the built-in filtering
     */
    const filterOptions = useCallback<
        NonNullable<
            AutocompleteProps<
                Value,
                Multiple,
                DisableClearable,
                FreeSolo,
                ChipComponent
            >['filterOptions']
        >
    >(option => option, []);

    const isOptionEqualToValue = useCallback<
        NonNullable<
            AutocompleteProps<
                Value,
                Multiple,
                DisableClearable,
                FreeSolo,
                ChipComponent
            >['isOptionEqualToValue']
        >
    >((option, value) => {
        if (typeof option === 'string' && typeof value === 'string') {
            return option === value;
        }
        return option.id === value.id;
    }, []);

    /**
     * Custom Render listbox & popper
     */
    const slotProps = useMemo<
        AutocompleteProps<Value, Multiple, DisableClearable, FreeSolo, ChipComponent>['slotProps']
    >(
        () => ({
            listbox: {
                multiple,
                devices,
                searchDevices,
                value,
                onSelectedChange: handleChange,
                component: List,
            },
            popper: {
                className: 'ms-device-select-popper',
                placement: 'bottom-start',
                style: { width: 560 },
            },
        }),
        [value, multiple, devices, searchDevices, handleChange],
    );

    return (
        <Autocomplete<Value, Multiple, DisableClearable, FreeSolo, ChipComponent>
            fullWidth
            className={cls('ms-device-select', className)}
            {...props}
            size={size}
            multiple={multiple}
            popupIcon={<KeyboardArrowDownIcon />}
            renderInput={renderInput}
            renderTags={renderTags}
            filterOptions={filterOptions}
            getOptionLabel={getOptionLabel}
            isOptionEqualToValue={isOptionEqualToValue}
            slotProps={slotProps}
            options={(devices as Value[]) || []}
            loadingText={
                loadingText || (
                    <div className="ms-device-select__loading">
                        {getIntlText('common.label.loading')}
                    </div>
                )
            }
            noOptionsText={
                noOptionsText || (
                    <div className="ms-device-select__empty">
                        {getIntlText('common.label.no_options')}
                    </div>
                )
            }
            open={popperOpen}
            onOpen={() => setPopperOpen(true)}
            onClose={() => setPopperOpen(false)}
            inputValue={inputValue}
            onInputChange={handleInputChange}
            value={value}
            onChange={onChange}
        />
    );
};

export type { ValueType };

export { useDeviceSelectStore };
export default DeviceSelect;
