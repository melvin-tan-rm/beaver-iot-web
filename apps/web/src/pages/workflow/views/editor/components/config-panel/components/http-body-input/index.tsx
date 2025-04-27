import React, { useCallback } from 'react';
import { isEmpty } from 'lodash-es';
import { useControllableValue } from 'ahooks';
import { useI18n } from '@milesight/shared/src/hooks';
import { Select, type SelectProps } from '@milesight/shared/src/components';
import { safeJsonParse } from '@milesight/shared/src/utils/tools';
import DataEditor from '../data-editor';
import ParamAssignInput from '../param-assign-input';
import './style.less';

type ValueType = {
    type?: string;
    value?: string | Record<string, any>;
};

interface HttpBodyInputProps {
    label?: string;
    required?: boolean;
    value: ValueType;
    onChange: (value?: ValueType | null) => void;
}

const NONE_VALUE = '__NONE__' as const;

const contentTypeOptions: {
    label: string;
    labelIntlKey?: string;
    key?: string;
    value: HttpBodyContentType | typeof NONE_VALUE;
}[] = [
    {
        label: 'None',
        value: NONE_VALUE,
    },
    {
        label: 'x-www-form-urlencoded',
        value: 'application/x-www-form-urlencoded',
    },
    {
        label: 'JSON',
        value: 'application/json',
    },
    {
        label: 'Raw',
        value: 'text/plain',
    },
];

const HttpBodyInput: React.FC<HttpBodyInputProps> = ({ label, required, ...props }) => {
    const { getIntlText } = useI18n();
    const [data, setData] = useControllableValue<ValueType | undefined>(props);
    const handleTypeChange: NonNullable<SelectProps<string>['onChange']> = e => {
        let { value: type } = e.target;
        let value = data?.value;

        if (type === NONE_VALUE) type = '';
        switch (type) {
            case 'application/x-www-form-urlencoded':
                value =
                    typeof data?.value === 'object'
                        ? data?.value
                        : safeJsonParse(data?.value, undefined);
                break;
            case 'text/plain':
            case 'application/json':
                value =
                    typeof data?.value === 'object'
                        ? JSON.stringify(data?.value, null, 2)
                        : data?.value || '';
                break;
            default:
                value = '';
        }

        setData({ type, value });
    };

    const renderBodyComponent = useCallback(() => {
        if (!data?.type) return null;

        switch (data.type) {
            case 'application/x-www-form-urlencoded': {
                let value =
                    typeof data?.value === 'object' ? data?.value : safeJsonParse(data?.value, {});
                if (isEmpty(value)) value = { '': '' };

                return (
                    <ParamAssignInput
                        value={value}
                        onChange={value => {
                            setData({ type: data?.type, value });
                        }}
                    />
                );
            }
            case 'text/plain':
            case 'application/json': {
                const lang = data.type === 'application/json' ? 'json' : 'text';
                const value =
                    typeof data?.value === 'object'
                        ? JSON.stringify(data?.value, null, 2)
                        : data?.value || '';
                const title = contentTypeOptions.find(item => item.value === data?.type)?.label;
                const placeholder =
                    data?.type === 'application/json'
                        ? getIntlText('workflow.label.placeholder_please_enter_json')
                        : getIntlText('workflow.label.placeholder_please_enter_raw_text');

                return (
                    <DataEditor
                        lang={lang}
                        title={title}
                        placeholder={placeholder}
                        value={value}
                        onChange={value => {
                            setData({ type: data?.type, value });
                        }}
                    />
                );
            }
            default:
                return null;
        }
    }, [data, setData, getIntlText]);

    return (
        <div className="ms-http-body-input">
            <Select
                label={label || getIntlText('common.label.data_encoding_format')}
                required={required}
                options={contentTypeOptions}
                value={data?.type || NONE_VALUE}
                renderValue={value => {
                    const option = contentTypeOptions.find(item => item.value === value);
                    return option?.label;
                }}
                onChange={handleTypeChange}
            />
            {renderBodyComponent()}
        </div>
    );
};

export default HttpBodyInput;
