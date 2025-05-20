import React, { useEffect, useRef, useMemo } from 'react';
import cls from 'classnames';
import { useRequest } from 'ahooks';
import { isEmpty } from 'lodash-es';

import * as echarts from 'echarts/core';
import { PieChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { TooltipComponent, LegendComponent } from 'echarts/components';

import { useTheme } from '@milesight/shared/src/hooks';
import {
    awaitWrap,
    entityAPI,
    EntityAPISchema,
    getResponseData,
    isRequestSuccess,
} from '@/services/http';
import ws, { getExChangeTopic } from '@/services/ws';
import { getChartColor } from '@/plugin/utils';
import { Tooltip } from '@/plugin/view-components';
import { useResizeChart } from './hooks';
import { ViewConfigProps } from '../typings';
import './style.less';

echarts.use([TooltipComponent, LegendComponent, PieChart, CanvasRenderer]);
interface IProps {
    config: ViewConfigProps;
    configJson: CustomComponentProps;
}
interface AggregateHistoryList {
    entity: EntityOptionType;
    data: EntityAPISchema['getAggregateHistory']['response'];
}
const View = (props: IProps) => {
    const { config, configJson } = props;
    const { isPreview } = configJson || {};
    const { entity, title, metrics, time } = config || {};
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartWrapperRef = useRef<HTMLDivElement>(null);

    const { getCSSVariableValue, grey } = useTheme();
    const { resizeChart } = useResizeChart({ chartWrapperRef });
    const { data: countData, runAsync: getData } = useRequest(
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
        { refreshDeps: [entity, time, metrics] },
    );

    /** Rendering cake map */
    const renderChart = () => {
        const chartDom = chartRef.current;
        if (!chartDom) return;

        const data = countData?.data?.count_result || [];
        const resultColor = getChartColor(data);
        const pieColor = !isEmpty(resultColor) ? resultColor : [getCSSVariableValue('--gray-2')];

        const myChart = echarts.init(chartDom);
        myChart.setOption({
            legend: {
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
            series: [
                {
                    type: 'pie',
                    data: (data || []).map(item => ({
                        value: item.count,
                        name: item.value,
                    })),

                    itemStyle: {
                        color: (params: any) => {
                            const { dataIndex } = params || {};
                            return pieColor[dataIndex];
                        },
                    },
                    label: {
                        show: false,
                    },
                    emptyCircleStyle: {
                        color: grey[100],
                    },
                },
            ],
            tooltip: {
                trigger: 'item',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                borderColor: 'rgba(0, 0, 0, 0.9)',
                textStyle: {
                    color: '#fff',
                },
            },
        });

        // Update the chart when the container size changes
        const disconnectResize = resizeChart(myChart);
        return () => {
            disconnectResize?.();
            myChart?.dispose();
        };
    };
    useEffect(() => {
        return renderChart();
    }, [countData]);

    const topic = useMemo(() => {
        const entityKey = entity?.value?.toString();
        return entityKey && getExChangeTopic(entityKey);
    }, [entity]);

    // Subscribe to WS topics
    useEffect(() => {
        if (!topic || configJson.isPreview) return;

        const unsubscribe = ws.subscribe(topic, getData);
        return () => {
            unsubscribe?.();
        };
    }, [topic]);

    return (
        <div
            className={cls('ms-pie-chart', { 'ms-pie-chart--preview': isPreview })}
            ref={chartWrapperRef}
        >
            <Tooltip className="ms-pie-chart__header" autoEllipsis title={title} />
            <div className="ms-pie-chart__content">
                <div ref={chartRef as any} className="ms-chart-content__chart" />
            </div>
        </div>
    );
};

export default React.memo(View);
