import React, { useEffect, useMemo } from 'react';
import Chart from 'chart.js/auto';

import { useBasicChartEntity } from '@/plugin/hooks';
import { getChartColor } from '@/plugin/utils';
import { Tooltip } from '@/plugin/view-components';
import { type ChartEntityPositionValueType } from '@/plugin/components/chart-entity-position';
import { type ChartShowDataProps } from '@/plugin/hooks/useBasicChartEntity';
import { useLineChart } from './hooks';

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

    const entity = useMemo(() => {
        if (!Array.isArray(entityPosition)) return [];

        return entityPosition.map(e => e.entity).filter(Boolean) as EntityOptionType[];
    }, [entityPosition]);

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

    const { newChartShowData, isDisplayY1 } = useLineChart({
        entityPosition,
        chartShowData,
    });

    useEffect(() => {
        try {
            let chart: Chart<'line', (string | number | null)[], string> | null = null;
            const resultColor = getChartColor(newChartShowData);
            if (chartRef.current) {
                chart = new Chart(chartRef.current, {
                    type: 'line',
                    data: {
                        labels: chartLabels,
                        datasets: newChartShowData.map(
                            (chart: ChartShowDataProps, index: number) => ({
                                label: chart.entityLabel,
                                data: chart.entityValues,
                                borderWidth: 1,
                                spanGaps: true,
                                color: resultColor[index],
                                yAxisID: chart.yAxisID,
                            }),
                        ),
                    },
                    options: {
                        responsive: true, // Respond to the chart
                        maintainAspectRatio: false,
                        scales: {
                            y: {
                                type: 'linear',
                                display: true,
                                position: 'left',
                                beginAtZero: true,
                                ticks: {
                                    autoSkip: true,
                                    autoSkipPadding: 20,
                                },
                                title: {
                                    display: true,
                                    text: leftYAxisUnit,
                                },
                            },
                            y1: {
                                type: 'linear',
                                display: isDisplayY1,
                                position: 'right',
                                beginAtZero: true,
                                ticks: {
                                    autoSkip: true,
                                    autoSkipPadding: 20,
                                },
                                // grid line settings
                                grid: {
                                    drawOnChartArea: false, // only want the grid lines for one axis to show up
                                },
                                title: {
                                    display: true,
                                    text: rightYAxisUnit,
                                },
                            },
                            x: {
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
                            },
                        },
                        plugins: {
                            zoom: {
                                pan: {
                                    enabled: true,
                                    mode: 'x', // Only move on the X axis
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
                                    mode: 'x', // Only zoomed in the X axis
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
    }, [chartLabels, newChartShowData, isDisplayY1, leftYAxisUnit, rightYAxisUnit]);

    return (
        <div className={styles['line-chart-wrapper']}>
            <Tooltip className={styles.name} autoEllipsis title={title} />
            <div className={styles['line-chart-content']}>
                <canvas ref={chartRef} />
                {chartZoomRef.current?.iconNode}
            </div>
        </div>
    );
};

export default React.memo(View);
