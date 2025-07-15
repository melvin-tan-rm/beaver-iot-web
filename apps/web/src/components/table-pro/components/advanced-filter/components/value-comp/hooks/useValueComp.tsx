import React, { useMemo } from 'react';
import { TextField } from '@mui/material';
import { useI18n } from '@milesight/shared/src/hooks';
import { SelectValueOptionType, ValueCompType } from '../../../../../types';
import {
    ValueComponentSlotProps,
    ValueCompBaseProps,
    FilterValueType,
    TextFieldPropsOverrides,
    AutocompletePropsOverrides,
} from '../types';
import { ValueSelect } from '../components';

type BaseInputProps<T extends FilterValueType> = TextFieldPropsOverrides & ValueCompBaseProps<T>;
type BaseSelectProps<T extends FilterValueType> = AutocompletePropsOverrides &
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
                        props?.onChange?.(event?.target?.value as T);
                    }}
                />
            ),
            select: (props: BaseSelectProps<T>) => {
                const { value, multiple, onChange, ...rest } = props;
                return (
                    <ValueSelect
                        multiple={multiple}
                        value={(value || (multiple ? [] : null)) as SelectValueOptionType}
                        onChange={(value: SelectValueOptionType) => {
                            onChange?.(value as T);
                        }}
                        {...rest}
                    />
                );
            },
            '': (props: BaseEmptyProps) => <TextField disabled value="" {...props} />,
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
