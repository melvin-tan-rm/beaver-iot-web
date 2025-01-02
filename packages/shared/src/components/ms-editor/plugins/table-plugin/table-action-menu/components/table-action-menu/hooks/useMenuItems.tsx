/* eslint-disable no-bitwise */
import { useEffect, useMemo, useState } from 'react';
import { $getSelection } from 'lexical';
import { $isTableSelection, TableCellHeaderStates, type TableCellNode } from '@lexical/table';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { computeSelectionCount, isTableSelectionRectangular, $canUnmerge } from '../helper';
import type { ItemType } from '../types';
import type { actionMenuTablePlugin } from '../../../../../../types';

interface IProps {
    tableCellNode: TableCellNode;
    plugin?: actionMenuTablePlugin;
}
export const useMenuItems = ({ tableCellNode, plugin }: IProps) => {
    const { config } = plugin || {};
    const [editor] = useLexicalComposerContext();
    const [canMergeCells, setCanMergeCells] = useState(false);
    const [canUnMergeCell, setCanUnMergeCell] = useState(false);

    // 判断合并/取消合并单元格
    useEffect(() => {
        editor.getEditorState().read(() => {
            // 获取当前的选择对象
            const selection = $getSelection();

            // 检查当前选择是否是表格选择。
            if ($isTableSelection(selection)) {
                // 计算当前选择的行和列数。
                const currentSelectionCounts = computeSelectionCount(selection);
                // 设置是否可以合并单元格的状态
                setCanMergeCells(
                    isTableSelectionRectangular(selection) &&
                        (currentSelectionCounts.columns > 1 || currentSelectionCounts.rows > 1),
                );
            }
            // 取消合并单元格逻辑
            setCanUnMergeCell($canUnmerge());
        });
    }, [editor]);

    return useMemo<ItemType[]>(() => {
        let menus: ItemType[] = [
            {
                key: 'insertAbove',
                text: 'insert_rows_above',
            },
            {
                key: 'insertBelow',
                text: 'insert_rows_below',
            },
            {
                type: 'divider',
            },
            {
                key: 'insertLeft',
                text: 'insert_left_column',
            },
            {
                key: 'insertRight',
                text: 'insert_right_column',
            },
            {
                type: 'divider',
            },
            {
                key: 'deleteRow',
                text: 'delete_rows',
            },
            {
                key: 'deleteColumn',
                text: 'delete_columns',
            },
            {
                key: 'deleteTable',
                text: 'delete_table',
            },
            {
                type: 'divider',
            },
            {
                key: 'toggleRowHeader',
                text:
                    (tableCellNode.__headerState & TableCellHeaderStates.ROW) ===
                    TableCellHeaderStates.ROW
                        ? 'remove_column_header'
                        : 'add_row_header',
            },
            {
                key: 'toggleColumnHeader',
                text:
                    (tableCellNode.__headerState & TableCellHeaderStates.COLUMN) ===
                    TableCellHeaderStates.COLUMN
                        ? 'remove_column_header'
                        : 'add_column_header',
            },
        ];

        if (canMergeCells) {
            // 合并单元格
            menus = [
                {
                    key: 'mergeCells',
                    text: 'merge_cells',
                },
                {
                    type: 'divider',
                },
                ...menus,
            ];
        }
        if (canUnMergeCell) {
            // 拆分单元格
            menus = [
                {
                    key: 'unMergeCells',
                    text: 'unmerge_cells',
                },
                {
                    type: 'divider',
                },
                ...menus,
            ];
        }

        let currentType = '';
        return menus.filter(menu => {
            // 控制菜单项是否显示
            if ('key' in menu) {
                const { key } = menu;
                const flag = config?.menus?.[key] ?? true;
                flag && (currentType = 'menu');
                return flag;
            }

            // 控制横线是否显示
            if ('type' in menu) {
                if (currentType === 'divider') return false;

                const { isDivider } = config || {};
                const flag = isDivider ?? true;
                flag && (currentType = 'divider');
                return flag;
            }
            return true;
        });
    }, [canMergeCells, canUnMergeCell, tableCellNode, config]);
};
