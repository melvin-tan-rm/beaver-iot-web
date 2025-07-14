import React, { useMemo } from 'react';
import { TextField } from '@mui/material';
import { useI18n } from '@milesight/shared/src/hooks';
import { ValueCompType } from '../../../../../types';
import {
    ValueComponentSlotProps,
    ValueCompBaseProps,
    FilterValueType,
    TextFieldPropsOverrides,
    AutocompletePropsOverrides,
} from '../types';
import { ValueSelect } from '../components';

type BaseInputProps<T extends FilterValueType> = TextFieldPropsOverrides & ValueCompBaseProps<T>;
type BaseSelectProps<T extends FilterValueType> = AutocompletePropsOverrides<T> &
    ValueCompBaseProps<T>;
type BaseEmptyProps = Omit<TextFieldPropsOverrides, 'value' | 'onChange' | 'disabled'>;

/**
 * Row condition hook
 */
const useValueComp = <T extends FilterValueType>() => {
    const { getIntlText } = useI18n();

    const components = useMemo(
        () => ({
            input: (props: BaseInputProps<T>) => (
                <TextField
                    placeholder={getIntlText('common.placeholder.input')}
                    {...props}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        props?.onChange?.(event?.target?.value as unknown as T);
                    }}
                />
            ),
            select: (props: BaseSelectProps<T>) => {
                const { value, getFilterValueOptions, ...rest } = props;
                return (
                    <ValueSelect
                        {...rest}
                        getFilterValueOptions={getFilterValueOptions}
                        value={value || (props.multiple ? [] : null)}
                        onChange={(e: React.SyntheticEvent, value: T) => {
                            props.onChange(value);
                        }}
                    />
                );
            },
            '': (props: BaseEmptyProps) => <TextField disabled {...props} />,
        }),
        [getIntlText],
    );

    const renderValueComponent = (
        valueCompType: ValueCompType,
        props: ValueCompBaseProps<T>,
        slotProps: ValueComponentSlotProps,
    ) => {
        const Component = components[valueCompType];
        return <Component {...slotProps} {...props} />;
    };

    return {
        renderValueComponent,
    };
};

export default useValueComp;
