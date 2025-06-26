import React from 'react';
import colorMix from '@milesight/shared/src/utils/color-mix';

import { Breadcrumbs, Tag } from '@/components';

import './style.less';

const TagManagement: React.FC = () => {
    return (
        <div className="ms-main">
            <Breadcrumbs />
            <div className="ms-view ms-view-tag">
                <div className="ms-view__inner">
                    <div>
                        <Tag label="Tag Name" arbitraryColor="#7B4EFA" tip="hello world" />
                    </div>
                    <div
                        style={{
                            color: '#D9CDF9',
                            marginTop: '20px',
                        }}
                    >
                        color mix - {colorMix(0.5, 'red', 'blue')}
                    </div>
                    <div
                        style={{
                            color: colorMix(0.5, '#D9CDF9', 'rgba(0, 0, 0, 0.5)'),
                            marginTop: '20px',
                        }}
                    >
                        开源项目 Beaver-IOT {colorMix(0.5, '#D9CDF9', 'rgba(0, 0, 0, 0.5)')}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TagManagement;
