import { useMemo } from 'react';
import { type ControllerProps } from 'react-hook-form';
import { FormControl, FormHelperText, InputLabel, TextField } from '@mui/material';
import { useI18n } from '@milesight/shared/src/hooks';
import ImageInput from './image-input';

/**
 * Form data type
 */
export type FormDataType = Record<string, any>;

const useFormItems = () => {
    const { getIntlText } = useI18n();

    const formItems = useMemo(() => {
        const result: ControllerProps<FormDataType>[] = [
            {
                name: 'imageUrl',
                render({ field: { onChange, value }, fieldState: { error } }) {
                    return (
                        <FormControl required disabled fullWidth>
                            <InputLabel>{getIntlText('common.label.upload_image')}</InputLabel>
                            <ImageInput value={value} onChange={onChange} />
                            {error && (
                                <FormHelperText error sx={{ mt: 1 }}>
                                    {error.message}
                                </FormHelperText>
                            )}
                        </FormControl>
                    );
                },
            },
            {
                name: 'conf',
                render({ field: { onChange, value, disabled }, fieldState: { error } }) {
                    return (
                        <TextField
                            fullWidth
                            required
                            type="text"
                            label="Configuration"
                            sx={{ my: 1.5 }}
                            disabled={disabled}
                            error={!!error}
                            helperText={error ? error.message : null}
                            value={value}
                            onChange={onChange}
                        />
                    );
                },
            },
        ];

        return result;
    }, [getIntlText]);

    return {
        formItems,
    };
};

export default useFormItems;
