import React, { useEffect, useMemo, useRef } from 'react';

import * as echarts from 'echarts/core';
import {
    TooltipComponent,
    GridComponent,
    LegendComponent,
    DataZoomComponent,
} from 'echarts/components';
import { LineChart } from 'echarts/charts';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

import { useBasicChartEntity } from '@/plugin/hooks';
import { getChartColor } from '@/plugin/utils';
import { Tooltip } from '@/plugin/view-components';
import { type ChartEntityPositionValueType } from '@/plugin/components/chart-entity-position';
import { useLineChart, useResizeChart, useZoomChart } from './hooks';

import styles from './style.module.less';

echarts.use([
    TooltipComponent,
    GridComponent,
    LegendComponent,
    DataZoomComponent,
    LineChart,
    CanvasRenderer,
    UniversalTransition,
]);
export interface ViewProps {
    config: {
        entityPosition: ChartEntityPositionValueType[];
        title: string;
        time: number;
        leftYAxisUnit: string;
        rightYAxisUnit: string;
    };
    configJson: {
        isPreview?: boolean;
    };
}

const View = (props: ViewProps) => {
    const { config, configJson } = props;
    const { entityPosition, title, time, leftYAxisUnit, rightYAxisUnit } = config || {};
    const { isPreview } = configJson || {};
    const chartWrapperRef = useRef<HTMLDivElement>(null);

    const entity = useMemo(() => {
        if (!Array.isArray(entityPosition)) return [];

        return entityPosition.map(e => e.entity).filter(Boolean) as EntityOptionType[];
    }, [entityPosition]);

    const { chartShowData, chartLabels, chartRef, chartZoomRef, xAxisConfig, xAxisRange } =
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
    const { newChartShowData } = useLineChart({
        entityPosition,
        chartShowData,
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
            yAxis: new Array(chartShowData.length || 1).fill({ type: 'value' }).map((_, index) => ({
                name: index === 0 ? leftYAxisUnit : rightYAxisUnit,
                type: 'value',
            })),
            series: newChartShowData.map((chart, index) => ({
                name: chart.entityLabel,
                type: 'line',
                data: chart.entityValues.map((value, idx) => [chartLabels[idx], value]),
                yAxisIndex: chart.yAxisID === 'y1' ? 1 : 0,
                lineStyle: {
                    color: resultColor[index], // Line color
                    width: 2, // The thickness of the line
                },
                itemStyle: {
                    color: resultColor[index], // Data dot color
                },
                showSymbol: true, // Whether to display data dots
                symbolSize: 2, // Data dot size
                emphasis: {
                    focus: 'series',
                    scale: 4,
                    itemStyle: {
                        borderColor: resultColor[index],
                        borderWidth: 0, // Set it to 0 to make the dot solid when hovering
                        color: resultColor[index], // Make sure the color is consistent with the lines
                    },
                },
            })),
            legend: {
                data: chartShowData.map(chartData => chartData.entityLabel),
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
                top: 35, // Adjust the top blank space of the chart area
                left: 0,
                right: 10,
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
    }, [
        chartLabels,
        chartRef,
        chartShowData,
        newChartShowData,
        xAxisRange,
        leftYAxisUnit,
        rightYAxisUnit,
        hoverZoomBtn,
        resizeChart,
        zoomChart,
    ]);

    return (
        <div className={styles['line-chart-wrapper']} ref={chartWrapperRef}>
            <Tooltip className={styles.name} autoEllipsis title={title} />
            <div className={styles['line-chart-content']}>
                <div ref={chartRef as any} className={styles['line-chart-content__chart']} />
                {chartZoomRef.current?.iconNode}
            </div>
        </div>
    );
};

export default React.memo(View);
