import React, { useMemo } from 'react';
import { TextField } from '@mui/material';
import { omit, pick } from 'lodash-es';

import { useI18n } from '@milesight/shared/src/hooks';
import { AddIcon, SearchIcon } from '@milesight/shared/src/components';

import { Tooltip, PermissionControlHidden } from '@/components';
import { PERMISSIONS } from '@/constants';
import { useSearch } from './hooks/useSearch';

import styles from './style.module.less';

export interface HeaderProps {
    /** Handle the search input value keyword change */
    onSearch?: (keyword: string) => void;
    /** add new group */
    onAdd?: () => void;
}

const Header: React.FC<HeaderProps> = props => {
    const { onSearch, onAdd } = props;

    const { getIntlText } = useI18n();

    const {
        showSearch,
        textFieldRef,
        inputRef,
        keyword,
        handleChange,
        handleMouseEnter,
        handleMouseLeave,
    } = useSearch(onSearch);

    const textFieldSx = useMemo(() => {
        const result = {
            inputWidth: 0,
            '& .MuiOutlinedInput-notchedOutline': {
                border: 'none',
            },
        };

        if (showSearch) {
            result.inputWidth = 119;
            return pick(result, ['inputWidth']);
        }

        return result;
    }, [showSearch]);

    return (
        <div className={styles.header}>
            <div className={styles.left}>{getIntlText('device.label.device_group')}</div>
            <PermissionControlHidden permissions={PERMISSIONS.DEVICE_GROUP_MANAGE}>
                <div
                    className={styles.right}
                    onClick={() => {
                        onAdd?.();
                    }}
                >
                    <Tooltip title={getIntlText('device.label.add_device_group')}>
                        <AddIcon />
                    </Tooltip>
                </div>
            </PermissionControlHidden>
            <div className={styles.search}>
                <TextField
                    ref={textFieldRef}
                    inputRef={inputRef}
                    size="small"
                    placeholder="Search"
                    value={keyword}
                    onChange={handleChange}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    slotProps={{
                        input: {
                            endAdornment: <SearchIcon color={showSearch ? 'disabled' : 'action'} />,
                        },
                    }}
                    sx={{
                        backgroundColor: 'var(--component-background)',
                        '&.MuiFormControl-root': {
                            marginBottom: 0,
                        },
                        input: {
                            width: textFieldSx.inputWidth,
                            transition: 'all .2s',
                        },
                        svg: {
                            cursor: 'pointer',
                        },
                        ...omit(textFieldSx, ['inputWidth']),
                    }}
                />
            </div>
        </div>
    );
};

export default Header;
