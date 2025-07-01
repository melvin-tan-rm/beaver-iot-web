import React, { useMemo } from 'react';
import classNames from 'classnames';

import { Header } from './components';

import './style.less';

export interface DeviceGroupProps {
    isShrink: boolean;
}

const DeviceGroup: React.FC<DeviceGroupProps> = props => {
    const { isShrink } = props;

    const groupCls = useMemo(() => {
        return classNames('ms-device-group', {
            shrink: isShrink,
        });
    }, [isShrink]);

    return (
        <div className={groupCls}>
            <Header />
        </div>
    );
};

export default DeviceGroup;
