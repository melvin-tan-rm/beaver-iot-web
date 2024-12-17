import { useRef, useState, useEffect } from 'react';
import { useI18n } from '@milesight/shared/src/hooks';
import { Modal, Form } from '@milesight/shared/src/components';
import { TableRowDataType } from '../../hooks/useColumns';
import useForm from './useForm';

interface ConfigPluginProps {
    onCancel: () => void;
    onOk: (data: TableRowDataType) => void;
}

const AddEntity = (props: ConfigPluginProps) => {
    const { getIntlText } = useI18n();
    const { onOk, onCancel } = props;
    const [formValues, setFormValues] = useState<Record<string, any>>({});
    const formRef = useRef<any>();
    const formValuesRef = useRef<Record<string, any>>({});

    const setFormValuesRef = (values: Record<string, any>) => {
        formValuesRef.current = { ...values };
    };

    const formItems = useForm({
        formValues,
        preFormValues: { ...formValuesRef.current },
        setPreFormValues: setFormValuesRef,
    });

    const handleClose = () => {
        onCancel();
    };

    const handleOk = () => {
        formRef.current?.handleSubmit();
    };

    // Form submission
    const handleSubmit = (values: TableRowDataType) => {
        console.log(values);
        // onOk(values);
    };

    const handleChange = (values: any) => {
        setFormValues(values);
    };

    return (
        <Modal
            visible
            onCancel={handleClose}
            onOk={handleOk}
            onOkText={getIntlText('common.label.create')}
            title={getIntlText('entity.label.create_entity_only')}
            size="lg"
        >
            <Form<TableRowDataType>
                ref={formRef}
                formItems={formItems}
                onOk={handleSubmit}
                onChange={handleChange}
            />
        </Modal>
    );
};

export default AddEntity;
