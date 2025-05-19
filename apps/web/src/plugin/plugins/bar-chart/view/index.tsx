import React, { useEffect, useRef } from 'react';

import * as echarts from 'echarts/core';
import { GridComponent, DataZoomComponent, TooltipComponent } from 'echarts/components';
import { BarChart } from 'echarts/charts';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

import { useBasicChartEntity } from '@/plugin/hooks';
import { getChartColor } from '@/plugin/utils';
import { Tooltip } from '@/plugin/view-components';
import { useResizeChart, useZoomChart } from './hooks';
import styles from './style.module.less';

echarts.use([
    GridComponent,
    BarChart,
    CanvasRenderer,
    UniversalTransition,
    DataZoomComponent,
    TooltipComponent,
]);
export interface ViewProps {
    config: {
        entity?: EntityOptionType[];
        title?: string;
        time: number;
    };
    configJson: {
        isPreview?: boolean;
    };
}

const View = (props: ViewProps) => {
    const { config, configJson } = props;
    const { entity, title, time } = config || {};
    const { isPreview } = configJson || {};

    const chartWrapperRef = useRef<HTMLDivElement>(null);
    const { chartShowData, chartLabels, chartRef, xAxisRange, chartZoomRef, xAxisConfig } =
        useBasicChartEntity({
            entity,
            time,
            isPreview,
        });

    const { resizeChart } = useResizeChart({ chartWrapperRef });
    const { zoomChart, hoverZoomBtn } = useZoomChart({
        xAxisConfig,
        xAxisRange,
        chartZoomRef,
        chartWrapperRef,
    });

    useEffect(() => {
        const chartDom = chartRef.current;
        if (!chartDom) return;

        const myChart = echarts.init(chartDom);
        const resultColor = getChartColor(chartShowData);
        const [xAxisMin, xAxisMax] = xAxisRange || [];

        myChart.setOption({
            xAxis: {
                type: 'time',
                min: xAxisMin,
                max: xAxisMax,
            },
            yAxis: {
                type: 'value',
            },
            series: chartShowData.map((chart, index) => ({
                name: chart.entityLabel,
                type: 'bar',
                data: chart.entityValues.map((value, idx) => [chartLabels[idx], value]),
                itemStyle: {
                    color: resultColor[index], // Data dot color
                },
            })),
            legend: {
                data: chartShowData.map(chart => chart.entityLabel),
                itemWidth: 10,
                itemHeight: 10,
                icon: 'roundRect', // Set the legend item as a square
                textStyle: {
                    borderRadius: 10,
                },
                itemStyle: {
                    borderRadius: 10,
                },
            },
            grid: {
                containLabel: true,
                top: 30, // Adjust the top blank space of the chart area
                left: 0,
                right: 0,
                bottom: 0,
            },
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                borderColor: 'rgba(0, 0, 0, 0.9)',
                textStyle: {
                    color: '#fff',
                },
            },
            dataZoom: [
                {
                    type: 'inside', // Built-in data scaling component
                    filterMode: 'none',
                    zoomOnMouseWheel: 'ctrl', // Hold down the ctrl key to zoom
                },
            ],
        });

        hoverZoomBtn();
        zoomChart(myChart);
        // Update the chart when the container size changes
        const disconnectResize = resizeChart(myChart);
        return () => {
            disconnectResize?.();
            myChart?.dispose();
        };
    }, [chartLabels, chartRef, chartShowData, xAxisRange, hoverZoomBtn, resizeChart, zoomChart]);

    return (
        <div className={styles['bar-chart-wrapper']} ref={chartWrapperRef}>
            <Tooltip className={styles.name} autoEllipsis title={title} />
            <div className={styles['bar-chart-content']}>
                <div ref={chartRef as any} className={styles['bar-chart-content__chart']} />
                {chartZoomRef.current?.iconNode}
            </div>
        </div>
    );
};

export default React.memo(View);
