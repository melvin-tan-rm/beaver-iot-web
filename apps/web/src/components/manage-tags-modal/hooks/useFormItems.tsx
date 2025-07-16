import { useMemo } from 'react';
import { type ControllerProps } from 'react-hook-form';

import { useI18n } from '@milesight/shared/src/hooks';
import { checkRequired } from '@milesight/shared/src/utils/validators';
import { Select } from '@milesight/shared/src/components';

import { TagOperationEnums } from '@/services/http';
import { type ManageTagsProps } from '../index';

export function useFormItems() {
    const { getIntlText } = useI18n();

    const formItems: ControllerProps<ManageTagsProps>[] = useMemo(() => {
        return [
            {
                name: 'action',
                rules: {
                    maxLength: {
                        value: 127,
                        message: getIntlText('valid.input.max_length', {
                            1: 127,
                        }),
                    },
                    validate: {
                        checkRequired: checkRequired(),
                    },
                },
                defaultValue: TagOperationEnums.ADD,
                render({ field: { onChange, value }, fieldState: { error } }) {
                    return (
                        <Select
                            required
                            fullWidth
                            options={[
                                {
                                    label: getIntlText('tag.label.append_tag'),
                                    value: TagOperationEnums.ADD,
                                },
                                {
                                    label: getIntlText('tag.label.overwrite_tag'),
                                    value: TagOperationEnums.OVERWRITE,
                                },
                                {
                                    label: getIntlText('tag.label.remove_tag'),
                                    value: TagOperationEnums.REMOVE,
                                },
                                {
                                    label: getIntlText('tag.label.replace_tag'),
                                    value: TagOperationEnums.REPLACE,
                                },
                            ]}
                            label={getIntlText('common.label.action')}
                            error={error}
                            value={value as ApiKey}
                            onChange={onChange}
                        />
                    );
                },
            },
        ];
    }, [getIntlText]);

    return {
        formItems,
    };
}
