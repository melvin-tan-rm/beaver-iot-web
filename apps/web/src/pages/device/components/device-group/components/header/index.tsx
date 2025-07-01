import React from 'react';

import { useI18n } from '@milesight/shared/src/hooks';
import { SearchIcon, AddIcon } from '@milesight/shared/src/components';

import { Tooltip } from '@/components';

import styles from './style.module.less';

const Header: React.FC = () => {
    const { getIntlText } = useI18n();

    return (
        <div className={styles.header}>
            <div className={styles.left}>{getIntlText('device.label.device_group')}</div>
            <div className={styles.right}>
                <SearchIcon />
                <Tooltip title="新建设备组">
                    <AddIcon />
                </Tooltip>
            </div>
        </div>
    );
};

export default Header;
