import React, { useState, useMemo, useEffect } from 'react';
import { useRequest } from 'ahooks';
import { Button } from '@mui/material';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { useI18n } from '@milesight/shared/src/hooks';
import {
    Modal,
    ArrowBackIcon,
    AddIcon,
    InfoOutlinedIcon,
    toast,
    type ModalProps,
} from '@milesight/shared/src/components';
import { ImageAnnotation, ToggleRadio, Tooltip, Empty } from '@/components';
import {
    aiApi,
    awaitWrap,
    isRequestSuccess,
    getResponseData,
    type AiAPISchema,
} from '@/services/http';
import { type InteEntityType } from '../../../../../hooks';
import ResultSetting, {
    type Props as ResultSettingProps,
    ResultSettingItem,
} from '../result-setting';
import { type ValueType as DeviceSelectValueType } from '../device-select';
import { type ValueType as ImageEntitySelectValueType } from '../image-entity-select';
import useFormItems, {
    DEVICE_KEY,
    IMAGE_ENTITY_KEY,
    AI_MODEL_KEY,
    type FormDataProps,
} from './useFormItems';
import './style.less';

interface Props extends ModalProps {
    /** Target device detail */
    device?: AiAPISchema['getBoundDevices']['response']['content'][0] | null;

    /** Entity list of current integration */
    entities?: InteEntityType[];

    /** Bind device success callback */
    onSuccess?: () => void;
}

/**
 * @param single Single-image inference
 * @param multiple Multiple-area inference
 */
type InferMode = 'single' | 'multiple';

const inferModeSettingOptions: {
    labelIntlKey: string;
    descIntlKey: string;
    value: InferMode;
}[] = [
    {
        labelIntlKey: 'setting.integration.ai_infer_single_image',
        value: 'single',
        descIntlKey: 'setting.integration.ai_infer_single_image_desc',
    },
    {
        labelIntlKey: 'setting.integration.ai_infer_area_cut_image',
        value: 'multiple',
        descIntlKey: 'setting.integration.ai_infer_area_cut_image_desc',
    },
];

const DEFAULT_RESULT_SETTINGS: ResultSettingItem[] = [
    {
        name: 'result_image',
        entityName: 'result_image',
        entityId: '',
        entityValueType: 'STRING',
    },
    {
        name: 'text',
        entityName: 'text',
        entityId: '',
        entityValueType: 'STRING',
    },
    {
        name: 'data',
        entityName: 'data',
        entityId: '',
        entityValueType: 'STRING',
    },
];

const BindModal: React.FC<Props> = ({
    visible,
    device,
    entities,
    onCancel,
    onSuccess,
    ...props
}) => {
    const { getIntlText } = useI18n();
    const readonly = !!device?.device_id;

    // ---------- Get binding details ----------
    const { run: getBindingDetails, data: bindingDetail } = useRequest(
        async () => {
            if (!device?.device_id) return;
            const [err, resp] = await awaitWrap(aiApi.getBindingDetail({ id: device.device_id }));

            if (err || !isRequestSuccess(resp)) return;
            const data = getResponseData(resp);

            console.log({ data, resp });
            return data;
        },
        {
            refreshDeps: [device?.device_id],
        },
    );

    // ---------- Render Form Items ----------
    const { control, handleSubmit, watch, reset } = useForm<FormDataProps>();
    const selectedModelId = watch(AI_MODEL_KEY) as ApiKey | undefined | null;
    const selectedDevice = watch(DEVICE_KEY) as DeviceSelectValueType | undefined | null;
    const selectedImageEntity = watch(IMAGE_ENTITY_KEY) as
        | ImageEntitySelectValueType
        | undefined
        | null;
    const { aiFormItems, aiDynamicFormItems, deviceFormItems, decodeFormParams } = useFormItems({
        entities,
        modelId: selectedModelId,
        device: selectedDevice,
    });

    const onSubmit: SubmitHandler<FormDataProps> = async params => {
        const formParams = decodeFormParams(params);

        if (
            !formParams ||
            !resultSetting?.length ||
            resultSetting.some(item => item.params.some(it => !it.entityName))
        ) {
            console.warn(`params is empty, the origin params is ${JSON.stringify(params)}`);
            return;
        }
        const inferOutputs = resultSetting[0].params.map(item => ({
            field_name: item.name,
            entity_name: item.entityName!,
        }));

        // console.log({ params, formParams, inferOutputs });
        const [error, resp] = await awaitWrap(
            aiApi.bindDevice({
                ...formParams,
                infer_outputs: inferOutputs,
            } as AiAPISchema['bindDevice']['request']),
        );

        if (error || !isRequestSuccess(resp)) return;

        onSuccess?.();
        toast.success({ content: getIntlText('common.message.operation_success') });
    };

    // ---------- Inference Mode ----------
    // const [inferMode, setInferMode] = useState<InferMode>('single');
    // const inferModeOptions = useMemo(() => {
    //     return inferModeSettingOptions.map(item => ({
    //         label: (
    //             <>
    //                 {getIntlText(item.labelIntlKey)}
    //                 <Tooltip title={getIntlText(item.descIntlKey)}>
    //                     <InfoOutlinedIcon />
    //                 </Tooltip>
    //             </>
    //         ),
    //         value: item.value,
    //     }));
    // }, [getIntlText]);

    // ---------- Result Settings ----------
    const [resultSetting, setResultSetting] = useState<ResultSettingProps['data'] | null>();

    useEffect(() => {
        if (!selectedModelId || !selectedDevice?.id || !selectedImageEntity?.id) {
            setResultSetting(null);
            return;
        }
        const params = DEFAULT_RESULT_SETTINGS.map(item => ({
            ...item,
            entityId: `${selectedDevice.integration_id}.device.${selectedDevice.id}.model_${selectedModelId}.${item.name}`,
        }));

        setResultSetting([{ params }]);
    }, [selectedModelId, selectedDevice, selectedImageEntity]);

    // ---------- Reset form data ----------
    useEffect(() => {
        if (visible) return;
        reset();
    }, [visible, reset]);

    return (
        <Modal
            {...props}
            fullScreen
            disableEscapeKeyDown
            size="full"
            className="ms-com-device-bind-modal"
            title={getIntlText('setting.integration.ai_bind_device')}
            visible={visible}
            onCancel={onCancel}
        >
            <div className="modal-header">
                <div className="modal-header-left">
                    <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={onCancel}>
                        {getIntlText('common.label.back')}
                    </Button>
                    <div className="modal-header-title">
                        {getIntlText('setting.integration.ai_bind_device')}
                    </div>
                </div>
                <div className="modal-header-right">
                    <Button variant="contained" onClick={handleSubmit(onSubmit)}>
                        {getIntlText('common.button.save')}
                    </Button>
                </div>
            </div>
            <div className="modal-content">
                <div className="modal-infer-form">
                    <div className="modal-infer-form-device">
                        <span className="title">
                            {getIntlText('setting.integration.ai_bind_device_choose_device')}
                        </span>
                        <div className="device-form-root">
                            {deviceFormItems.map(props => (
                                <Controller<FormDataProps>
                                    {...props}
                                    key={props.name}
                                    control={control}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="modal-infer-form-ai">
                        <span className="title">
                            {getIntlText('setting.integration.ai_bind_device_ai_settings')}
                        </span>
                        <div className="ai-form-root">
                            {aiFormItems.map(props => (
                                <Controller<FormDataProps>
                                    {...props}
                                    key={props.name}
                                    control={control}
                                />
                            ))}
                            {aiDynamicFormItems.map(props => (
                                <Controller<FormDataProps>
                                    {...props}
                                    key={props.name}
                                    control={control}
                                />
                            ))}
                        </div>
                    </div>
                </div>
                <div className="modal-infer-setting-root">
                    <div className="modal-infer-mode-setting">
                        <div className="modal-infer-mode-setting-header">
                            <span className="title">
                                {getIntlText('setting.integration.ai_infer_mode_setting')}
                            </span>
                            {/* <ToggleRadio
                                size="small"
                                value={inferMode}
                                options={inferModeOptions}
                                onChange={val => setInferMode(val as InferMode)}
                            />
                            <div className="actions">
                                {inferMode === 'multiple' && (
                                    <Button size="small" variant="outlined" startIcon={<AddIcon />}>
                                        {getIntlText('setting.integration.ai_infer_mode_add_area')}
                                    </Button>
                                )}
                            </div> */}
                        </div>
                        <div className="modal-infer-mode-setting-body">
                            {!selectedImageEntity?.value ? (
                                <Empty />
                            ) : (
                                <img
                                    className="entity-image"
                                    src={selectedImageEntity.value}
                                    alt={selectedImageEntity.name}
                                />
                            )}
                            {/* <ImageAnnotation
                                // imgSrc="http://192.168.43.48:9000/beaver-iot-resource/beaver-iot-public/abc856a0-5d17-46e3-bdd3-26b3aa7ec343-20200108-213609-uqZwL.jpg"
                                imgSrc={selectedImageEntity?.value}
                                points={[]}
                                containerWidth={800 - 32}
                                containerHeight={424 - 32}
                            /> */}
                        </div>
                    </div>
                    <div className="modal-infer-result-setting">
                        <div className="modal-infer-result-setting-header">
                            <span className="title">
                                {getIntlText('setting.integration.ai_infer_result_setting')}
                            </span>
                        </div>
                        <div className="modal-infer-result-setting-body">
                            {!resultSetting ? (
                                <Empty />
                            ) : (
                                <ResultSetting data={resultSetting} onChange={setResultSetting} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default BindModal;
