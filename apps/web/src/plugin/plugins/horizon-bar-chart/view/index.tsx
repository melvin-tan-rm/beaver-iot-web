import React, { useEffect, useRef } from 'react';
import { renderToString } from 'react-dom/server';
import cls from 'classnames';
import * as echarts from 'echarts/core';
import { useBasicChartEntity } from '@/plugin/hooks';
import { getChartColor } from '@/plugin/utils';
import { Tooltip } from '@/plugin/view-components';
import styles from './style.module.less';
import { useResizeChart, useYAxisRange, useZoomChart } from './hooks';

export interface ViewProps {
    config: {
        entity?: EntityOptionType[];
        title?: string;
        time: number;
    };
    configJson: {
        isPreview?: boolean;
    };
    isEdit?: boolean;
}

const View = (props: ViewProps) => {
    const { config, configJson, isEdit } = props;
    const { entity, title, time } = config || {};
    const { isPreview } = configJson || {};
    const chartWrapperRef = useRef<HTMLDivElement>(null);
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

    useEffect(() => {
        const chartDom = chartRef.current;
        if (!chartDom) return;

        const myChart = echarts.init(chartDom);
        const resultColor = getChartColor(chartShowData);
        const [xAxisMin, xAxisMax] = xAxisRange || [];

        const { min, max } = getYAxisRange() || {};

        myChart.setOption({
            xAxis: {
                type: 'value',
                min,
                max,
            },
            yAxis: {
                type: 'time',
                min: xAxisMin,
                max: xAxisMax,
                axisLine: { onZero: false },
            },
            series: chartShowData.map((chart, index) => ({
                name: chart.entityLabel,
                type: 'bar',
                data: chart.chartOwnData.map(v => [v.value, v.timestamp]),
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
                left: -40,
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
                formatter: (params: any[]) => {
                    return renderToString(
                        <div>
                            {params.map((item, index) => {
                                const { data, marker, seriesName, seriesIndex, axisValueLabel } =
                                    item || {};

                                const getUnit = () => {
                                    const { rawData: currentEntity } = entity?.[seriesIndex] || {};
                                    if (!currentEntity) return;
                                    const { entityValueAttribute } = currentEntity || {};
                                    const { unit } = entityValueAttribute || {};
                                    return unit;
                                };
                                const unit = getUnit();

                                return (
                                    <div>
                                        {index === 0 && <div>{axisValueLabel}</div>}
                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                            }}
                                        >
                                            <div>
                                                <span
                                                    //  eslint-disable-next-line react/no-danger
                                                    dangerouslySetInnerHTML={{ __html: marker }}
                                                />
                                                <span>{seriesName || ''}:&nbsp;&nbsp;</span>
                                            </div>
                                            <div>{`${data?.[0]}${unit || ''}`}</div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>,
                    );
                },
            },
            dataZoom: [
                {
                    type: 'inside', // Built-in data scaling component
                    filterMode: 'empty',
                    orient: 'vertical',
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
        entity,
        chartLabels,
        chartRef,
        chartShowData,
        xAxisRange,
        hoverZoomBtn,
        resizeChart,
        zoomChart,
        getYAxisRange,
    ]);

    return (
        <div
            className={cls(styles['horizon-bar-chart-wrapper'], {
                [styles['horizon-bar-chart-wrapper__preview']]: isPreview,
            })}
            ref={chartWrapperRef}
        >
            <Tooltip className={styles.name} autoEllipsis title={title} />
            <div className={styles['horizon-chart-content']}>
                <div ref={chartRef as any} className={styles['horizon-chart-content__chart']} />
            </div>
            {React.cloneElement(chartZoomRef.current?.iconNode, {
                className: cls('reset-chart-zoom', { 'reset-chart-zoom--isEdit': isEdit }),
            })}
        </div>
    );
};

export default React.memo(View);
