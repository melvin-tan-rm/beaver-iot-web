import { useMemo, useState, useEffect, memo } from 'react';
import { useRequest } from 'ahooks';
import { entityAPI, awaitWrap, isRequestSuccess, getResponseData } from '@/services/http';
import ws, { getExChangeTopic } from '@/services/ws';
import { useDashboardStore } from '@/stores';

import './style.less';

export interface ViewProps {
    config: {
        entity?: EntityOptionType;
        label?: string;
        fontSize?: number;
    };
    configJson: {
        isPreview?: boolean;
    };
}

const View = (props: ViewProps) => {
    const { isEditing } = useDashboardStore();

    const { config, configJson } = props;
    const { entity, label, fontSize = 14 } = config || {};
    const { isPreview } = configJson || {};

    const [textContent, setTextContent] = useState('');

    /**
     * Request physical state function
     */
    const { run: requestEntityStatus } = useRequest(
        async () => {
            if (!entity?.value) return;
            const [error, res] = await awaitWrap(entityAPI.getEntityStatus({ id: entity.value }));

            if (error || !isRequestSuccess(res)) {
                /**
                 * The request failed, the default value was closed by closing the FALSE
                 */
                setTextContent('');
                return;
            }

            const entityStatus = getResponseData(res);
            setTextContent(entityStatus?.value || '');
        },
        {
            refreshDeps: [entity?.value],
            debounceWait: 300,
        },
    );

    /**
     * Get the state of the selected entity
     */
    useEffect(() => {
        if (entity?.value) {
            requestEntityStatus();
        } else {
            /**
             * No entity, initialization data
             */
            setTextContent('');
        }
    }, [entity?.value, requestEntityStatus]);

    /**
     * webSocket subscription theme
     */
    const topic = useMemo(
        () => entity?.rawData?.entityKey && getExChangeTopic(entity.rawData.entityKey),
        [entity],
    );

    /**
     * websocket subscription
     */
    useEffect(() => {
        /**
         * WEBSOCKET subscription is not performed in preview status
         */
        if (!topic || Boolean(isPreview)) return;

        /**
         * When the subscription theme, the function of canceling the subscription will be returned, so if you return directly, you can cancel the subscription when uninstalled
         */
        return ws.subscribe(topic, requestEntityStatus);
    }, [topic, requestEntityStatus, isPreview]);

    return (
        <div className={`text-wrapper ${isPreview ? 'text-wrapper__preview' : ''}`}>
            {label && <div className="text-wrapper__label">{label}</div>}
            <div
                className="text-wrapper__content bg-custom-scrollbar ms-perfect-scrollbar"
                style={{ fontSize: `${fontSize}px`, lineHeight: `${Number(fontSize) + 8}px` }}
            >
                {isEditing ? (textContent || '').toString().slice(0, 6000) : textContent}
            </div>
        </div>
    );
};

export default memo(View);
