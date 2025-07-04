import React, { useMemo } from 'react';
import { useForm, Controller, type SubmitHandler, type ControllerProps } from 'react-hook-form';
import { useMemoizedFn } from 'ahooks';
import classNames from 'classnames';

import { Modal, type ModalProps, Select } from '@milesight/shared/src/components';
import { checkRequired } from '@milesight/shared/src/utils/validators';
import { useI18n } from '@milesight/shared/src/hooks';

export interface ChangeGroupProps {
    group: ApiKey;
}

interface Props extends Omit<ModalProps, 'onOk'> {
    /** on form submit */
    onFormSubmit: (params: ChangeGroupProps, callback: () => void) => Promise<void>;
}

/**
 * change group Modal
 */
const ChangeGroupModal: React.FC<Props> = props => {
    const { visible, onCancel, onFormSubmit, ...restProps } = props;

    const { getIntlText } = useI18n();
    const { control, formState, handleSubmit, reset } = useForm<ChangeGroupProps>();

    const formItems: ControllerProps<ChangeGroupProps>[] = useMemo(() => {
        return [
            {
                name: 'group',
                rules: {
                    validate: {
                        checkRequired: checkRequired(),
                    },
                },
                defaultValue: '',
                render({ field: { onChange, value }, fieldState: { error } }) {
                    return (
                        <Select
                            required
                            fullWidth
                            options={[
                                { label: 'SIM1-APN1', value: '1' },
                                { label: 'WAN', value: '2' },
                            ]}
                            label={getIntlText('device.label.device_group')}
                            error={error}
                            value={value}
                            onChange={onChange}
                        />
                    );
                },
            },
        ];
    }, [getIntlText]);

    const onSubmit: SubmitHandler<ChangeGroupProps> = async params => {
        await onFormSubmit(params, () => {
            reset();
        });
    };

    const handleCancel = useMemoizedFn(() => {
        reset();
        onCancel?.();
    });

    return (
        <Modal
            visible={visible}
            title={getIntlText('device.label.change_device_group')}
            className={classNames({ loading: formState.isSubmitting })}
            onOk={handleSubmit(onSubmit)}
            onCancel={handleCancel}
            {...restProps}
        >
            {formItems.map(item => (
                <Controller<ChangeGroupProps> {...item} key={item.name} control={control} />
            ))}
        </Modal>
    );
};

export default ChangeGroupModal;
