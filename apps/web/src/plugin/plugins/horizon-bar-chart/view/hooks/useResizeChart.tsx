import { useMemoizedFn } from 'ahooks';
import { type EChartsType } from 'echarts/core';

interface IProps {
    chartWrapperRef: React.RefObject<HTMLDivElement>;
}
export const useResizeChart = ({ chartWrapperRef }: IProps) => {
    /** Update the chart when the container size changes */
    const resizeChart = useMemoizedFn((myChart: EChartsType) => {
        const chartWrapper = chartWrapperRef.current;
        if (!chartWrapper) return;

        const resizeObserver = new ResizeObserver(() => {
            myChart.resize();
        });
        resizeObserver.observe(chartWrapper);
        return () => {
            resizeObserver.disconnect();
        };
    });

    return {
        resizeChart,
    };
};
