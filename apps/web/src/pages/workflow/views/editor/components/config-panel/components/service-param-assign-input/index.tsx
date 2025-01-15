import { useCallback, useState, useMemo } from 'react';
import { useControllableValue, useDebounceEffect } from 'ahooks';
import { Divider, IconButton } from '@mui/material';
import { useI18n, useStoreShallow } from '@milesight/shared/src/hooks';
import { HelpIcon } from '@milesight/shared/src/components';
import { useEntityApi } from '@/plugin/hooks';
import { Tooltip, Empty, useEntityStore } from '@/components';
import ParamInputSelect from '../param-input-select';
import EntitySelect, { type EntityFilterParams } from '../entity-select';
import { DEFAULT_BOOLEAN_DATA_ENUMS } from '../../../../constants';
import './style.less';

type InputParamListType = {
    key: ApiKey;
    name: string;
    type: EntityValueDataType;
    enums?: Record<string, any>;
};

type ServiceParamAssignInputValueType = {
    serviceEntity?: ApiKey;
    serviceParams: Record<string, string | boolean | undefined>;
};

type ServiceParamAssignInputProps = {
    required?: boolean;
    disabled?: boolean;
    helperText?: string;
    value?: ServiceParamAssignInputValueType;
    defaultValue?: ServiceParamAssignInputValueType;
    onChange?: (value: ServiceParamAssignInputValueType) => void;
    filterModel?: EntityFilterParams;
};

const ServiceParamAssignInput: React.FC<ServiceParamAssignInputProps> = ({
    required,
    disabled,
    helperText,
    filterModel = { type: ['SERVICE'], excludeChildren: true },
    ...props
}) => {
    const { getIntlText } = useI18n();
    const [innerValue, setInnerValue] =
        useControllableValue<ServiceParamAssignInputValueType>(props);

    const handleEntityChange = useCallback(
        (key?: ApiKey) => {
            setInnerValue(value => {
                return {
                    ...value,
                    serviceEntity: key,
                    serviceParams: {},
                };
            });
        },
        [setInnerValue],
    );

    // ---------- Render Sub Entity ----------
    const { getEntityChildren } = useEntityApi();
    const { entityList } = useEntityStore(useStoreShallow(['entityList']));
    const [subEntityList, setSubEntityList] = useState<InputParamListType[]>([]);
    const handleSubEntityChange = useCallback(
        (key: ApiKey, value?: string | boolean) => {
            setInnerValue(data => {
                const params = { ...data?.serviceParams };
                params[key] = value;
                return {
                    ...data,
                    serviceParams: params,
                };
            });
        },
        [setInnerValue],
    );

    const renderInputParams = useMemo(() => {
        const serviceParams = innerValue?.serviceParams;

        return (
            <div className="ms-service-param-assign-input">
                {!subEntityList.length ? (
                    <Empty size="small" text={getIntlText('common.label.empty')} />
                ) : (
                    subEntityList.map(item => {
                        return (
                            <div key={item.key} className="param-item">
                                <div className="param-item-title">
                                    <span className="param-item-name">{item.name}</span>
                                    <span className="param-item-type">{item.type}</span>
                                </div>
                                <ParamInputSelect
                                    required={required}
                                    valueType={item.type}
                                    enums={item.enums}
                                    value={serviceParams?.[item.key]}
                                    onChange={data => {
                                        handleSubEntityChange(item.key, data);
                                    }}
                                />
                            </div>
                        );
                    })
                )}
            </div>
        );
    }, [subEntityList, innerValue, required, getIntlText, handleSubEntityChange]);

    useDebounceEffect(
        () => {
            const serviceEntity = innerValue?.serviceEntity;
            const entity = entityList?.find(item => item.entity_key === serviceEntity);

            if (!serviceEntity || !entity) return;

            const getSubEntityList = async () => {
                const { error, res } = await getEntityChildren({
                    id: entity.entity_id,
                });

                if (error) return;
                const list = res.map((item: EntityData) => {
                    const type = item.entity_value_type;
                    const enums =
                        item.entity_value_attribute?.enum ||
                        (type !== 'BOOLEAN'
                            ? undefined
                            : DEFAULT_BOOLEAN_DATA_ENUMS.reduce(
                                  (acc, item) => {
                                      acc[item.key] = getIntlText(item.labelIntlKey);
                                      return acc;
                                  },
                                  {} as Record<string, any>,
                              ));
                    return {
                        key: item.entity_key,
                        name: item.entity_name,
                        type,
                        enums,
                    };
                });
                setSubEntityList(list);
            };

            getSubEntityList();
        },
        [innerValue?.serviceEntity, entityList, getEntityChildren],
        { wait: 300 },
    );

    return (
        <div className="ms-service-invocation-setting">
            <EntitySelect
                label={getIntlText('common.label.service')}
                filterModel={filterModel}
                value={innerValue?.serviceEntity || ''}
                onChange={handleEntityChange}
            />
            <Divider className="ms-divider" />
            <div className="ms-node-form-group-title">
                {getIntlText('workflow.node.input_variables')}
                <Tooltip title={helperText || getIntlText('workflow.node.service_helper_text')}>
                    <IconButton size="small">
                        <HelpIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                </Tooltip>
            </div>
            {renderInputParams}
        </div>
    );
};

export default ServiceParamAssignInput;
