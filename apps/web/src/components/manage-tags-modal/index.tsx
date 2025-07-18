import React, { useEffect } from 'react';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { useMemoizedFn } from 'ahooks';
import classNames from 'classnames';
import { isEmpty } from 'lodash-es';

import { Modal, type ModalProps } from '@milesight/shared/src/components';
import { useI18n } from '@milesight/shared/src/hooks';

import { TagOperationEnums } from '@/services/http';
import { useFormItems, useEntityOptions } from './hooks';
import Tag from '../tag';

import styles from './style.module.less';

export interface ManageTagsProps {
    action: TagOperationEnums;
    tags: ApiKey[];
    originalTag: ApiKey;
    replaceTag: ApiKey;
}

interface Props extends Omit<ModalProps, 'onOk'> {
    /**
     * selected entity data
     */
    selectedEntities?: ObjectToCamelCase<EntityData>[];
    /** tip info */
    tip?: string;
    /** on form submit */
    onFormSubmit: (params: ManageTagsProps, callback: () => void) => Promise<void>;
}

/**
 * Manage tag Modal
 */
const ManageTagsModal: React.FC<Props> = props => {
    const { visible, selectedEntities, tip, onCancel, onFormSubmit, ...restProps } = props;

    const { getIntlText } = useI18n();
    const { control, formState, handleSubmit, reset, watch, setValue } = useForm<ManageTagsProps>();
    const { entityOptions } = useEntityOptions(selectedEntities);

    const currentAction = watch('action');

    const { formItems } = useFormItems({
        currentAction,
        entityOptions,
    });

    /**
     * When action changed
     * initial value
     */
    useEffect(() => {
        if (!currentAction) {
            return;
        }

        setValue('tags', []);
        setValue('originalTag', '');
        setValue('replaceTag', '');
    }, [currentAction, setValue]);

    const onSubmit: SubmitHandler<ManageTagsProps> = async params => {
        await onFormSubmit(params, () => {
            reset();
        });
    };

    const handleCancel = useMemoizedFn(() => {
        reset();
        onCancel?.();
    });

    const renderTags = () => {
        if (!Array.isArray(entityOptions) || isEmpty(entityOptions)) {
            return <div className={styles.tags}>{getIntlText('tag.tip.not_any_tags')}</div>;
        }

        return (
            <div className={styles['entity-tags-wrapper']}>
                {entityOptions.map(tag => (
                    <Tag
                        key={tag.id}
                        label={tag.name}
                        arbitraryColor={tag.color}
                        tip={tag.description}
                    />
                ))}
            </div>
        );
    };

    return (
        <Modal
            visible={visible}
            size="lg"
            title={getIntlText('tag.title.manage_tags')}
            className={classNames(styles['manage-tags-modal'], { loading: formState.isSubmitting })}
            onOk={handleSubmit(onSubmit)}
            onCancel={handleCancel}
            {...restProps}
        >
            <div className={styles.alert}>
                {tip && <div className={styles.msg}>{tip}</div>}
                {renderTags()}
            </div>

            {formItems.map(item => (
                <Controller<ManageTagsProps> {...item} key={item.name} control={control} />
            ))}
        </Modal>
    );
};

export default ManageTagsModal;
