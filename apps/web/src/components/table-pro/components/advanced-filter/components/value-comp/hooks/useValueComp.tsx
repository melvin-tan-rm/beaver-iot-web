import React, { useMemo } from 'react';
import { TextField } from '@mui/material';
import { useI18n } from '@milesight/shared/src/hooks';
import { ValueCompType } from '../../../../../types';
import {
    ValueComponentProps,
    ValueComponentSlotProps,
    ValueCompBaseProps,
    FilterValueType,
} from '../types';
import { OprValueSelect } from '../components';

/**
 * Row condition hook
 */
const useValueComp = <T extends FilterValueType>() => {
    const { getIntlText } = useI18n();

    const components = useMemo(
        () => ({
            input: (props: ValueComponentProps['baseInput']) => (
                <TextField
                    placeholder={getIntlText('common.placeholder.input')}
                    {...props}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        props?.onChange?.(event?.target?.value);
                    }}
                />
            ),
            select: (props: ValueComponentProps['baseSelect']) => {
                const { value, getFilterValueOptions, ...rest } = props;
                return (
                    <OprValueSelect
                        {...rest}
                        getFilterValueOptions={getFilterValueOptions}
                        value={value || (props.multiple ? [] : null)}
                        onChange={(e: React.SyntheticEvent, value: T) => {
                            props.onChange(value);
                        }}
                    />
                );
            },
            '': (props: ValueComponentProps['baseInput']) => <TextField disabled {...props} />,
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
