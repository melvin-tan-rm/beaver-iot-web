import { useMemo } from 'react';
import { type ControllerProps } from 'react-hook-form';
import {
    FormControl,
    Autocomplete,
    Select as MuiSelect,
    InputLabel,
    FormHelperText,
    MenuItem,
} from '@mui/material';

import { useI18n } from '@milesight/shared/src/hooks';
import { checkRequired } from '@milesight/shared/src/utils/validators';
import { Select } from '@milesight/shared/src/components';

import { TagOperationEnums } from '@/services/http';
import { type ManageTagsProps } from '../index';
import { SelectVirtualizationList } from '../components';
import { MANAGE_ACTION } from '../constants';
import { useAutoComplete } from './useAutoComplete';
import Tag from '../../tag';

export function useFormItems(props: {
    currentAction: TagOperationEnums;
    entityOptions: TagProps[];
}) {
    const { currentAction = TagOperationEnums.ADD, entityOptions } = props || {};

    const { getIntlText } = useI18n();
    const {
        autoCompleteTagOptions,
        originalTagOptions,
        transformValue,
        handleChange,
        handleRenderOptions,
        handleRenderInput,
        handleRenderTag,
        handleIsOptionEqualToValue,
        handleGetOptionDisabled,
        handleGetOptionLabel,
        handleSlots,
        renderEmpty,
    } = useAutoComplete({
        currentAction,
        entityOptions,
    });

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
                        <Autocomplete<TagProps, true>
                            multiple
                            id="manage-tags"
                            size="small"
                            options={autoCompleteTagOptions}
                            value={transformValue(value as ApiKey[])}
                            onChange={handleChange(onChange)}
                            disableCloseOnSelect
                            disableListWrap
                            renderOption={handleRenderOptions()}
                            renderInput={handleRenderInput(error)}
                            renderTags={handleRenderTag()}
                            isOptionEqualToValue={handleIsOptionEqualToValue()}
                            getOptionDisabled={handleGetOptionDisabled(value as ApiKey[])}
                            getOptionLabel={handleGetOptionLabel()}
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
                defaultValue: '',
                render({ field: { onChange, value }, fieldState: { error } }) {
                    return (
                        <FormControl fullWidth error={!!error}>
                            <InputLabel required>
                                {getIntlText('tag.title.original_tag')}
                            </InputLabel>
                            <MuiSelect
                                id="original-tag-select"
                                value={value}
                                onChange={onChange}
                                MenuProps={{
                                    PaperProps: {
                                        style: {
                                            maxHeight: 250,
                                        },
                                    },
                                }}
                            >
                                {renderEmpty(entityOptions)}
                                {entityOptions.map(t => (
                                    <MenuItem key={t.id} value={t.id}>
                                        <Tag
                                            label={t.name}
                                            arbitraryColor={t.color}
                                            tip={t.description}
                                        />
                                    </MenuItem>
                                ))}
                            </MuiSelect>
                            {!!error && (
                                <FormHelperText error={!!error}>{error?.message}</FormHelperText>
                            )}
                        </FormControl>
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
                defaultValue: '',
                render({ field: { onChange, value }, fieldState: { error } }) {
                    return (
                        <FormControl fullWidth error={!!error}>
                            <InputLabel required>
                                {getIntlText('tag.title.replace_with')}
                            </InputLabel>
                            <MuiSelect
                                required
                                id="replace-tag-select"
                                value={value}
                                onChange={onChange}
                                displayEmpty
                                MenuProps={{
                                    PaperProps: {
                                        style: {
                                            maxHeight: 250,
                                        },
                                    },
                                }}
                            >
                                {renderEmpty(originalTagOptions)}
                                {originalTagOptions.map(t => (
                                    <MenuItem key={t.id} value={t.id}>
                                        <Tag
                                            label={t.name}
                                            arbitraryColor={t.color}
                                            tip={t.description}
                                        />
                                    </MenuItem>
                                ))}
                            </MuiSelect>
                            {!!error && (
                                <FormHelperText error={!!error}>{error?.message}</FormHelperText>
                            )}
                        </FormControl>
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
        autoCompleteTagOptions,
        originalTagOptions,
        entityOptions,
        currentAction,
        transformValue,
        handleChange,
        handleRenderOptions,
        handleRenderInput,
        handleRenderTag,
        handleIsOptionEqualToValue,
        handleGetOptionDisabled,
        handleGetOptionLabel,
        handleSlots,
        renderEmpty,
    ]);

    return {
        formItems,
    };
}
