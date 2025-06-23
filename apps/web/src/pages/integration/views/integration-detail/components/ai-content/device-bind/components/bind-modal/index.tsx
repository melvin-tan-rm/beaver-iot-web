import React, { useState, useMemo } from 'react';
import { useRequest } from 'ahooks';
import { Button } from '@mui/material';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { useI18n } from '@milesight/shared/src/hooks';
import {
    Modal,
    ArrowBackIcon,
    AddIcon,
    InfoOutlinedIcon,
    type ModalProps,
} from '@milesight/shared/src/components';
import { ImageAnnotation, ToggleRadio, Tooltip } from '@/components';
import {
    aiApi,
    awaitWrap,
    isRequestSuccess,
    getResponseData,
    type AiAPISchema,
} from '@/services/http';
import ResultSetting from '../result-setting';
import useFormItems, { type FormDataProps } from './useFormItems';
import './style.less';

interface Props extends ModalProps {
    /** Target device detail */
    device?: AiAPISchema['getBoundDevices']['response']['content'][0] | null;
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

const BindModal: React.FC<Props> = ({ device, onCancel, ...props }) => {
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
    const { deviceFormItems } = useFormItems();
    const { control, formState, handleSubmit, reset } = useForm<FormDataProps>();

    // ---------- Inference Mode ----------
    const [inferMode, setInferMode] = useState<InferMode>('single');
    const inferModeOptions = useMemo(() => {
        return inferModeSettingOptions.map(item => ({
            label: (
                <>
                    {getIntlText(item.labelIntlKey)}
                    <Tooltip title={getIntlText(item.descIntlKey)}>
                        <InfoOutlinedIcon />
                    </Tooltip>
                </>
            ),
            value: item.value,
        }));
    }, [getIntlText]);

    return (
        <Modal
            {...props}
            fullScreen
            disableEscapeKeyDown
            size="full"
            className="ms-com-device-bind-modal"
            title={getIntlText('setting.integration.ai_bind_device')}
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
                    <Button variant="contained">{getIntlText('common.button.save')}</Button>
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
                            {/* AI Setting form items should be rendered here */}
                        </div>
                    </div>
                </div>
                <div className="modal-infer-setting-root">
                    <div className="modal-infer-mode-setting">
                        <div className="modal-infer-mode-setting-header">
                            <span className="title">
                                {getIntlText('setting.integration.ai_infer_mode_setting')}
                            </span>
                            <ToggleRadio
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
                            </div>
                        </div>
                        <div className="modal-infer-mode-setting-body">
                            <ImageAnnotation
                                imgSrc="http://192.168.43.48:9000/beaver-iot-resource/beaver-iot-public/abc856a0-5d17-46e3-bdd3-26b3aa7ec343-20200108-213609-uqZwL.jpg"
                                points={[]}
                                containerWidth={800 - 32}
                                containerHeight={424 - 32}
                            />
                        </div>
                    </div>
                    <div className="modal-infer-result-setting">
                        <div className="modal-infer-result-setting-header">
                            <span className="title">
                                {getIntlText('setting.integration.ai_infer_result_setting')}
                            </span>
                        </div>
                        <div className="modal-infer-result-setting-body">
                            <ResultSetting
                                data={[
                                    {
                                        title: 'box1',
                                        params: [
                                            {
                                                name: 'result_image',
                                                entityName: 'result_image',
                                                entityId: 'xxxxxxxxxx1',
                                                entityValueType: 'STRING',
                                            },
                                            {
                                                name: 'text',
                                                entityName: 'text',
                                                entityId: 'xxxxxxxxxx2',
                                                entityValueType: 'STRING',
                                            },
                                            {
                                                name: 'data',
                                                entityName: 'data',
                                                entityId: 'xxxxxxxxxx3',
                                                entityValueType: 'STRING',
                                            },
                                        ],
                                    },
                                ]}
                                onChange={() => {}}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default BindModal;
