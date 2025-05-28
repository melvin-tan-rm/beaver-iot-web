import React, { useEffect, useRef } from 'react';
import cls from 'classnames';
import { useRequest } from 'ahooks';
import Chart from 'chart.js/auto';
import { isEmpty } from 'lodash-es';

import { useTheme } from '@milesight/shared/src/hooks';
import {
    awaitWrap,
    entityAPI,
    EntityAPISchema,
    getResponseData,
    isRequestSuccess,
} from '@/services/http';
import { getChartColor } from '@/plugin/utils';
import { Tooltip } from '@/plugin/view-components';
import { ViewConfigProps } from '../typings';
import { useActivityEntity } from '../../../hooks';
import './style.less';

interface IProps {
    widgetId: ApiKey;
    dashboardId: ApiKey;
    config: ViewConfigProps;
    configJson: CustomComponentProps;
}
interface AggregateHistoryList {
    entity: EntityOptionType;
    data: EntityAPISchema['getAggregateHistory']['response'];
}
const View = (props: IProps) => {
    const { config, configJson, widgetId, dashboardId } = props;
    const { isPreview } = configJson || {};
    const { entity, title, metrics, time } = config || {};

    const { getCSSVariableValue } = useTheme();
    const chartRef = useRef<HTMLCanvasElement>(null);
    const { data: countData, run: getData } = useRequest(
        async () => {
            if (!entity?.value) return;

            const run = async (selectEntity: EntityOptionType) => {
                const { value: entityId } = selectEntity || {};
                if (!entityId) return;

                const now = Date.now();
                const [error, resp] = await awaitWrap(
                    entityAPI.getAggregateHistory({
                        entity_id: entityId,
                        aggregate_type: metrics,
                        start_timestamp: now - time,
                        end_timestamp: now,
                    }),
                );
                if (error || !isRequestSuccess(resp)) return;

                const data = getResponseData(resp);
                return {
                    entity,
                    data,
                } as AggregateHistoryList;
            };
            return Promise.resolve(run(entity));
        },
        {
            refreshDeps: [entity, time, metrics],
            debounceWait: 300,
        },
    );

    /** Rendering cake map */
    const renderChart = () => {
        try {
            const ctx = chartRef.current!;
            const data = countData?.data?.count_result || [];
            if (!ctx) return;
            const resultColor = getChartColor(data);
            const pieCountData = data?.map(item => item.count);

            const pieData = !isEmpty(pieCountData) ? pieCountData : [1];
            const pieColor = !isEmpty(resultColor)
                ? resultColor
                : [getCSSVariableValue('--gray-2')];

            const chart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: data?.map(item => String(item.value)), // Data label
                    datasets: [
                        {
                            // label: 'My First Dataset',
                            data: pieData, // Data value
                            borderWidth: 1, // Border width
                            backgroundColor: pieColor,
                        },
                    ],
                },
                options: {
                    responsive: true, // Respond to the chart
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            // position: 'right', // Legend position
                            labels: {
                                // Legend box size
                                boxWidth: 10,
                                boxHeight: 10,
                                useBorderRadius: true,
                                borderRadius: 1,
                            },
                        },
                        tooltip: {
                            enabled: Boolean(data?.length), // Enlightenment prompts
                        },
                    },
                },
            });
            return () => {
                /**
                 * Clear chart data
                 */
                chart.destroy();
            };
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        return renderChart();
    }, [countData]);

    // ---------- Entity status management ----------
    const { addEntityListener } = useActivityEntity();

    useEffect(() => {
        const entityId = entity?.value;
        if (!widgetId || !dashboardId || !entityId) return;

        const removeEventListener = addEntityListener(entityId, {
            widgetId,
            dashboardId,
            callback: getData,
        });

        return () => {
            removeEventListener();
        };
    }, [entity?.value, widgetId, dashboardId, addEntityListener, getData]);

    return (
        <div className={cls('ms-pie-chart', { 'ms-pie-chart--preview': isPreview })}>
            <Tooltip className="ms-pie-chart__header" autoEllipsis title={title} />
            <div className="ms-pie-chart__content">
                <canvas id="pieChart" ref={chartRef} />
            </div>
        </div>
    );
};

export default React.memo(View);
