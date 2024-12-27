import React, { useMemo, useEffect } from 'react';
import { useForm, Controller, type SubmitHandler, type ControllerProps } from 'react-hook-form';
import { useMemoizedFn } from 'ahooks';
import { TextField } from '@mui/material';
import classNames from 'classnames';

import { Modal, type ModalProps } from '@milesight/shared/src/components';
import { userNameChecker } from '@milesight/shared/src/utils/validators';
import { useI18n } from '@milesight/shared/src/hooks';

interface Props extends Omit<ModalProps, 'onOk'> {
    data?: string;
    /** on form submit */
    onFormSubmit: (name: string) => Promise<void>;
}

export interface AddUserProps {
    username: string;
}

/**
 * add user Modal
 */
const AddUserModal: React.FC<Props> = props => {
    const { visible, onCancel, onFormSubmit, data, ...restProps } = props;

    const { getIntlText } = useI18n();
    const { control, formState, handleSubmit, reset, setValue } = useForm<AddUserProps>();

    const formItems: ControllerProps<AddUserProps>[] = useMemo(() => {
        return [
            {
                name: 'username',
                rules: {
                    validate: { userNameChecker: userNameChecker().checkUsername },
                },
                defaultValue: '',
                render({ field: { onChange, value }, fieldState: { error } }) {
                    return (
                        <TextField
                            required
                            fullWidth
                            type="text"
                            label={getIntlText('user.label.user_name_table_title')}
                            error={!!error}
                            helperText={error ? error.message : null}
                            value={value}
                            onChange={onChange}
                        />
                    );
                },
            },
        ];
    }, [getIntlText]);

    const onSubmit: SubmitHandler<AddUserProps> = async params => {
        await onFormSubmit(params.username);

        reset();
    };

    const handleCancel = useMemoizedFn(() => {
        reset();
        onCancel?.();
    });

    /**
     * initial form value
     */
    useEffect(() => {
        if (visible) {
            setValue('username', data || '');
        }
    }, [data, visible, setValue]);

    const renderModal = () => {
        if (visible) {
            return (
                <Modal
                    visible={visible}
                    title={getIntlText('common.label.add')}
                    className={classNames({ loading: formState.isSubmitting })}
                    onOk={handleSubmit(onSubmit)}
                    onCancel={handleCancel}
                    {...restProps}
                >
                    {formItems.map(item => (
                        <Controller<AddUserProps> {...item} key={item.name} control={control} />
                    ))}
                </Modal>
            );
        }

        return null;
    };

    return renderModal();
};

export default AddUserModal;
