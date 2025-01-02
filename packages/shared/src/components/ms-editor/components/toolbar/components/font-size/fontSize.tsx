import React, { useState, useMemo } from 'react';
import { useMemoizedFn } from 'ahooks';
import { Menu, MenuItem } from '@mui/material';
import { ToolbarPart } from '../toolbar-part';
import { FontSizeOptions } from './constant';
import { useFontSize } from './hooks';
import { ExpandMoreIcon } from '../../../../../icons';
import './style.less';

interface IProps {
    /** 是否禁用 */
    disabled: boolean;
}
export default React.memo(({ disabled }: IProps) => {
    const { fontSize, onChange } = useFontSize();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const open = useMemo(() => Boolean(anchorEl), [anchorEl]);

    const handleClick = useMemoizedFn((event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    });

    const handleClose = useMemoizedFn(() => {
        setAnchorEl(null);
    });

    const menu = (
        <Menu className="toolbar-size__menu" anchorEl={anchorEl} open={open} onClose={handleClose}>
            {FontSizeOptions.map(item => {
                return (
                    <MenuItem
                        key={item.value}
                        selected={fontSize === item.value}
                        onClick={() => onChange(item.value)}
                    >
                        {item.label}
                    </MenuItem>
                );
            })}
        </Menu>
    );

    return (
        <>
            <ToolbarPart
                disabled={disabled}
                className="ms-toolbar__size-dropdown"
                onClick={handleClick}
            >
                <span>{`${fontSize}px`}</span>
                <ExpandMoreIcon />
            </ToolbarPart>
            {menu}
        </>
    );
});
