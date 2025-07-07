import React, { useEffect } from 'react';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { useMemoizedFn } from 'ahooks';
import classNames from 'classnames';

import { Modal, type ModalProps, LoadingWrapper } from '@milesight/shared/src/components';
import { useI18n } from '@milesight/shared/src/hooks';

import { type FileValueType } from '@/components';
import { useFormItems } from './hooks';
import { BatchAddProgress } from './components';

export type BatchAddStatus = 'beforeAdd' | 'adding';

export interface BatchAddProps {
    integration: ApiKey;
    uploadFile: FileValueType;
}

interface Props extends Omit<ModalProps, 'onOk'> {
    /**
     * Batch add status
     */
    status?: BatchAddStatus;
    /** on form submit */
    onFormSubmit: (params: BatchAddProps, callback: () => void) => Promise<void>;
}

/**
 * Batch add Modal
 */
const BatchAddModal: React.FC<Props> = props => {
    const { visible, onCancel, status = 'beforeAdd', onFormSubmit, ...restProps } = props;

    const { getIntlText } = useI18n();
    const { control, formState, handleSubmit, reset, setValue } = useForm<BatchAddProps>();
    const { firstIntegrationId, loadingIntegrations, formItems } = useFormItems();

    useEffect(() => {
        setValue('integration', firstIntegrationId || '');
    }, [setValue, firstIntegrationId]);

    const onSubmit: SubmitHandler<BatchAddProps> = async params => {
        await onFormSubmit(params, () => {
            reset();
        });
    };

    const handleCancel = useMemoizedFn(() => {
        reset();
        onCancel?.();
    });

    const renderBody = () => {
        if (status === 'beforeAdd') {
            return (
                <LoadingWrapper loading={loadingIntegrations}>
                    {formItems.map(item => (
                        <Controller<BatchAddProps> {...item} key={item.name} control={control} />
                    ))}
                </LoadingWrapper>
            );
        }

        if (status === 'adding') {
            return <BatchAddProgress />;
        }

        return null;
    };

    return (
        <Modal
            size="lg"
            visible={visible}
            title={getIntlText('device.label.batch_add_device')}
            className={classNames({ loading: formState.isSubmitting })}
            onOk={handleSubmit(onSubmit)}
            okButtonProps={{
                disabled: loadingIntegrations,
            }}
            onCancel={handleCancel}
            {...restProps}
        >
            {renderBody()}
        </Modal>
    );
};

export default BatchAddModal;
