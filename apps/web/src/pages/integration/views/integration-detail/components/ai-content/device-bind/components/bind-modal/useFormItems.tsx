import React, { useMemo, useState } from 'react';
import { type ControllerProps } from 'react-hook-form';
import { FormControl, FormControlLabel, FormHelperText } from '@mui/material';
import { useI18n } from '@milesight/shared/src/hooks';
import { type AiAPISchema } from '@/services/http';
import DeviceSelect, { type ValueType as DeviceSelectValueType } from '../device-select';
import ImageEntitySelect from '../image-entity-select';

export type FormDataProps = Record<string, any>;

const useFormItems = () => {
    const { getIntlText } = useI18n();
    const [deviceId, setDeviceId] = useState<ApiKey | null>();
    const deviceFormItems = useMemo(() => {
        const result: ControllerProps<FormDataProps>[] = [
            {
                name: 'device_id',
                // rules: {
                //     required: getIntlText('integration.device_id.required'),
                // },
                render({ field: { onChange, value, disabled }, fieldState: { error } }) {
                    const innerValue = !value ? null : { id: value };
                    return (
                        <FormControl fullWidth size="small" disabled={disabled} sx={{ mb: 1.5 }}>
                            <DeviceSelect
                                required
                                label={getIntlText('common.label.device')}
                                value={innerValue}
                                onChange={(_, val) => {
                                    const finalVal =
                                        !val || typeof val === 'string' ? val : val?.id;
                                    onChange(finalVal);
                                    setDeviceId(finalVal);
                                }}
                                disabled={disabled}
                            />
                            {error && (
                                <FormHelperText sx={{ mt: 0.5 }}>{error?.message}</FormHelperText>
                            )}
                        </FormControl>
                    );
                },
            },
            {
                name: 'image_entity_key',
                // rules: {
                //     required: getIntlText('integration.image_entity_key.required'),
                // },
                render({ field: { onChange, value, disabled }, fieldState: { error } }) {
                    const innerValue = !value ? null : { id: value };

                    return (
                        <FormControl fullWidth size="small" disabled={disabled} sx={{ mb: 1.5 }}>
                            <ImageEntitySelect
                                required
                                label={getIntlText('common.label.entity')}
                                deviceId={deviceId}
                                value={innerValue}
                                onChange={(_, val) => {
                                    const finalVal =
                                        !val || typeof val === 'string' ? val : val?.id;
                                    onChange(finalVal);
                                }}
                            />
                            {error && (
                                <FormHelperText sx={{ mt: 0.5 }}>{error?.message}</FormHelperText>
                            )}
                        </FormControl>
                    );
                },
            },
        ];

        return result;
    }, [deviceId, getIntlText]);

    return { deviceFormItems };
};

export default useFormItems;
