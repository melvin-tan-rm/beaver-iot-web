import { useCallback, useMemo } from 'react';
import { VirtualSelectProps, ValueCompBaseProps, AutocompletePropsOverrides } from '../../../types';
import { SelectValueOptionType } from '../../../../../../../types';

type IProps<T extends SelectValueOptionType> = Pick<VirtualSelectProps<T>, 'optionsMap'> &
    Pick<ValueCompBaseProps<T>, 'value' | 'onChange'> &
    Pick<AutocompletePropsOverrides, 'multiple'>;

/**
 * Select list selected about hooks
 */
const useSelectedValue = <T extends SelectValueOptionType>(props: IProps<T>) => {
    const { value, multiple, optionsMap, onChange } = props;

    const valueList = useMemo<SelectValueOptionType[]>(() => {
        return Array.isArray(value) ? value : [value];
    }, [value]);

    /** Selected value map */
    const selectedMap: VirtualSelectProps<T>['selectedMap'] = useMemo(() => {
        if (!valueList?.length) {
            return new Map();
        }

        return valueList.reduce((acc: VirtualSelectProps<T>['selectedMap'], curr) => {
            const option = optionsMap.get(curr.value);
            if (!option) return acc;

            acc.set(curr.value, option);
            return acc;
        }, new Map());
    }, [optionsMap, valueList]);

    /** Select/Cancel selection callback */
    const onItemChange = useCallback(
        (selectedItem: SelectValueOptionType) => {
            if (!multiple) {
                // single select
                onChange?.(selectedItem as T);
                return;
            }

            // multiple select
            if (selectedMap.has(selectedItem.value)) {
                selectedMap.delete(selectedItem.value);
            } else {
                selectedMap.set(selectedItem.value, selectedItem as T);
            }
            onChange?.(Array.from(selectedMap.values()) as unknown as T);
        },
        [multiple, onChange, selectedMap],
    );

    return {
        selectedMap,
        onItemChange,
    };
};

export default useSelectedValue;
