import React, { useEffect, useMemo } from 'react';
import Chart from 'chart.js/auto';
import { useBasicChartEntity } from '@/plugin/hooks';
import { getChartColor } from '@/plugin/utils';
import { Tooltip } from '@/plugin/view-components';
import styles from './style.module.less';

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

const MAX_VALUE_RATIO = 1.1;
const View = (props: ViewProps) => {
    const { config, configJson } = props;
    const { entity, title, time } = config || {};
    const { isPreview } = configJson || {};
    const {
        chartShowData,
        chartLabels,
        chartRef,
        format,
        displayFormats,
        xAxisRange,
        chartZoomRef,
    } = useBasicChartEntity({
        entity,
        time,
        isPreview,
    });

    // Find the maximum value of the entity data
    const maxEntityValue = useMemo(() => {
        if (!chartShowData?.length) return;

        return (
            Math.max(
                ...chartShowData.map(item =>
                    Math.max(...(item.entityValues || []).map(v => Number(v))),
                ),
            ) * MAX_VALUE_RATIO
        );
    }, [chartShowData]);
    useEffect(() => {
        try {
            let chart: Chart<'bar', (string | number | null)[], string> | null = null;
            const resultColor = getChartColor(chartShowData);
            if (chartRef.current) {
                chart = new Chart(chartRef.current, {
                    type: 'bar',
                    data: {
                        labels: chartLabels,
                        datasets: chartShowData.map((chart: any, index: number) => ({
                            label: chart.entityLabel,
                            data: chart.entityValues,
                            borderWidth: 1,
                            backgroundColor: resultColor[index],
                        })),
                    },
                    options: {
                        responsive: true, // Respond to the chart
                        maintainAspectRatio: false,
                        indexAxis: 'y',
                        scales: {
                            x: {
                                beginAtZero: true,
                                ticks: {
                                    autoSkip: true,
                                    autoSkipPadding: 20,
                                },
                                grid: {
                                    display: false, // Remove the lines
                                },
                            },
                            y: {
                                type: 'time',
                                time: {
                                    tooltipFormat: format,
                                    displayFormats,
                                },
                                min: xAxisRange[0], // The minimum value of time range
                                max: xAxisRange[1], // The maximum value of time range
                                ticks: {
                                    autoSkip: true, // Automatically skip the scale
                                    maxTicksLimit: 8,
                                    major: {
                                        enabled: true, // Enable the main scale
                                    },
                                },
                                suggestedMax: maxEntityValue,
                            },
                        },
                        plugins: {
                            zoom: {
                                pan: {
                                    enabled: true,
                                    mode: 'y', // Only move on the X axis
                                    onPanStart: chartZoomRef.current?.show,
                                },
                                zoom: {
                                    wheel: {
                                        enabled: true, // Enable rolling wheel scaling
                                        speed: 0.05,
                                    },
                                    pinch: {
                                        enabled: true, // Enable touch shrinkage
                                    },
                                    mode: 'y', // Only zoomed in the X axis
                                    onZoomStart: chartZoomRef.current?.show,
                                },
                            },
                        } as any,
                    },
                });

                /**
                 * store reset zoom state function
                 */
                chartZoomRef.current?.storeReset(chart);
            }

            return () => {
                /**
                 * Clear chart data
                 */
                chart?.destroy();
            };
        } catch (error) {
            console.error(error);
        }
    }, [chartLabels, chartShowData, chartRef, maxEntityValue]);

    return (
        <div className={styles['horizon-bar-chart-wrapper']}>
            <Tooltip className={styles.name} autoEllipsis title={title} />
            <div className={styles['horizon-chart-content']}>
                <canvas ref={chartRef} />
                {chartZoomRef.current?.iconNode}
            </div>
        </div>
    );
};

export default React.memo(View);
