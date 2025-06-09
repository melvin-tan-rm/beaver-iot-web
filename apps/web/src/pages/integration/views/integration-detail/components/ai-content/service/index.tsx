import { useCallback, useEffect, useMemo, useState } from 'react';
import { Grid2, IconButton } from '@mui/material';
import { cloneDeep, isUndefined } from 'lodash-es';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useI18n } from '@milesight/shared/src/hooks';
import { ChevronRightIcon, toast } from '@milesight/shared/src/components';
import { useEntityFormItems, type EntityFormDataProps } from '@/hooks';
import { useConfirm, Tooltip } from '@/components';
import {
    entityAPI,
    awaitWrap,
    isRequestSuccess,
    AiAPISchema,
    aiApi,
    getResponseData,
} from '@/services/http';
import { objectToCamelCase } from '@milesight/shared/src/utils/tools';
import { InteEntityType, useEntity } from '../../../hooks';

type InteServiceType = InteEntityType & {
    children?: InteServiceType[];
};

interface Props {
    /** Loading or not */
    loading?: boolean;
    /** Service Entity Key that the page does not render */
    excludeKeys?: ApiKey[];
    /** Entity list */
    entities?: InteEntityType[];
    /** Edit successful callback */
    onUpdateSuccess?: (successCb?: (entityList: any) => void) => void;
}

const refreshModelKey = 'refresh_model';

/**
 * ai model services component
 */
const Service: React.FC<Props> = ({ loading, entities, excludeKeys, onUpdateSuccess }) => {
    const { getIntlText } = useI18n();
    const { getEntityKey } = useEntity({ entities });

    const [modelOutput, setModelOutput] =
        useState<ObjectToCamelCase<AiAPISchema['syncModelDetail']['response']>>();

    const assembleService = useCallback((entities: InteEntityType[] | undefined) => {
        const services = entities?.filter(item => {
            return (
                item.type === 'SERVICE' &&
                !excludeKeys?.some(key => `${item.key}`.includes(`${key}`))
            );
        });
        const result: InteServiceType[] = cloneDeep(services || []);

        // TODO: Multi-level (>2) service parameter processing
        result?.forEach(item => {
            if (!item.parent) return;

            const service = result.find(it => it.key === item.parent);

            if (!service) return;
            service.children = service.children || [];
            service.children.push(item);
        });

        /**
         * If the sub entity is empty, and the entity value type is not BINARY, ENUM, or OBJECT,
         * use the entity itself as the sub entity.
         */
        result.forEach(item => {
            if (
                item.children?.length ||
                (['BINARY', 'ENUM', 'OBJECT'] as EntityValueDataType[]).includes(item.valueType)
            ) {
                return;
            }
            item.children = item.children || [];
            item.children.push(item);
        });

        return result.filter(item => !item.parent);
    }, []);

    const modelServiceEntities = useMemo(() => {
        return assembleService(entities);
    }, [entities, excludeKeys]);

    // ---------- card Click on Related Processing logic ----------
    const confirm = useConfirm();
    const handleClick = async (service: InteServiceType) => {
        const modelKeyWord = 'model_';
        // refresh model list
        if (String(service.key).includes(refreshModelKey)) {
            confirm({
                title: getIntlText('setting.integration.ai_update_model'),
                description: getIntlText('setting.integration.ai_update_model_tip'),
                type: 'info',
                async onConfirm() {
                    onUpdateSuccess?.();
                    toast.success({ content: getIntlText('common.message.operation_success') });
                },
            });
            return;
        }

        // update model field detail if is model
        if (String(service.key).includes(modelKeyWord)) {
            const modelId = String(service.key).substring(
                String(service.key).lastIndexOf(modelKeyWord) + modelKeyWord.length,
            );
            const [error, resp] = await awaitWrap(
                aiApi.syncModelDetail({
                    model_id: modelId,
                }),
            );
            const data = getResponseData(resp);
            if (error || !data || !isRequestSuccess(resp)) {
                return;
            }
            // save model output format
            setModelOutput(objectToCamelCase(data));
            onUpdateSuccess?.(entityList => {
                const serviceEntities = assembleService(entityList);
                setTargetService(serviceEntities.find(entity => entity.key === service.key));
            });
            return;
        }

        if (service.children) {
            setTargetService(service);
            return;
        }

        confirm({
            title: getIntlText('setting.integration.service_operation_confirm', {
                1: service.name,
            }),
            async onConfirm() {
                const [error, resp] = await awaitWrap(
                    entityAPI.callService({ exchange: { [service.key]: {} } }),
                );
                if (error || !isRequestSuccess(resp)) return;
                onUpdateSuccess?.();
                toast.success({ content: getIntlText('common.message.operation_success') });
            },
        });
    };

    // ---------- pop-up form related processing logic ----------
    const [targetService, setTargetService] = useState<InteServiceType>();
    const { control, handleSubmit, setValue, getValues } = useForm<EntityFormDataProps>({
        shouldUnregister: true,
    });
    const { formItems, decodeFormParams, encodeFormData } = useEntityFormItems({
        entities: targetService?.children,
        // isAllRequired: true,
    });

    const onSubmit: SubmitHandler<EntityFormDataProps> = async params => {
        if (!targetService) return;
        const finalParams = decodeFormParams(params);

        if (!finalParams) {
            console.warn(`params is empty, the origin params is ${JSON.stringify(params)}`);
            return;
        }

        const [error, resp] = await awaitWrap(
            entityAPI.callService({
                exchange: Object.values(finalParams).every(val => isUndefined(val))
                    ? {}
                    : finalParams,
            }),
        );
        if (error || !isRequestSuccess(resp)) return;

        onUpdateSuccess?.();
        setTargetService(undefined);
        toast.success({ content: getIntlText('common.message.operation_success') });
    };

    // Form data backfill
    useEffect(() => {
        if (!targetService?.children?.length) return;

        const formData = encodeFormData(targetService.children);

        Object.entries(formData || {}).forEach(([key, value]) => {
            setValue(key, value);
        });
    }, [targetService, setValue, encodeFormData]);

    return (
        <div className="ms-view-ai-service">
            <Grid2 container spacing={2}>
                {modelServiceEntities.map(service => (
                    <Grid2 key={service.key} size={{ sm: 6, md: 4, xl: 3 }}>
                        <div className="ms-int-feat-card" onClick={() => handleClick(service)}>
                            <div className="header">
                                <Tooltip autoEllipsis className="title" title={service.name} />
                                <IconButton sx={{ width: 24, height: 24 }}>
                                    <ChevronRightIcon />
                                </IconButton>
                            </div>
                            <div className="desc">
                                <Tooltip
                                    autoEllipsis
                                    className="title"
                                    title={service?.description || ''}
                                />
                            </div>
                        </div>
                    </Grid2>
                ))}
            </Grid2>
        </div>
    );
};

export default Service;
