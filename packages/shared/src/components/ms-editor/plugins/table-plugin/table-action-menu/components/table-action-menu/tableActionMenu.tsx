import { useState } from 'react';
import { Divider, Menu, MenuItem } from '@mui/material';
import { TableCellNode } from '@lexical/table';
import { useMenuItems, useMenuHandler, useMutation } from './hooks';
import type { MenuDividerType, MenuItemType } from './types';
import type { actionMenuTablePlugin } from '../../../../../types';
import './index.less';

type TableCellActionMenuProps = Readonly<{
    anchorEl: HTMLElement | null;
    open: boolean;
    tableCellNode: TableCellNode;
    plugin?: actionMenuTablePlugin;
}>;

export default ({
    anchorEl,
    open,
    tableCellNode: _tableCellNode,
    plugin,
}: TableCellActionMenuProps) => {
    const [tableCellNode, updateTableCellNode] = useState(_tableCellNode);

    // 监听表格节点变化
    useMutation({ tableCellNode, updateTableCellNode });
    // 菜单集合
    const menuItems = useMenuItems({ tableCellNode, plugin });
    // 菜单点击事件
    const { handleMenuChange } = useMenuHandler({
        tableCellNode,
        updateTableCellNode,
    });

    return (
        <Menu anchorEl={anchorEl} className="ms-editor-table__menu" open={open}>
            {menuItems.map(menu => {
                if ((menu as MenuDividerType)?.type === 'divider') {
                    return <Divider key={Math.random()} className="ms-editor-menu__divider" />;
                }

                const { key, text } = (menu as MenuItemType) || {};
                return (
                    <MenuItem key={key} onClick={() => handleMenuChange(menu as MenuItemType)}>
                        {text}
                    </MenuItem>
                );
            })}
        </Menu>
    );
};
