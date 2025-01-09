import React from 'react';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import {
    Menu,
    MenuItem,
    Avatar,
    ListItem,
    ListItemAvatar,
    ListItemText,
    ListItemIcon,
    Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { LogoutIcon } from '@milesight/shared/src/components';
import { iotLocalStorage, TOKEN_CACHE_KEY } from '@milesight/shared/src/utils/storage';
import { useI18n } from '@milesight/shared/src/hooks';

import Tooltip from '@/components/tooltip';
import { type GlobalAPISchema } from '@/services/http';

function stringToColor(string: string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
}

function stringAvatar(name: string) {
    return {
        sx: {
            width: 32,
            height: 32,
            bgcolor: stringToColor(name),
        },
        children: `${name.split(' ')[0][0]}`,
    };
}

interface MoreUserInfoProps {
    userInfo: GlobalAPISchema['getUserInfo']['response'];
}

/**
 * User information display and operation components
 */
const MoreUserInfo: React.FC<MoreUserInfoProps> = props => {
    const { userInfo } = props || {};

    const navigate = useNavigate();
    const { getIntlText } = useI18n();

    return (
        <PopupState variant="popover" popupId="user-info-menu">
            {state => (
                <div className="ms-user-info">
                    <Avatar {...stringAvatar(userInfo.nickname || '')} {...bindTrigger(state)} />
                    <Menu
                        {...bindMenu(state)}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                        }}
                        transformOrigin={{
                            vertical: 145,
                            horizontal: 'left',
                        }}
                    >
                        <ListItem sx={{ width: 230 }} alignItems="center">
                            <ListItemAvatar>
                                <Avatar {...stringAvatar(userInfo.nickname || '')} />
                            </ListItemAvatar>
                            <ListItemText
                                primary={<Tooltip title={userInfo.nickname} autoEllipsis />}
                                secondary={<Tooltip title={userInfo.email} autoEllipsis />}
                            />
                        </ListItem>
                        <Divider sx={{ marginBottom: '8px' }} />
                        <MenuItem
                            onClick={() => {
                                state.close();

                                /** Sign out logic */
                                iotLocalStorage.removeItem(TOKEN_CACHE_KEY);
                                navigate('/auth/login');
                            }}
                        >
                            <ListItemIcon>
                                <LogoutIcon />
                            </ListItemIcon>
                            {getIntlText('common.label.sign_out')}
                        </MenuItem>
                    </Menu>
                </div>
            )}
        </PopupState>
    );
};

export default MoreUserInfo;
