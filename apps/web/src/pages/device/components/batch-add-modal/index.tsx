import React, { useMemo, useEffect } from 'react';
import { useForm, Controller, type SubmitHandler, type ControllerProps } from 'react-hook-form';
import { useMemoizedFn } from 'ahooks';
import classNames from 'classnames';
import { Button, Grid2 as Grid } from '@mui/material';

import {
    Modal,
    type ModalProps,
    Select,
    LoadingWrapper,
    DownloadIcon,
} from '@milesight/shared/src/components';
import { checkRequired } from '@milesight/shared/src/utils/validators';
import { useI18n } from '@milesight/shared/src/hooks';

import { Upload, type FileValueType } from '@/components';
import { useGetIntegration } from '../../hooks';

export interface BatchAddProps {
    integration: ApiKey;
    uploadFile: FileValueType;
}

interface Props extends Omit<ModalProps, 'onOk'> {
    /** on form submit */
    onFormSubmit: (params: BatchAddProps, callback: () => void) => Promise<void>;
}

/**
 * Batch add Modal
 */
const BatchAddModal: React.FC<Props> = props => {
    const { visible, onCancel, onFormSubmit, ...restProps } = props;

    const { getIntlText } = useI18n();
    const { control, formState, handleSubmit, reset, setValue } = useForm<BatchAddProps>();
    const { integrationList, firstIntegrationId, loadingIntegrations } = useGetIntegration();

    useEffect(() => {
        setValue('integration', firstIntegrationId || '');
    }, [setValue, firstIntegrationId]);

    const formItems: ControllerProps<BatchAddProps>[] = useMemo(() => {
        return [
            {
                name: 'integration',
                rules: {
                    validate: {
                        checkRequired: checkRequired(),
                    },
                },
                defaultValue: '',
                render({ field: { onChange, value }, fieldState: { error } }) {
                    return (
                        <Grid container spacing={1} sx={{ marginBottom: '16px' }}>
                            <Grid size="grow">
                                <Select
                                    required
                                    fullWidth
                                    options={(integrationList || [])?.map(i => ({
                                        label: i.name,
                                        value: i.id,
                                    }))}
                                    label={getIntlText('common.label.integration')}
                                    error={error}
                                    value={value as ApiKey}
                                    onChange={onChange}
                                />
                            </Grid>
                            <Grid
                                size="auto"
                                sx={{
                                    display: 'flex',
                                    alignItems: 'flex-end',
                                }}
                            >
                                <Button
                                    variant="outlined"
                                    className="md:d-none"
                                    sx={{ height: 36, textTransform: 'none' }}
                                    startIcon={<DownloadIcon />}
                                    onClick={() => console.log('download template')}
                                >
                                    {getIntlText('common.label.download_template')}
                                </Button>
                            </Grid>
                        </Grid>
                    );
                },
            },
            {
                name: 'uploadFile',
                rules: {
                    validate: {
                        checkRequired: checkRequired(),
                    },
                },
                render({ field: { onChange, value }, fieldState: { error } }) {
                    return (
                        <Upload
                            required
                            label={getIntlText('common.label.upload_file')}
                            value={value as FileValueType}
                            onChange={onChange}
                            error={error}
                            accept={{
                                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                                    ['.xlsx'],
                            }}
                        />
                    );
                },
            },
        ];
    }, [getIntlText, integrationList]);

    const onSubmit: SubmitHandler<BatchAddProps> = async params => {
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
            size="lg"
            visible={visible}
            title={getIntlText('device.label.batch_add_device')}
            className={classNames({ loading: formState.isSubmitting })}
            onOk={handleSubmit(onSubmit)}
            onCancel={handleCancel}
            {...restProps}
        >
            <LoadingWrapper loading={loadingIntegrations}>
                {formItems.map(item => (
                    <Controller<BatchAddProps> {...item} key={item.name} control={control} />
                ))}
            </LoadingWrapper>
        </Modal>
    );
};

export default BatchAddModal;
