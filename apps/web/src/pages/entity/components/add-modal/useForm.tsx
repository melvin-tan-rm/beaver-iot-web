import { useEffect, useState, useRef } from 'react';
import { ToggleButtonGroup, ToggleButton, Button } from '@mui/material';
import { useI18n } from '@milesight/shared/src/hooks';
import { UseFormItemsProps } from '@milesight/shared/src/components';

interface FormProps {
    preFormValues: Record<string, any>;
    formValues: Record<string, any>;
    setPreFormValues: (data: Record<string, any>) => void;
}

type ModeType = 'value' | 'enum';

const useForm = (props: FormProps) => {
    const { preFormValues, formValues, setPreFormValues } = props;
    const { getIntlText } = useI18n();
    const [formItems, setFormItems] = useState<UseFormItemsProps[]>([]);
    const [mode, setMode] = useState<ModeType>('value');
    const formItemsRef = useRef<UseFormItemsProps[]>([]);

    // Initial form configuration
    const initFormItems: UseFormItemsProps[] = [
        {
            label: getIntlText('device.label.param_entity_name'),
            name: 'entityName',
            type: 'TextField',
            rules: {
                required: true,
                maxLength: {
                    value: 64,
                    message: '',
                },
            },
        },
        {
            label: getIntlText('entity.label.entity_type_of_access'),
            name: 'entityAccessMod',
            type: 'Select',
            rules: {
                required: true,
            },
            props: {
                options: [
                    {
                        label: getIntlText('entity.label.entity_type_of_access_readonly'),
                        value: 'r',
                    },
                    {
                        label: getIntlText('entity.label.entity_type_of_access_write'),
                        value: 'w',
                    },
                ],
            },
        },
        {
            label: getIntlText('common.label.data_type'),
            name: 'entityValueType',
            type: 'Select',
            rules: {
                required: true,
            },
            props: {
                componentProps: {
                    fullWidth: true,
                },
                options: [
                    {
                        label: getIntlText('entity.label.entity_type_of_string'),
                        value: 'string',
                    },
                    {
                        label: getIntlText('entity.label.entity_type_of_int'),
                        value: 'int',
                    },
                    {
                        label: getIntlText('entity.label.entity_type_of_boolean'),
                        value: 'boolean',
                    },
                    {
                        label: getIntlText('entity.label.entity_type_of_enum'),
                        value: 'enum',
                    },
                ],
            },
        },
    ];

    const handleChangeMode = (_event: React.MouseEvent<HTMLElement>, value: ModeType) => {
        if (value !== null) {
            setMode(value);
        }
    };

    // Render mode switch component
    const renderButtonGroup = () => {
        return (
            <ToggleButtonGroup
                size="small"
                value={mode}
                exclusive
                onChange={handleChangeMode}
                className="entity-modal-button-group"
                fullWidth
            >
                <ToggleButton value="value">Set Value</ToggleButton>
                <ToggleButton value="enum">Set Enumeration Items</ToggleButton>
            </ToggleButtonGroup>
        );
    };

    // Click event for adding a new form button
    const addFormItem = () => {
        const newFormItems = [...formItemsRef.current];
        const childrenLength = newFormItems?.[newFormItems.length - 1]?.children?.length || 0;
        const initAddFormItem: UseFormItemsProps[] = [
            {
                label: getIntlText('common.label.key'),
                name: `key_${childrenLength - 1}`,
                type: 'TextField',
                rules: {
                    required: true,
                },
            },
            {
                label: getIntlText('common.label.value'),
                name: `value_${childrenLength - 1}`,
                type: 'TextField',
                rules: {
                    required: true,
                },
            },
        ];
        newFormItems[newFormItems.length - 1].children?.splice(
            childrenLength - 1,
            0,
            ...(initAddFormItem as any),
        );
        setFormItems(newFormItems);
    };

    const addButton = () => {
        return (
            <Button variant="outlined" fullWidth onClick={addFormItem}>
                {getIntlText('common.label.add')}
            </Button>
        );
    };

    // Switch mode and re-render the form
    const renderModeToForm = () => {
        if (mode === 'value') {
            return [
                {
                    label:
                        formValues.entityValueType === 'int'
                            ? getIntlText('entity.label.entity_maximum_value')
                            : getIntlText('entity.label.entity_maximum_length'),
                    name: formValues.entityValueType === 'int' ? 'maxValue' : 'maxLength',
                    type: 'TextField',
                    rules: {
                        required: true,
                    },
                },
                {
                    label:
                        formValues.entityValueType === 'int'
                            ? getIntlText('entity.label.entity_minimum_value')
                            : getIntlText('entity.label.entity_minimum_length'),
                    name: formValues.entityValueType === 'int' ? 'minValue' : 'minLength',
                    type: 'TextField',
                    rules: {
                        required: true,
                    },
                },
            ];
        }
        return [
            {
                label: getIntlText('entity.label.entity_items'),
                name: '',
                type: '',
                children: [
                    {
                        label: getIntlText('common.label.key'),
                        name: 'key_1',
                        type: 'TextField',
                        rules: {
                            required: true,
                        },
                    },
                    {
                        label: getIntlText('common.label.value'),
                        name: 'value_1',
                        type: 'TextField',
                        rules: {
                            required: true,
                        },
                    },
                    {
                        label: '',
                        name: '',
                        type: '',
                        customRender: () => {
                            return addButton();
                        },
                    },
                ],
            },
        ];
    };

    const getFormItems = (type: string): any[] => {
        switch (type) {
            case 'int':
            case 'string':
                return [
                    ...initFormItems,
                    {
                        label: '',
                        name: '',
                        customRender: () => {
                            return renderButtonGroup();
                        },
                    },
                    ...renderModeToForm(),
                ];
            default:
                return initFormItems;
        }
    };

    useEffect(() => {
        if (
            preFormValues.entityValueType !== formValues.entityValueType ||
            !formValues.entityValueType
        ) {
            const newFormItem = getFormItems(formValues.entityValueType);
            setFormItems(newFormItem);
            setPreFormValues(formValues);
        }
    }, [formValues]);

    useEffect(() => {
        const newFormItem = getFormItems(formValues.entityValueType);
        setFormItems(newFormItem);
    }, [mode]);

    useEffect(() => {
        formItemsRef.current = [...formItems];
        console.log(formItemsRef.current);
    }, [formItems]);

    return formItems;
};

export default useForm;
