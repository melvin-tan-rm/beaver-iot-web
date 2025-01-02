import React, { useState, useMemo } from 'react';
import cls from 'classnames';
import { useMemoizedFn } from 'ahooks';
import { Menu, MenuItem } from '@mui/material';
import { ToolbarPart } from '../toolbar-part';
import { useFontColor } from './hooks';
import { FontColorOptions } from './constant';
import { ExpandMoreIcon, FormatColorTextIcon } from '../../../../../icons';
import './style.less';

interface IProps {
    /** 是否禁用 */
    disabled: boolean;
}
export default React.memo(({ disabled }: IProps) => {
    const { fontColor, onChange } = useFontColor();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const open = useMemo(() => Boolean(anchorEl), [anchorEl]);

    const handleClick = useMemoizedFn((event: React.MouseEvent<HTMLDivElement>) => {
        setAnchorEl(event.currentTarget);
    });

    const handleClose = useMemoizedFn(() => {
        setAnchorEl(null);
    });

    const menu = (
        <Menu className="toolbar-color__menu" anchorEl={anchorEl} open={open} onClose={handleClose}>
            <MenuItem className="toolbar-color__menu-item">
                <div className="color-menu__title">font_color_title</div>
                <div className="color-menu__options">
                    {FontColorOptions.map(item => {
                        return (
                            <div
                                className={cls('color-menu__block', {
                                    'color-menu__block--active': item.value === fontColor,
                                })}
                                key={item.key}
                                onClick={() => onChange(item.value)}
                            >
                                <FormatColorTextIcon sx={{ color: item.value }} />
                            </div>
                        );
                    })}
                </div>
            </MenuItem>
        </Menu>
    );

    return (
        <>
            <ToolbarPart
                disabled={disabled}
                className="ms-toolbar__color-dropdown"
                onClick={handleClick}
            >
                <div className="color-dropdown__icon">
                    <FormatColorTextIcon sx={{ color: fontColor }} className="ms-toolbar__icon" />
                </div>
                <ExpandMoreIcon className="ms-toolbar__arrow" />
            </ToolbarPart>
            {menu}
        </>
    );
});
