import { useMemo } from 'react';
import { type ControllerProps } from 'react-hook-form';
import { FormControl, Autocomplete } from '@mui/material';

import { useI18n } from '@milesight/shared/src/hooks';
import { checkRequired } from '@milesight/shared/src/utils/validators';
import { Select } from '@milesight/shared/src/components';

import { TagOperationEnums } from '@/services/http';
import { type ManageTagsProps } from '../index';
import { SelectVirtualizationList } from '../components';
import { MANAGE_ACTION } from '../constants';
import { useAutoComplete } from './useAutoComplete';

export function useFormItems(props: { currentAction: TagOperationEnums }) {
    const { currentAction = TagOperationEnums.ADD } = props || {};

    const { getIntlText } = useI18n();
    const {
        tagOptions,
        transformValue,
        handleChange,
        handleRenderOptions,
        handleRenderInput,
        handleRenderTag,
        handleIsOptionEqualToValue,
        handleGetOptionDisabled,
        handleSlots,
    } = useAutoComplete(currentAction);

    const formItems: ControllerProps<ManageTagsProps>[] = useMemo(() => {
        const results: ControllerProps<ManageTagsProps>[] = [];

        const actionItem: ControllerProps<ManageTagsProps> = {
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
                        options={MANAGE_ACTION(getIntlText)}
                        label={getIntlText('common.label.action')}
                        error={error}
                        value={value as ApiKey}
                        onChange={onChange}
                    />
                );
            },
        };

        const tagsItem: ControllerProps<ManageTagsProps> = {
            name: 'tags',
            rules: {
                validate: {
                    checkRequired: checkRequired(),
                },
            },
            defaultValue: [],
            render({ field: { onChange, value }, fieldState: { error } }) {
                return (
                    <FormControl fullWidth>
                        <Autocomplete<OptionsProps, true>
                            multiple
                            id="manage-tags"
                            size="small"
                            options={tagOptions}
                            value={transformValue(value as ApiKey[])}
                            onChange={handleChange(onChange)}
                            disableCloseOnSelect
                            disableListWrap
                            renderOption={handleRenderOptions()}
                            renderInput={handleRenderInput(error)}
                            renderTags={handleRenderTag()}
                            isOptionEqualToValue={handleIsOptionEqualToValue()}
                            getOptionDisabled={handleGetOptionDisabled(value as ApiKey[])}
                            slotProps={{
                                listbox: {
                                    component: SelectVirtualizationList,
                                },
                            }}
                            slots={handleSlots()}
                        />
                    </FormControl>
                );
            },
        };
        if (currentAction !== TagOperationEnums.REPLACE) {
            results.push(tagsItem);
        }

        const replaceItems: ControllerProps<ManageTagsProps>[] = [
            {
                name: 'originalTag',
                rules: {
                    validate: {
                        checkRequired: checkRequired(),
                    },
                },
                render({ field: { onChange, value }, fieldState: { error } }) {
                    return (
                        <Select
                            required
                            fullWidth
                            options={Array.from({ length: 3 }).map((_, index) => ({
                                label: String(index + 1),
                                value: index + 1,
                            }))}
                            label="Original Tag"
                            error={error}
                            value={value as ApiKey}
                            onChange={onChange}
                        />
                    );
                },
            },
            {
                name: 'replaceTag',
                rules: {
                    validate: {
                        checkRequired: checkRequired(),
                    },
                },
                render({ field: { onChange, value }, fieldState: { error } }) {
                    return (
                        <Select
                            required
                            fullWidth
                            options={Array.from({ length: 3 }).map((_, index) => ({
                                label: String(index + 1),
                                value: index + 1,
                            }))}
                            label="Replace Tag"
                            error={error}
                            value={value as ApiKey}
                            onChange={onChange}
                        />
                    );
                },
            },
        ];
        if (currentAction === TagOperationEnums.REPLACE) {
            results.push(...replaceItems);
        }

        return [actionItem, ...results];
    }, [
        getIntlText,
        tagOptions,
        currentAction,
        transformValue,
        handleChange,
        handleRenderOptions,
        handleRenderInput,
        handleRenderTag,
        handleIsOptionEqualToValue,
        handleGetOptionDisabled,
        handleSlots,
    ]);

    return {
        formItems,
    };
}
