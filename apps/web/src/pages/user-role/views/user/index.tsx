import React from 'react';
import { LoadingWrapper } from '@milesight/shared/src/components';
import { Transfer } from '@/components';

/**
 * User Module
 */
const User: React.FC = () => {
    return (
        <>
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
            <div style={{ background: '#fff', margin: '20px', width: '600px' }}>
                <Transfer
                    dataSource={[
                        {
                            key: '1',
                            title: 'User 1',
                        },
                        {
                            key: '2',
                            title: 'User 2',
                        },
                        {
                            key: '3',
                            title: 'User 3',
                        },
                        {
                            key: '5',
                            title: 'User 5',
                        },
                        {
                            key: '6',
                            title: 'User 6',
                        },
                        {
                            key: '7',
                            title: 'User 7',
                        },
                        {
                            key: '8',
                            title: 'User 8',
                        },
                    ]}
                    selectedKeys={['2', '1']}
                    targetKeys={['7', '8', '1']}
                    onChange={val => console.log('onChange ? ', val)}
                    onSelectChange={val => console.log('selectChange ? ', val)}
                />
            </div>
        </>
    );
};

export default User;
