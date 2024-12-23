import React from 'react';
import { LoadingWrapper } from '@milesight/shared/src/components';

/**
 * User Module
 */
const User: React.FC = () => {
    return (
        <div style={{ width: '500px', height: '500px', background: 'yellow' }}>
            <LoadingWrapper loading tip="Loading">
                <div
                    style={{ width: '150px', height: '150px', background: 'yellow' }}
                    onClick={() => console.log('hello world')}
                >
                    Users
                </div>
            </LoadingWrapper>
        </div>
    );
};

export default User;
