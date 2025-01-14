import { useState, useRef } from 'react';
import { Modal, EntityForm, toast } from '@milesight/shared/src/components';
import { useI18n } from '@milesight/shared/src/hooks';
import { flattenObject, objectToCamelToSnake } from '@milesight/shared/src/utils/tools';
import { useConfirm } from '@/components';
import { ENTITY_VALUE_TYPE } from '@/constants';
import { useEntityApi, type CallServiceType } from '../../../hooks';
import { RenderView } from '../../../render';
import { ViewConfigProps } from './typings';
import './style.less';

interface Props {
    config: ViewConfigProps;
    configJson: CustomComponentProps;
    isEdit?: boolean;
    mainRef: any;
}

const View = (props: Props) => {
    const { getIntlText } = useI18n();
    const confirm = useConfirm();
    const { getEntityChildren, callService, updateProperty } = useEntityApi();
    const { config, configJson, isEdit, mainRef } = props;
    const [visible, setVisible] = useState(false);
    const [entities, setEntities] = useState([]);
    const ref = useRef<any>();
    const tempRef = useRef<any>({});

    // Call service
    const handleCallService = async (data: Record<string, any>) => {
        const { error } = await callService({
            entity_id: (config?.entity as any)?.value as ApiKey,
            exchange: data,
        } as CallServiceType);
        if (!error) {
            setVisible(false);
            toast.success({
                key: 'callService',
                container: mainRef.current,
                content: getIntlText('common.message.operation_success'),
            });
        }
    };

    const handleUpdateProperty = async (data: Record<string, any>) => {
        const { error } = await updateProperty({
            entity_id: (config?.entity as any)?.value as ApiKey,
            exchange: data,
        } as CallServiceType);
        if (!error) {
            setVisible(false);
            toast.success({
                key: 'updateProperty',
                container: mainRef.current,
                content: getIntlText('common.message.operation_success'),
            });
        }
    };

    const handleClick = async () => {
        if (configJson.isPreview || isEdit) {
            return;
        }
        const { error, res } = await getEntityChildren({
            id: (config?.entity as any)?.value as ApiKey,
        });
        const entityType = config?.entity?.rawData?.entityType;
        const valueType = config?.entity?.rawData?.entityValueType;
        if (!error) {
            let list = res || [];
            if (valueType !== ENTITY_VALUE_TYPE.OBJECT && !list.length) {
                list = [objectToCamelToSnake(config?.entity?.rawData)];
            }
            const children =
                list?.filter((childrenItem: EntityData) => {
                    return childrenItem?.entity_access_mod?.indexOf('W') > -1;
                }) || [];
            if (children?.length) {
                setEntities(
                    children.map((item: EntityData, index: number) => {
                        tempRef.current[`tempTemp-${index}`] = item.entity_key;
                        return {
                            ...item,
                            id: item.entity_id,
                            key: `tempTemp-${index}`,
                            name: item.entity_name,
                            value_attribute: item.entity_value_attribute,
                        };
                    }),
                );
                setVisible(true);
            } else {
                confirm({
                    title: '',
                    description: getIntlText('dashboard.plugin.trigger_confirm_text'),
                    confirmButtonText: getIntlText('common.button.confirm'),
                    onConfirm: async () => {
                        const entityKey = (config?.entity as any).rawData?.entityKey;
                        // If the entity itself is the object default is {}, otherwise it is null
                        const resultValue = valueType === ENTITY_VALUE_TYPE.OBJECT ? {} : null;
                        if (entityType === 'SERVICE') {
                            handleCallService({
                                [entityKey]: resultValue,
                            });
                        } else if (entityType === 'PROPERTY') {
                            handleUpdateProperty({
                                [entityKey]: resultValue,
                            });
                        }
                    },
                    dialogProps: {
                        container: mainRef.current,
                    },
                });
            }
        }
    };

    const handleOk = () => {
        ref.current?.handleSubmit();
    };

    const handleSubmit = (data: Record<string, any>) => {
        const newData: any = flattenObject(data);
        const keys = Object.keys(newData);
        const resultData: any = {};
        keys.forEach((key: string) => {
            resultData[tempRef.current[key]] = newData[key];
        });
        const entityType = config?.entity?.rawData?.entityType;
        if (entityType === 'PROPERTY') {
            handleUpdateProperty(resultData);
        } else if (entityType === 'SERVICE') {
            handleCallService(resultData);
        }
    };

    if (configJson.isPreview) {
        return (
            <div className="trigger-view-preview">
                <RenderView config={config} configJson={configJson} onClick={handleClick} />
            </div>
        );
    }

    return (
        <>
            <RenderView config={config} configJson={configJson} onClick={handleClick} />
            {visible && !!mainRef.current && (
                <Modal
                    title={configJson.name}
                    onOk={handleOk}
                    onCancel={() => setVisible(false)}
                    container={mainRef.current}
                    visible
                >
                    <div className="trigger-view-form">
                        {/* @ts-ignore: Mock data field is missing, temporarily ignore the TS verification error */}
                        <EntityForm ref={ref} entities={entities} onOk={handleSubmit} />
                    </div>
                </Modal>
            )}
        </>
    );
};

export default View;
