import { useState, useMemo } from 'react';
import { useMemoizedFn } from 'ahooks';
import { type FieldError } from 'react-hook-form';
import {
    type UseAutocompleteProps,
    type AutocompleteProps,
    TextField,
    type AutocompleteSlots,
    Paper,
    List,
} from '@mui/material';

import { useI18n } from '@milesight/shared/src/hooks';
import { CloseIcon, LoadingWrapper } from '@milesight/shared/src/components';

import { TagOperationEnums } from '@/services/http';
import Tag from '@/components/tag';
import { useTagAllSelect } from './useTagAllSelect';
import { ALL_OPTION } from '../constants';

export function useAutoComplete(currentAction: TagOperationEnums) {
    const { getIntlText } = useI18n();

    const { allIsIndeterminate, convertTagsValue, convertTagsOnChangeValue } = useTagAllSelect();

    const [tagsLoading, setTagsLoading] = useState(false);

    const tagOptions = useMemo((): OptionsProps[] => {
        return Array.from({ length: 12 }).map((_, index) => ({
            label:
                index === 0 && currentAction === TagOperationEnums.REMOVE
                    ? getIntlText(ALL_OPTION.label)
                    : `Tag Name ${String(index + 1)}`,
            value:
                index === 0 && currentAction === TagOperationEnums.REMOVE
                    ? ALL_OPTION.value
                    : index + 1,
        }));
    }, [getIntlText, currentAction]);

    const transformValue = useMemoizedFn((value: ApiKey[]) => {
        return tagOptions.filter(option => {
            if (!Array.isArray(value)) {
                return false;
            }

            const newValue =
                currentAction === TagOperationEnums.REMOVE
                    ? convertTagsValue(value, tagOptions)
                    : value;
            return newValue.includes(option.value as ApiKey);
        });
    });

    const handleChange = useMemoizedFn(
        (
            onChange: (...event: any[]) => void,
        ): UseAutocompleteProps<OptionsProps<string | number>, true, false, false>['onChange'] => {
            return (_, selectedOptions, reason, details) => {
                const newValue = (selectedOptions || []).map(o => o.value).filter(Boolean);

                const finalNewValue =
                    currentAction === TagOperationEnums.REMOVE
                        ? convertTagsOnChangeValue(
                              newValue as ApiKey[],
                              tagOptions,
                              reason,
                              details,
                          )
                        : newValue;
                onChange(finalNewValue);
            };
        },
    );

    const handleRenderOptions = useMemoizedFn(
        (): AutocompleteProps<
            OptionsProps<string | number>,
            true,
            false,
            false
        >['renderOption'] => {
            return (props, option, state) => {
                Reflect.set(state, 'multiple', true);
                Reflect.set(state, 'allIsIndeterminate', allIsIndeterminate);
                return [props, option, state] as React.ReactNode;
            };
        },
    );

    const handleRenderInput = useMemoizedFn(
        (
            error: FieldError | undefined,
        ): AutocompleteProps<OptionsProps<string | number>, true, false, false>['renderInput'] => {
            return params => (
                <TextField
                    {...params}
                    required
                    error={!!error}
                    helperText={error ? error.message : null}
                    label={getIntlText('tag.label.tags')}
                    placeholder={getIntlText('common.placeholder.select')}
                />
            );
        },
    );

    const handleRenderTag = useMemoizedFn(
        (): AutocompleteProps<OptionsProps<string | number>, true, false, false>['renderTags'] => {
            return (value: readonly OptionsProps[], getTagProps) => {
                return value
                    .filter(o => o.value !== ALL_OPTION.value)
                    .map((option: OptionsProps, index: number) => {
                        const { key, ...tagProps } = getTagProps({ index });
                        return (
                            <Tag
                                key={key}
                                label={option.label}
                                deleteIcon={<CloseIcon />}
                                {...tagProps}
                            />
                        );
                    });
            };
        },
    );

    const handleIsOptionEqualToValue = useMemoizedFn(
        (): UseAutocompleteProps<
            OptionsProps<string | number>,
            true,
            false,
            false
        >['isOptionEqualToValue'] => {
            return (option, valueObj) => option.value === valueObj.value;
        },
    );

    const handleGetOptionDisabled = useMemoizedFn(
        (
            value: ApiKey[],
        ): UseAutocompleteProps<
            OptionsProps<string | number>,
            true,
            false,
            false
        >['getOptionDisabled'] => {
            return () => {
                return (
                    [TagOperationEnums.ADD, TagOperationEnums.OVERWRITE].includes(currentAction) &&
                    (value as ApiKey[])?.length >= 10
                );
            };
        },
    );

    const handleSlots = useMemoizedFn((): Partial<AutocompleteSlots> | undefined => {
        return {
            paper: tagsLoading
                ? () => (
                      <Paper>
                          <LoadingWrapper loading>
                              <List
                                  sx={{
                                      height: 100,
                                  }}
                              />
                          </LoadingWrapper>
                      </Paper>
                  )
                : undefined,
        };
    });

    return {
        tagOptions,
        transformValue,
        handleChange,
        handleRenderOptions,
        handleRenderInput,
        handleRenderTag,
        handleIsOptionEqualToValue,
        handleGetOptionDisabled,
        handleSlots,
    };
}
