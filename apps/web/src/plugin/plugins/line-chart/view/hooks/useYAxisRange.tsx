import { useCallback } from 'react';
import { isNil } from 'lodash-es';
import type { ChartShowDataProps } from '@/plugin/hooks';

interface IProps {
    entity?: EntityOptionType[];
    chartShowData: ChartShowDataProps[];
}

/**
 * 是否可转化为数字
 * @example
 * isLikeNumber('123') // true
 */
export const isLikeNumber = (value: string | number) => {
    if (value === null || value === '') {
        return false;
    }

    const valueNumber = +value;
    return !Number.isNaN(valueNumber) && Number.isFinite(valueNumber);
};

export const useYAxisRange = ({ entity, chartShowData }: IProps) => {
    // If there is no data, display the default range
    const getYAxisRange = useCallback(() => {
        const SPLIT_NUMBER = 5;
        const [MIN, MAX] = [0, 100];
        const len = chartShowData.length;

        if (len) {
            // If there is data, take it according to the range of the data
            return chartShowData.map((chartData, index) => {
                const currentEntity = entity?.[index];
                const { entityValueAttribute } = currentEntity?.rawData || {};

                let min = entityValueAttribute?.min;
                let max = entityValueAttribute?.max;

                (chartData?.entityValues || []).forEach(entityValue => {
                    if (isLikeNumber(entityValue!)) {
                        const value = +entityValue!;

                        min = Math.min(min ?? Math.floor(value * 0.8), value);
                        max = Math.max(max ?? Math.ceil(value * 1.2), value);
                    }
                });

                return {
                    min: min ?? MIN,
                    max: max ?? MAX,
                    interval: ((max ?? MAX) - (min ?? MIN)) / SPLIT_NUMBER,
                };
            });
        }

        // Is there a maximum/minimum value
        if (!entity) return new Array(len).fill({ min: MIN, max: MAX });
        const currentEntity = entity.find(item => {
            const { min, max } = item?.rawData?.entityValueAttribute || {};

            return !isNil(min) && !isNil(max);
        });
        if (!currentEntity) return new Array(len).fill({ min: MIN, max: MAX });

        const { min = MIN, max = MAX } = currentEntity?.rawData?.entityValueAttribute || {};
        return new Array(len).fill({ min, max });
    }, [chartShowData, entity]);

    return {
        getYAxisRange,
    };
};
