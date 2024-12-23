import React, { useCallback } from 'react';
import { isEmpty } from 'lodash-es';
import classNames from 'classnames';
import { Button, OutlinedInput, InputAdornment, Typography } from '@mui/material';

import {
    AddIcon,
    SearchIcon,
    PermIdentityIcon,
    LoadingWrapper,
} from '@milesight/shared/src/components';
import { useI18n } from '@milesight/shared/src/hooks';
import { Empty } from '@/components';
import { type RoleType } from '@/services/http';

import { MoreDropdown, AddRoleModal, RoleBody } from './components';
import { useRole } from './hooks';
import { MODAL_TYPE } from './constants';

import styles from './style.module.less';

/**
 * Role Module
 */
const Role: React.FC = () => {
    const { getIntlText } = useI18n();
    const {
        roleData,
        activeRole,
        handleRoleClick,
        handleAddRole,
        handleSearch,
        handleRoleOperate,
        addModalVisible,
        setAddModalVisible,
        showAddModal,
        modalTitles,
        modalData,
        modalType,
        handleEditRole,
        loading,
    } = useRole();

    const roleItemCls = useCallback(
        (currentItem: RoleType) => {
            return classNames(styles.item, {
                [styles.active]: currentItem.name === activeRole?.name,
            });
        },
        [activeRole],
    );

    const renderRoleItem = (item: RoleType) => {
        return (
            <div
                key={item.role_id}
                className={roleItemCls(item)}
                onClick={() => handleRoleClick(item)}
            >
                <div className={styles['name-wrapper']}>
                    <div className={styles.icon}>
                        <PermIdentityIcon />
                    </div>

                    <Typography variant="inherit" noWrap title={item.name}>
                        {item.name}
                    </Typography>
                </div>

                <MoreDropdown onOperation={handleRoleOperate} />
            </div>
        );
    };

    const renderRole = () => {
        if (!Array.isArray(roleData) || isEmpty(roleData)) {
            return (
                <div className={styles.empty}>
                    <LoadingWrapper loading={loading}>
                        {!loading && (
                            <Empty
                                text={getIntlText('user.message.not_data_roles_tip')}
                                extra={
                                    <Button
                                        variant="outlined"
                                        startIcon={<AddIcon />}
                                        onClick={() => showAddModal(MODAL_TYPE.ADD)}
                                    >
                                        {getIntlText('user.label.add_role')}
                                    </Button>
                                }
                            />
                        )}
                    </LoadingWrapper>
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
                        {roleData.map(item => renderRoleItem(item))}
                    </div>

                    <div className={styles['add-btn']}>
                        <Button
                            variant="outlined"
                            startIcon={<AddIcon />}
                            onClick={() => showAddModal(MODAL_TYPE.ADD)}
                        >
                            {getIntlText('common.label.add')}
                        </Button>
                    </div>
                </div>
                <div className={styles.main}>
                    <RoleBody />
                </div>
            </>
        );
    };

    return (
        <div className={styles['role-view']}>
            {renderRole()}

            <AddRoleModal
                visible={addModalVisible}
                onCancel={() => setAddModalVisible(false)}
                onFormSubmit={modalType === MODAL_TYPE.ADD ? handleAddRole : handleEditRole}
                data={modalData}
                title={modalTitles}
            />
        </div>
    );
};

export default Role;
