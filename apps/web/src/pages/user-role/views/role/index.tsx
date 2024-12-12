import React, { useState, useCallback } from 'react';
import { isEmpty } from 'lodash-es';
import { Button, OutlinedInput, InputAdornment } from '@mui/material';

import {
    AddIcon,
    SearchIcon,
    PermIdentityIcon,
    MoreVertIcon,
} from '@milesight/shared/src/components';
import { useI18n } from '@milesight/shared/src/hooks';
import { Empty } from '@/components';

import styles from './style.module.less';

/**
 * Role Module
 */
const Role: React.FC = () => {
    const { getIntlText } = useI18n();

    const [roleData, setRoleData] = useState<string[]>([]);

    const handleAddRole = useCallback(() => {
        setRoleData(['1']);
    }, []);

    const handleSearch = useCallback((value: string) => {
        console.log('Search value:', value);
    }, []);

    const renderRoleItem = (item: any) => {
        return (
            <div key={item.name} className={styles.item}>
                <div className={styles['name-wrapper']}>
                    <PermIdentityIcon />
                    <div className={styles.name}>Role 2</div>
                </div>

                <MoreVertIcon />
            </div>
        );
    };

    const renderRole = () => {
        if (isEmpty(roleData)) {
            return (
                <div className={styles.empty}>
                    <Empty
                        text={getIntlText('user.message.not_data_roles_tip')}
                        extra={
                            <Button
                                variant="outlined"
                                startIcon={<AddIcon />}
                                onClick={handleAddRole}
                            >
                                {getIntlText('user.label.add_role_btn')}
                            </Button>
                        }
                    />
                </div>
            );
        }

        return (
            <>
                <div className={styles.aside}>
                    <OutlinedInput
                        placeholder="Search"
                        sx={{ width: 200, height: 40 }}
                        onChange={e => handleSearch?.(e.target.value)}
                        startAdornment={
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        }
                    />

                    <div className={styles['role-wrapper']}>
                        {Array.from({ length: 8 })
                            .map((item, index) => ({ name: String(item) + index }))
                            .map(item => renderRoleItem(item))}
                    </div>

                    <div className={styles['add-btn']}>
                        <Button variant="outlined" startIcon={<AddIcon />} onClick={handleAddRole}>
                            Add
                        </Button>
                    </div>
                </div>
                <div className={styles.main}>main</div>
            </>
        );
    };

    return <div className={styles['role-view']}>{renderRole()}</div>;
};

export default Role;
