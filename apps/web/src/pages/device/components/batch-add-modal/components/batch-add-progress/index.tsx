import React from 'react';
import { LinearProgress, linearProgressClasses } from '@mui/material';

import {
    CheckCircleIcon,
    CancelIcon,
    FileDownloadOutlinedIcon,
} from '@milesight/shared/src/components';

import styles from './style.module.less';

/**
 * Batch add progress
 */
const BatchAddProgress: React.FC = () => {
    console.log('BatchAddProgress ? ', linearProgressClasses.bar);

    return (
        <div className={styles['batch-add-progress']}>
            <div className={styles['progress-wrapper']}>
                <div className={styles.statistics}>
                    <div className={styles.status}>正在添加： B1-F101-VS330</div>
                    <div className={styles.count}>155/500</div>
                </div>
                <div className={styles.progress}>
                    <LinearProgress
                        variant="determinate"
                        value={10}
                        sx={{
                            borderRadius: '4px',
                            [`&.${linearProgressClasses.bar}`]: {
                                borderRadius: '4px',
                            },
                        }}
                    />
                </div>
            </div>
            <div className={styles.result}>
                <CheckCircleIcon color="success" />
                <div className={styles.text}>120 台设备添加成功</div>
            </div>
            <div className={styles.result}>
                <CancelIcon color="error" />
                <div className={styles.text}>35 台设备添加失败</div>
                <div className={styles.download}>
                    <FileDownloadOutlinedIcon color="inherit" />
                    <div className={styles.text}>下载</div>
                </div>
            </div>
        </div>
    );
};

export default BatchAddProgress;
