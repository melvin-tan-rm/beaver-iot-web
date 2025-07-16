import { useState } from 'react';
import { useRequest } from 'ahooks';
import { SelectValueOptionType } from '../../../../../../../types';
import { ValueCompBaseProps, ValueSelectInnerProps } from '../../../types';

type IProps<T extends SelectValueOptionType> = Pick<ValueCompBaseProps<T>, 'getFilterValueOptions'>;

const useOptions = <T extends SelectValueOptionType>({ getFilterValueOptions }: IProps<T>) => {
    const [allOptionsMap, setAllOptionsMap] = useState<ValueSelectInnerProps<T>['optionsMap']>(
        new Map(),
    );
    const [keyWord, setKeyword] = useState<string>('');

    /** Get the corresponding drop-down rendering options */
    const { data: options, loading: searchLoading } = useRequest(
        async () => {
            const optionList = (await getFilterValueOptions?.(keyWord)) || [];
            if (!keyWord) {
                setAllOptionsMap(transForm2Map(optionList as T[]));
            }
            return optionList;
        },
        {
            refreshDeps: [getFilterValueOptions, keyWord],
            debounceWait: 300,
        },
    );

    const transForm2Map = (options: T[]) => {
        return (options || []).reduce(
            (acc: ValueSelectInnerProps<T>['optionsMap'], option) => {
                acc.set(option.value, option);
                return acc;
            },
            new Map() as ValueSelectInnerProps<T>['optionsMap'],
        );
    };

    const onSearch = (value: string) => {
        setKeyword(value);
    };

    return {
        searchLoading,
        onSearch,
        options: options || [],
        allOptionsMap,
    };
};

export default useOptions;
