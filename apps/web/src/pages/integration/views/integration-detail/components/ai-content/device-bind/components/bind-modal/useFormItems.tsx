import { useMemo, useCallback } from 'react';
import { type ControllerProps } from 'react-hook-form';
import { useRequest } from 'ahooks';
import { FormControl, FormHelperText } from '@mui/material';
import { useI18n } from '@milesight/shared/src/hooks';
import { Select } from '@milesight/shared/src/components';
import { objectToCamelCase } from '@milesight/shared/src/utils/tools';
import { checkRequired } from '@milesight/shared/src/utils/validators';
import {
    aiApi,
    awaitWrap,
    getResponseData,
    isRequestSuccess,
    // type AiAPISchema,
} from '@/services/http';
import { useEntityFormItems, IMAGE_ENTITY_KEYWORD, type UseEntityFormItemsProps } from '@/hooks';
import { type InteEntityType } from '../../../../../hooks';
import { getModelId } from '../../../helper';
import DeviceSelect, { type ValueType as DeviceSelectValueType } from '../device-select';
import ImageEntitySelect from '../image-entity-select';

export type FormDataProps = Record<string, any>;

type AiModelEntityType = InteEntityType & { children?: InteEntityType[] };

type Props = {
    entities?: AiModelEntityType[];

    device?: DeviceSelectValueType | null;

    modelId?: ApiKey | null;
};

export const DEVICE_KEY = '$device';
export const IMAGE_ENTITY_KEY = '$image_entity';
export const AI_MODEL_KEY = 'model_id';
export const AI_INFER_INPUTS_KEY = 'infer_inputs';

const useFormItems = ({ entities, device, modelId }: Props) => {
    const { getIntlText } = useI18n();

    const deviceId = device?.id;
    const deviceFormItems = useMemo(() => {
        const result: ControllerProps<FormDataProps>[] = [
            {
                name: DEVICE_KEY,
                rules: {
                    validate: {
                        checkRequired: checkRequired(),
                    },
                },
                render({ field: { onChange, value, disabled }, fieldState: { error } }) {
                    const innerValue = !value
                        ? null
                        : typeof value !== 'string'
                          ? value
                          : { id: value };
                    return (
                        <FormControl fullWidth size="small" disabled={disabled} sx={{ mb: 1.5 }}>
                            <DeviceSelect
                                required
                                label={getIntlText('common.label.device')}
                                value={innerValue}
                                onChange={(_, val) => onChange(val)}
                                disabled={disabled}
                            />
                            {error && (
                                <FormHelperText error sx={{ mt: 0.5 }}>
                                    {error?.message}
                                </FormHelperText>
                            )}
                        </FormControl>
                    );
                },
            },
            {
                name: IMAGE_ENTITY_KEY,
                rules: {
                    validate: {
                        checkRequired: checkRequired(),
                    },
                },
                render({ field: { onChange, value, disabled }, fieldState: { error } }) {
                    const innerValue = !value
                        ? null
                        : typeof value !== 'string'
                          ? value
                          : { id: value };

                    return (
                        <FormControl fullWidth size="small" disabled={disabled} sx={{ mb: 1.5 }}>
                            <ImageEntitySelect
                                required
                                label={getIntlText('common.label.entity')}
                                deviceId={deviceId}
                                value={innerValue}
                                onChange={(_, val) => onChange(val)}
                            />
                            {error && (
                                <FormHelperText error sx={{ mt: 0.5 }}>
                                    {error?.message}
                                </FormHelperText>
                            )}
                        </FormControl>
                    );
                },
            },
        ];

        return result;
    }, [deviceId, getIntlText]);

    const aiFormItems = useMemo(() => {
        const result: ControllerProps<FormDataProps>[] = [
            {
                name: AI_MODEL_KEY,
                rules: {
                    validate: {
                        checkRequired: checkRequired(),
                    },
                },
                render({ field: { onChange, value, disabled }, fieldState: { error } }) {
                    const options =
                        entities?.map(v => ({
                            label: v.name,
                            value: getModelId(v.key),
                        })) || [];

                    return (
                        <Select
                            required
                            label={getIntlText('common.label.ai_model')}
                            error={error}
                            disabled={disabled}
                            options={options}
                            value={value || null}
                            onChange={e => {
                                const { value } = e.target;
                                onChange(value);
                            }}
                        />
                    );
                },
            },
        ];

        return result;
    }, [entities, getIntlText]);

    const { data: dynamicFormEntities } = useRequest(
        async () => {
            if (!modelId) return;
            const [error, resp] = await awaitWrap(aiApi.syncModelDetail({ model_id: modelId }));

            if (error || !isRequestSuccess(resp)) return;
            const data = getResponseData(resp);
            const entities: UseEntityFormItemsProps['entities'] = data?.input_entities
                .map(item => ({
                    ...item,
                    id: item.identifier,
                    valueType: item.value_type,
                    valueAttribute: objectToCamelCase(item.attributes),
                }))
                .filter(v => !v.valueAttribute.format?.includes(IMAGE_ENTITY_KEYWORD));

            return entities;
        },
        {
            debounceWait: 300,
            refreshDeps: [modelId],
        },
    );
    const { formItems: aiDynamicFormItems, encodedEntityKeys } = useEntityFormItems({
        entities: dynamicFormEntities,
    });

    const decodeFormParams = useCallback(
        (data: FormDataProps) => {
            const result: Record<string, any> = {};
            const entityMapList = Object.entries(encodedEntityKeys);

            Object.keys(data).forEach(key => {
                const index = entityMapList.findIndex(v => v[1] === key);
                if (index < 0) {
                    switch (key) {
                        case DEVICE_KEY: {
                            result.id = data[key]?.id;
                            break;
                        }
                        case IMAGE_ENTITY_KEY: {
                            result.image_entity_key = data[key]?.key;
                            break;
                        }
                        default: {
                            result[key] = data[key];
                            break;
                        }
                    }
                } else {
                    const originKey = entityMapList[index][0];
                    const fieldKey = originKey.split('.').pop() as string;

                    if (!result[AI_INFER_INPUTS_KEY]) {
                        result[AI_INFER_INPUTS_KEY] = {};
                    }
                    result[AI_INFER_INPUTS_KEY][fieldKey] = data[key];
                }
            });

            return result;
        },
        [encodedEntityKeys],
    );

    return { aiFormItems, aiDynamicFormItems, deviceFormItems, decodeFormParams };
};

export default useFormItems;
