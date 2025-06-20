import React from 'react';
import { TextField, IconButton } from '@mui/material';
import { useI18n } from '@milesight/shared/src/hooks';
import { DeleteOutlineIcon } from '@milesight/shared/src/components';
import './style.less';

type ResultSettingItem = {
    /** Parameter Name */
    name: string;
    /** Entity Name */
    entityName?: string;
    /** Entity ID */
    entityId: ApiKey;
    /** Entity Value Type */
    entityValueType: EntityValueDataType;
};

interface Props {
    data: null | { title: string; params: ResultSettingItem[] }[];

    onChange: (data: Props['data']) => void;
}

const ResultSetting: React.FC<Props> = ({ data, onChange }) => {
    const { getIntlText } = useI18n();

    return (
        <div className="ms-com-ai-result-setting-root">
            {data?.map(({ title, params }, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <div className="result-setting-item" key={index}>
                    <div className="result-setting-item-header">
                        <span className="title">
                            {getIntlText('setting.integration.ai_infer_result_area_setting', {
                                1: title,
                            })}
                        </span>
                        <IconButton>
                            <DeleteOutlineIcon />
                        </IconButton>
                    </div>
                    <div className="result-setting-item-body">
                        {params.map(param => (
                            <div className="params-item" key={param.entityId}>
                                <TextField
                                    disabled
                                    fullWidth
                                    value={param.name}
                                    label={getIntlText('common.label.param_name')}
                                    slotProps={{ input: { size: 'small' } }}
                                />
                                <TextField
                                    fullWidth
                                    autoComplete="off"
                                    value={param.entityName}
                                    label={getIntlText('device.label.param_entity_name')}
                                    slotProps={{ input: { size: 'small' } }}
                                />
                                <TextField
                                    disabled
                                    fullWidth
                                    value={param.entityId}
                                    label={getIntlText('device.label.param_entity_id')}
                                    slotProps={{ input: { size: 'small' } }}
                                />
                                <TextField
                                    disabled
                                    fullWidth
                                    value={param.entityValueType}
                                    label={getIntlText('common.label.entity_type')}
                                    slotProps={{ input: { size: 'small' } }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ResultSetting;
