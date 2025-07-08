import { useMemo } from 'react';
import { isEqual } from 'lodash-es';
import { Autocomplete, Box, TextField } from '@mui/material';
import { useI18n } from '@milesight/shared/src/hooks';
import { ValueCompType } from '../../../../types';
import { ValueComponentProps, ValueComponentSlotProps, ValueCompBaseProps } from './types';

const DEFAULT_SELECT_PROPS = {
    multiple: true,
    clearOnEscape: false,
    disableCloseOnSelect: true,
};

/**
 * Row condition hook
 */
const useValueComp = <T extends ApiKey | ApiKey[]>() => {
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
                const { value, ...rest } = props;
                return (
                    <Autocomplete<T>
                        isOptionEqualToValue={(option, value) => isEqual(option, value)}
                        renderInput={params => {
                            return (
                                <TextField
                                    {...params}
                                    InputProps={{
                                        ...params.InputProps,
                                    }}
                                    sx={{ minWidth: '225px' }}
                                    error={props.error}
                                    placeholder={
                                        value?.length
                                            ? ''
                                            : getIntlText('common.placeholder.select')
                                    }
                                />
                            );
                        }}
                        renderTags={value => (
                            <Box>
                                {getIntlText('common.label.item_selected', { 1: value.length })}
                            </Box>
                        )}
                        noOptionsText={
                            props.noOptionsText || (
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
                        {...DEFAULT_SELECT_PROPS}
                        {...rest}
                        value={value || []}
                        onChange={(e, option: T) => {
                            props.onChange(option);
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
