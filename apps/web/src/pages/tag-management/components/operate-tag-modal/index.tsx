import React, { useEffect } from 'react';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { useMemoizedFn } from 'ahooks';
import classNames from 'classnames';
import { Grid2 as Grid } from '@mui/material';

import { useI18n } from '@milesight/shared/src/hooks';
import { Modal, type ModalProps } from '@milesight/shared/src/components';

import { useFormItems } from './hooks';

export type OperateModalType = 'add' | 'edit';

export interface OperateTagProps {
    name: string;
    color: string;
    description: string;
}

interface Props extends Omit<ModalProps, 'onOk'> {
    operateType: OperateModalType;
    /** on form submit */
    onFormSubmit: (data: OperateTagProps, callback: () => void) => Promise<void>;
    data?: OperateTagProps;
}

/**
 * operate user Modal
 */
const OperateUserModal: React.FC<Props> = props => {
    const { visible, onCancel, onFormSubmit, data, operateType, ...restProps } = props;

    const { getIntlText } = useI18n();

    const { control, formState, handleSubmit, reset, setValue } = useForm<OperateTagProps>();
    const { formItems } = useFormItems();

    const onSubmit: SubmitHandler<OperateTagProps> = async params => {
        await onFormSubmit(params, () => {
            reset();
        });
    };

    const handleCancel = useMemoizedFn(() => {
        reset();
        onCancel?.();
    });

    /**
     * initial form value
     */
    useEffect(() => {
        if (operateType !== 'edit') {
            return;
        }

        Object.entries(data || {}).forEach(([k, v]) => {
            setValue(k as keyof OperateTagProps, v);
        });
    }, [data, setValue, operateType]);

    return (
        <Modal
            visible={visible}
            className={classNames({ loading: formState.isSubmitting })}
            onOk={handleSubmit(onSubmit)}
            onOkText={getIntlText('common.button.save')}
            onCancel={handleCancel}
            {...restProps}
        >
            <Grid container spacing={1}>
                {formItems.map(({ wrapCol, ...restItem }) => (
                    <Grid key={restItem.name} size={wrapCol}>
                        <Controller<OperateTagProps> {...restItem} control={control} />
                    </Grid>
                ))}
            </Grid>
        </Modal>
    );
};

export default OperateUserModal;
