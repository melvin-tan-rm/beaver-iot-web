import React, { useMemo, useEffect, useState } from 'react';
import { Button, IconButton } from '@mui/material';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { useI18n } from '@milesight/shared/src/hooks';
import { xhrDownload } from '@milesight/shared/src/utils/tools';
import {
    Modal,
    SaveAltIcon,
    ContentCopyIcon,
    AutoAwesomeIcon,
    type ModalProps,
} from '@milesight/shared/src/components';
import {
    Empty,
    Tooltip,
    ToggleRadio,
    ImageAnnotation,
    CodeEditor,
    type Vector2d,
} from '@/components';
import useFormItems, { type FormDataType } from './useFormItems';
import './style.less';

interface Props extends Omit<ModalProps, 'onOk'> {
    /** AI model name */
    modelName?: string;
}

type ResultType = 'image' | 'json';

const resultOptionConfigs: {
    labelIntlKey: string;
    value: ResultType;
}[] = [
    { labelIntlKey: 'common.label.image', value: 'image' },
    { labelIntlKey: 'common.label.json', value: 'json' },
];

const TestModal: React.FC<Props> = ({ modelName, onCancel, ...props }) => {
    const { getIntlText } = useI18n();

    // ---------- Render dynamic form items ----------
    const { control, handleSubmit, reset, setValue } = useForm<FormDataType>();
    const { formItems } = useFormItems();

    const onSubmit: SubmitHandler<FormDataType> = async ({ name, ...params }) => {
        console.log({ name, params });
    };

    // ---------- Handle actions in header ----------
    const resultOptions = useMemo(
        () =>
            resultOptionConfigs.map(config => ({
                label: getIntlText(config.labelIntlKey),
                value: config.value,
            })),
        [getIntlText],
    );
    const [resultType, setResultType] = useState<ResultType>('image');
    const handleCopy = () => {
        switch (resultType) {
            case 'image':
                // TODO: Copy image url
                break;
            case 'json':
                // TODO: Copy json
                break;
            default:
                break;
        }
    };

    // ---------- Render Result ----------
    const [points, setPoints] = useState<Vector2d[][]>([
        [
            { x: 100, y: 100 },
            { x: 400, y: 100 },
            { x: 400, y: 300 },
            { x: 100, y: 300 },
        ],
        [
            { x: 1000, y: 500 },
            { x: 1500, y: 500 },
            { x: 1500, y: 800 },
            { x: 1000, y: 800 },
        ],
    ]);

    return (
        <Modal
            {...props}
            showCloseIcon
            width="1200px"
            className="ms-test-modal"
            title={getIntlText('setting.integration.ai_infer_service_title', { 1: modelName })}
            onCancel={() => {
                reset();
                onCancel?.();
            }}
        >
            <div className="ms-test-modal-content">
                <div className="ms-test-modal-form">
                    <div className="ms-test-modal-form-items">
                        {/* TODO: Generate dynamic form items... */}
                        {formItems.map(props => (
                            <Controller<FormDataType>
                                {...props}
                                key={props.name}
                                control={control}
                            />
                        ))}
                    </div>
                    <Button fullWidth variant="contained" onClick={handleSubmit(onSubmit)}>
                        <AutoAwesomeIcon />
                        {getIntlText('setting.integration.generate_infer_result')}
                    </Button>
                </div>
                <div className="ms-test-modal-result">
                    {/* <Empty text={getIntlText('setting.integration.ai_model_param_input_tip')} /> */}
                    <div className="result-main">
                        <div className="result-main-header">
                            <div className="result-main-header-title">
                                {getIntlText('common.label.result')}
                            </div>
                            <ToggleRadio
                                value={resultType}
                                options={resultOptions}
                                onChange={val => setResultType(val as ResultType)}
                            />
                            <div className="result-main-header-action">
                                {resultType === 'image' && (
                                    <IconButton
                                        onClick={() => {
                                            // TODO: Generate file name and download image
                                            xhrDownload({
                                                assets: 'http://192.168.43.48:9000/beaver-iot-resource/beaver-iot-public/abc856a0-5d17-46e3-bdd3-26b3aa7ec343-20200108-213609-uqZwL.jpg',
                                                fileName: 'ai-test-result',
                                            });
                                        }}
                                    >
                                        <SaveAltIcon />
                                    </IconButton>
                                )}
                                <IconButton onClick={() => handleCopy}>
                                    <ContentCopyIcon />
                                </IconButton>
                            </div>
                        </div>
                        {resultType === 'image' && (
                            <div className="result-main-content result-main-image">
                                <ImageAnnotation
                                    imgSrc="http://192.168.43.48:9000/beaver-iot-resource/beaver-iot-public/abc856a0-5d17-46e3-bdd3-26b3aa7ec343-20200108-213609-uqZwL.jpg"
                                    points={points}
                                    containerWidth={800 - 40}
                                    containerHeight={643 - 40}
                                    onPointsChange={setPoints}
                                />
                            </div>
                        )}
                        {resultType === 'json' && (
                            <div className="result-main-content result-main-code">
                                <CodeEditor
                                    readOnly
                                    value={`{\n    "a": "aa",\n    "b": "bb",\n    "c": "cc"\n}`}
                                    editable={false}
                                    renderHeader={() => null}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default React.memo(TestModal);
