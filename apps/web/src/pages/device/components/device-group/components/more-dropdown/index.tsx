import React, { useMemo } from 'react';
import { useMemoizedFn } from 'ahooks';
import { IconButton, Menu, MenuItem, ListItemIcon } from '@mui/material';
import PopupState, { bindTrigger, bindMenu, type InjectedProps } from 'material-ui-popup-state';

import { MoreVertIcon, EditIcon, DeleteOutlineIcon } from '@milesight/shared/src/components';
import { useI18n } from '@milesight/shared/src/hooks';

export enum MORE_OPERATION {
    RENAME = 'rename',
    DELETE = 'delete',
}

export interface MoreDropdownProps {
    isActive: boolean;
    onOperation?: (operation: MORE_OPERATION) => void;
}

/**
 * More Dropdown component
 */
const MoreDropdown: React.FC<MoreDropdownProps> = props => {
    const { isActive, onOperation } = props;

    const { getIntlText } = useI18n();

    const options: {
        label: string;
        value: MORE_OPERATION;
        icon: React.ReactNode;
    }[] = useMemo(() => {
        return [
            {
                label: getIntlText('common.label.rename'),
                value: MORE_OPERATION.RENAME,
                icon: (
                    <ListItemIcon>
                        <EditIcon />
                    </ListItemIcon>
                ),
            },
            {
                label: getIntlText('common.label.delete'),
                value: MORE_OPERATION.DELETE,
                icon: (
                    <ListItemIcon>
                        <DeleteOutlineIcon />
                    </ListItemIcon>
                ),
            },
        ];
    }, [getIntlText]);

    const handleMenuItemClick = useMemoizedFn((state: InjectedProps, operate: MORE_OPERATION) => {
        state.close();
        /**
         * Trigger the corresponding event here
         */
        onOperation?.(operate);
    });

    return (
        <PopupState variant="popover" popupId="device-group-more-dropdown-menu">
            {state => (
                <div
                    className="more-dropdown__wrapper"
                    style={state.isOpen ? { visibility: 'visible' } : undefined}
                >
                    <IconButton
                        id="more-button"
                        color={isActive ? 'primary' : 'default'}
                        sx={{ padding: '4px' }}
                        {...bindTrigger(state)}
                    >
                        <MoreVertIcon />
                    </IconButton>
                    <Menu id="dropdown-menu" {...bindMenu(state)}>
                        {options.map(option => (
                            <MenuItem
                                key={option.value}
                                onClick={() => handleMenuItemClick(state, option.value)}
                            >
                                {option.icon}
                                {option.label}
                            </MenuItem>
                        ))}
                    </Menu>
                </div>
            )}
        </PopupState>
    );
};

export default MoreDropdown;
