import { useMemo, useState, useCallback } from 'react';
import { Grid2, IconButton } from '@mui/material';
import { cloneDeep } from 'lodash-es';
import { useI18n } from '@milesight/shared/src/hooks';
import { ChevronRightIcon, toast } from '@milesight/shared/src/components';
import { useConfirm, Tooltip } from '@/components';
import { aiApi, entityAPI, awaitWrap, isRequestSuccess, getResponseData } from '@/services/http';
import { InteEntityType } from '../../../hooks';
import TestModal from './test-modal';

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
    /** Service call successful callback */
    onUpdateSuccess?: (
        successCb?: (entityList?: InteEntityType[], excludeKeys?: ApiKey[]) => void,
    ) => void;
}

/**
 * This keyword indicates that this service is used to refresh AI models
 */
const REFRESH_SERVICE_KEYWORD = 'refresh_model';
/**
 * This keyword indicates that this service is used to call AI models
 */
const TEST_SERVICE_KEYWORD = 'model_';

/**
 * ai model services component
 */
const Service: React.FC<Props> = ({ loading, entities, excludeKeys, onUpdateSuccess }) => {
    const { getIntlText } = useI18n();

    // ---------- Render service list ----------
    const serviceCompose = useCallback((entities?: InteEntityType[], excludeKeys?: ApiKey[]) => {
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
                item.parent ||
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

    const serviceEntities = useMemo(
        () => serviceCompose(entities, excludeKeys),
        [entities, excludeKeys, serviceCompose],
    );

    // ---------- Handle service calls ----------
    const confirm = useConfirm();
    const [targetService, setTargetService] = useState<InteServiceType | null>();
    const handleClick = async (service: InteServiceType) => {
        // Refresh model list
        if (`${service.key}`.includes(REFRESH_SERVICE_KEYWORD)) {
            confirm({
                title: getIntlText('setting.integration.ai_update_model'),
                description: getIntlText('setting.integration.ai_update_model_tip'),
                type: 'info',
                async onConfirm() {
                    const [error, resp] = await awaitWrap(
                        entityAPI.callService({ exchange: { [service.key]: {} } }),
                    );

                    if (error || !isRequestSuccess(resp)) return;
                    onUpdateSuccess?.();
                    toast.success({ content: getIntlText('common.message.operation_success') });
                },
            });
            return;
        }

        // Get AI model config and open test modal
        if (`${service.key}`.includes(TEST_SERVICE_KEYWORD)) {
            const modelId = `${service.key}`
                .split('.')
                .pop()
                ?.replace(`${TEST_SERVICE_KEYWORD}`, '');
            const [error, resp] = await awaitWrap(
                aiApi.syncModelDetail({
                    model_id: modelId || '',
                }),
            );
            const data = getResponseData(resp);

            // console.log({ service, data });
            if (error || !data || !isRequestSuccess(resp)) return;

            onUpdateSuccess?.((list, excludeKeys) => {
                const services = serviceCompose(list, excludeKeys);
                const latestService = services?.find(it => it.key === service.key);

                setTargetService(latestService || service);
            });
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
                toast.success({ content: getIntlText('common.message.operation_success') });
            },
        });
    };

    return (
        <div className="ms-view-ai-service">
            <Grid2 container spacing={2}>
                {serviceEntities.map(service => (
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
            <TestModal
                visible={!!targetService}
                modelName={targetService?.name || ''}
                entities={targetService?.children || []}
                onCancel={() => setTargetService(null)}
            />
        </div>
    );
};

export default Service;
