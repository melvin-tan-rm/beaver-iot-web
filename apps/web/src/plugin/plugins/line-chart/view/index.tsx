import React, { useEffect, useMemo, useRef } from 'react';
import cls from 'classnames';
import * as echarts from 'echarts/core';
import { useBasicChartEntity } from '@/plugin/hooks';
import { getChartColor } from '@/plugin/utils';
import { Tooltip } from '@/plugin/view-components';
import { type ChartEntityPositionValueType } from '@/plugin/components/chart-entity-position';
import { useLineChart, useResizeChart, useYAxisRange, useZoomChart } from './hooks';

import styles from './style.module.less';

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

    const { getYAxisRange } = useYAxisRange({ chartShowData, entity });
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

        const xRangeList = getYAxisRange() || {};

        myChart.setOption({
            xAxis: {
                type: 'time',
                min: xAxisMin,
                max: xAxisMax,
            },
            yAxis: new Array(chartShowData.length || 1).fill({ type: 'value' }).map((_, index) => ({
                name: index === 0 ? leftYAxisUnit : rightYAxisUnit,
                type: 'value',
                nameLocation: 'middle',
                nameGap: 40,
                ...(index < 2 ? xRangeList[index] || {} : {}),
            })),
            series: newChartShowData.map((chart, index) => ({
                name: chart.entityLabel,
                type: 'line',
                data: chart.chartOwnData.map(v => [v.timestamp, v.value]),
                yAxisIndex: chart.yAxisID === 'y1' ? 1 : 0,
                lineStyle: {
                    color: resultColor[index], // Line color
                    width: 2, // The thickness of the line
                },
                itemStyle: {
                    color: resultColor[index], // Data dot color
                },
                connectNulls: true,
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
                left: 20,
                right: 30,
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
        getYAxisRange,
    ]);

    return (
        <div
            className={cls(styles['line-chart-wrapper'], {
                [styles['line-chart-wrapper__preview']]: isPreview,
            })}
            ref={chartWrapperRef}
        >
            <Tooltip className={styles.name} autoEllipsis title={title} />
            <div className={styles['line-chart-content']}>
                <div ref={chartRef as any} className={styles['line-chart-content__chart']} />
                {chartZoomRef.current?.iconNode}
            </div>
        </div>
    );
};

export default React.memo(View);
