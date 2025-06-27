import React, { useMemo, useEffect, useState } from 'react';
import { Button, IconButton, CircularProgress } from '@mui/material';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { useI18n, useCopy } from '@milesight/shared/src/hooks';
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
    type PointType,
} from '@/components';
import { useEntityFormItems, IMAGE_ENTITY_KEYWORD, type EntityFormDataProps } from '@/hooks';
import { entityAPI, awaitWrap, isRequestSuccess, getResponseData } from '@/services/http';
import { type InteEntityType } from '../../../../hooks';
import './style.less';

interface Props extends Omit<ModalProps, 'onOk'> {
    /** AI model name */
    modelName?: string;

    /** Entity list that used to generate form items */
    entities?: InteEntityType[];
}

type ResultType = 'image' | 'json';

type InferCoordinate = [number, number, number, number];

type InferenceResponse = {
    outputs: {
        data: {
            /* Image file name */
            file_name: string;
            detections: {
                /** Identify label */
                cls: string;
                /** Confidence level */
                conf: number;
                /**
                 * Rectangle coordinate [x_min, y_min, width, height]
                 */
                box?: InferCoordinate;
                /**
                 * Polygon coordinate [x, y][]
                 */
                masks?: [number, number][];
                /**
                 * Points of skeleton [x, y, pointId, conf][]
                 */
                points?: InferCoordinate[];
                /**
                 * Skeleton structure [startPointId, endPointId][]
                 */
                skeleton?: [number, number][];
            }[];
        }[];
    };
};

const DEFAULT_RESULT_TYPE: ResultType = 'image';
const resultOptionConfigs: {
    labelIntlKey: string;
    value: ResultType;
}[] = [
    { labelIntlKey: 'common.label.image', value: 'image' },
    { labelIntlKey: 'common.label.json', value: 'json' },
];

const TestModal: React.FC<Props> = ({ modelName, entities, visible, onCancel, ...props }) => {
    const { getIntlText, getIntlHtml, mergeIntlText } = useI18n();

    // ---------- Render dynamic form items ----------
    const { control, formState, handleSubmit, reset } = useForm<EntityFormDataProps>();
    const { formItems, decodeFormParams } = useEntityFormItems({ entities });
    const isLoading = formState.isSubmitting;

    const onSubmit: SubmitHandler<EntityFormDataProps> = async params => {
        const finalParams = decodeFormParams(params);

        if (!finalParams) {
            console.warn(`params is empty, the origin params is ${JSON.stringify(params)}`);
            return;
        }

        setOutput(null);
        setOriginalImageUrl(null);
        const [error, resp] = await awaitWrap(entityAPI.callService({ exchange: finalParams }));

        if (error || !isRequestSuccess(resp)) return;
        const result = getResponseData(resp) as InferenceResponse;
        const imageEntity = entities?.find(entity =>
            entity.valueAttribute.format?.includes(IMAGE_ENTITY_KEYWORD),
        );
        const imageUrl = finalParams[imageEntity?.key || ''];

        setOutput(result?.outputs?.data);
        setOriginalImageUrl(imageUrl);
        setResultType(DEFAULT_RESULT_TYPE);
    };

    // ---------- Handle actions in header ----------
    const { handleCopy } = useCopy();
    const resultOptions = useMemo(
        () =>
            resultOptionConfigs.map(config => ({
                label: getIntlText(config.labelIntlKey),
                value: config.value,
            })),
        [getIntlText],
    );
    const [resultType, setResultType] = useState<ResultType>(DEFAULT_RESULT_TYPE);
    const copyTip = useMemo(() => {
        switch (resultType) {
            case 'image':
                return mergeIntlText(['common.label.copy', 'common.label.image']);
            case 'json':
                return mergeIntlText(['common.label.copy', 'common.label.json']);
            default:
                return '';
        }
    }, [resultType, mergeIntlText]);

    const handleInnerCopy = (container?: HTMLElement | null) => {
        switch (resultType) {
            case 'image':
                if (!originalImageUrl) return;
                handleCopy(originalImageUrl, container);
                break;
            case 'json':
                if (!output?.length) return;
                handleCopy(JSON.stringify(output, null, 2), container);
                break;
            default:
                break;
        }
    };

    // ---------- Render Result ----------
    const [originalImageUrl, setOriginalImageUrl] = useState<string | null>();
    const [output, setOutput] = useState<InferenceResponse['outputs']['data'] | null>();
    const [points, setPoints] = useState<PointType[]>([]);

    // Generate points when output change
    useEffect(() => {
        if (!output?.length) {
            setPoints([]);
            return;
        }
        const result: PointType[] = [];

        output.forEach(({ detections }) => {
            detections.forEach(({ cls, conf, box, masks, points, skeleton }) => {
                const data: PointType = {
                    label: cls,
                    confidence: conf,
                    value: [],
                };

                if (masks?.length) {
                    const polygon = masks.map(([x, y]) => ({ x, y }));
                    data.polygon = polygon;
                }

                if (points?.length && skeleton?.length) {
                    const pointsMap = points.reduce(
                        (acc, [x, y, id]) => {
                            acc[id] = { x, y };
                            return acc;
                        },
                        {} as Record<string, Vector2d>,
                    );
                    const lines = skeleton.reduce((acc, [startId, endId]) => {
                        const item = acc.find(it => it[it.length - 1] === startId);

                        if (item) {
                            item.push(endId);
                        } else {
                            acc.push([startId, endId]);
                        }
                        return acc;
                    }, [] as number[][]);

                    data.skeleton = lines.map(line => {
                        return line.map(id => pointsMap[id]);
                    });
                }

                if (box?.length) {
                    const [xMin, yMin, width, height] = box;
                    const points = [
                        { x: xMin, y: yMin },
                        { x: xMin + width, y: yMin },
                        { x: xMin + width, y: yMin + height },
                        { x: xMin, y: yMin + height },
                    ];
                    data.rect = points;
                    data.value = points;
                }

                result.push(data);
            });
        });

        // console.log({ result });
        setPoints(result);
    }, [output]);

    // Clear data when modal close
    useEffect(() => {
        if (visible) return;
        setOutput(null);
        setOriginalImageUrl(null);
        setResultType(DEFAULT_RESULT_TYPE);
    }, [visible]);

    // http://192.168.43.48:9000/beaver-iot-resource/beaver-iot-public/36794826-1faa-48a6-b170-dba2f9820118-somebody.jpeg
    // http://192.168.43.48:9000/beaver-iot-resource/beaver-iot-public/abc856a0-5d17-46e3-bdd3-26b3aa7ec343-20200108-213609-uqZwL.jpg
    return (
        <Modal
            {...props}
            showCloseIcon
            width="1200px"
            className="ms-test-modal"
            visible={visible}
            title={getIntlText('setting.integration.ai_infer_service_title', { 1: modelName })}
            onCancel={() => {
                reset();
                onCancel?.();
            }}
        >
            <div className="ms-test-modal-content">
                <div className="ms-test-modal-form">
                    <div className="ms-test-modal-form-items">
                        {formItems.map(props => (
                            <Controller<EntityFormDataProps>
                                {...props}
                                key={props.name}
                                control={control}
                            />
                        ))}
                    </div>
                    <Button
                        fullWidth
                        variant="contained"
                        disabled={isLoading}
                        startIcon={isLoading ? <CircularProgress size={16} /> : <AutoAwesomeIcon />}
                        onClick={handleSubmit(onSubmit)}
                    >
                        {getIntlText('setting.integration.generate_infer_result')}
                    </Button>
                </div>
                <div className="ms-test-modal-result">
                    {!output || !originalImageUrl ? (
                        <Empty text={getIntlHtml('setting.integration.ai_model_param_input_tip')} />
                    ) : (
                        <div className="result-main">
                            <div className="result-main-header">
                                <div className="result-main-header-title">
                                    {getIntlText('common.label.result')}
                                </div>
                                <ToggleRadio
                                    size="small"
                                    value={resultType}
                                    options={resultOptions}
                                    onChange={val => setResultType(val as ResultType)}
                                />
                                <div className="result-main-header-action">
                                    {resultType === 'image' && (
                                        <IconButton
                                            onClick={() => {
                                                if (!originalImageUrl) return;
                                                xhrDownload({
                                                    assets: originalImageUrl,
                                                    fileName: 'ai-inference-image',
                                                });
                                            }}
                                        >
                                            <SaveAltIcon />
                                        </IconButton>
                                    )}
                                    <Tooltip title={copyTip}>
                                        <IconButton
                                            onClick={e =>
                                                handleInnerCopy(
                                                    (e.target as HTMLElement).closest('div'),
                                                )
                                            }
                                        >
                                            <ContentCopyIcon sx={{ fontSize: 18 }} />
                                        </IconButton>
                                    </Tooltip>
                                </div>
                            </div>
                            {resultType === 'image' && (
                                <div className="result-main-content result-main-image">
                                    <ImageAnnotation
                                        imgSrc={originalImageUrl}
                                        points={points}
                                        containerWidth={800 - 40}
                                        containerHeight={643 - 40}
                                        // onPointsChange={setPoints}
                                    />
                                </div>
                            )}
                            {resultType === 'json' && (
                                <div className="result-main-content result-main-code">
                                    <CodeEditor
                                        readOnly
                                        editorLang="json"
                                        value={!output ? '' : JSON.stringify(output, null, 2)}
                                        editable={false}
                                        renderHeader={() => null}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default React.memo(TestModal);
