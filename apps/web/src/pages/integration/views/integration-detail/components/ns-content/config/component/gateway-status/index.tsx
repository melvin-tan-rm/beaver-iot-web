import React from 'react';
import classNames from 'classnames';
import { useI18n } from '@milesight/shared/src/hooks';

import './style.less';

interface IProps {
    status: 'ONLINE' | 'OFFLINE';
}

const STATUS_INTL_KEY = {
    ONLINE: 'setting.integration.label.gateway_online',
    OFFLINE: 'setting.integration.label.gateway_offline',
};

// gateway status
const GatewayStatus: React.FC<IProps> = props => {
    const { status } = props;
    const { getIntlText } = useI18n();

    return (
        <div className="ms-view-gateway-status">
            <div
                className={classNames('ms-view-gateway-status-online', {
                    'ms-view-gateway-status-offline': status === 'OFFLINE',
                })}
            >
                {getIntlText(STATUS_INTL_KEY[status])}
            </div>
        </div>
    );
};

export default GatewayStatus;
