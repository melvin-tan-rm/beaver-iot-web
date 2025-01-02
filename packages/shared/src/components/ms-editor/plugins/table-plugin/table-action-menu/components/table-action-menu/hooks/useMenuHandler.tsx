import { useCallback } from 'react';
import { useMemoizedFn } from 'ahooks';
import { $createParagraphNode, $getRoot, $getSelection, $isParagraphNode } from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
    $deleteTableColumn__EXPERIMENTAL as $deleteTableColumn,
    $deleteTableRow__EXPERIMENTAL as $deleteTableRow,
    $getTableColumnIndexFromTableCellNode,
    $getTableNodeFromLexicalNodeOrThrow,
    $getTableRowIndexFromTableCellNode,
    $insertTableColumn__EXPERIMENTAL as $insertTableColumn,
    $insertTableRow__EXPERIMENTAL as $insertTableRow,
    $isTableCellNode,
    $isTableRowNode,
    $isTableSelection,
    $unmergeCell,
    getTableObserverFromTableElement,
    HTMLTableElementWithWithTableSelectionState,
    TableCellHeaderStates,
    TableCellNode,
    TableRowNode,
} from '@lexical/table';
import {
    computeSelectionCount,
    $selectLastDescendant,
    $cellContainsEmptyParagraph,
} from '../helper';
import type { MenuItemType } from '../types';

interface IProps {
    tableCellNode: TableCellNode;
    updateTableCellNode: React.Dispatch<React.SetStateAction<TableCellNode>>;
}
export const useMenuHandler = ({ tableCellNode, updateTableCellNode }: IProps) => {
    const [editor] = useLexicalComposerContext();

    // 清除表格选择的高亮
    const clearTableSelection = useCallback(() => {
        editor.update(() => {
            //  检查 tableCellNode 是否附加到 DOM 中
            if (tableCellNode.isAttached()) {
                // 获取表格节点。
                const tableNode = $getTableNodeFromLexicalNodeOrThrow(tableCellNode);
                // 获取表格元素
                const tableElement = editor.getElementByKey(
                    tableNode.getKey(),
                ) as HTMLTableElementWithWithTableSelectionState;

                if (!tableElement) {
                    throw new Error('Expected to find tableElement in DOM');
                }

                // 从表格元素中获取表格选择
                const tableSelection = getTableObserverFromTableElement(tableElement);
                if (tableSelection !== null) {
                    //  如果表格选择存在，则清除其高亮。
                    tableSelection.$clearHighlight();
                }

                // 标记表格节点为脏，需要重新渲染
                tableNode.markDirty();
                //  更新表格单元格节点的最新状态
                updateTableCellNode(tableCellNode.getLatest());
            }

            //  获取根节点
            const rootNode = $getRoot();
            // 选择根节点的开始位置
            rootNode.selectStart();
        });
    }, [editor, tableCellNode]);

    /** 合并单元格 */
    const mergeTableCellsAtSelection = () => {
        editor.update(() => {
            // 获取当前的选择对象
            const selection = $getSelection();
            //  检查当前选择是否为表格选择
            if (!$isTableSelection(selection)) return;

            // 计算选择的列数和行数:
            const { columns, rows } = computeSelectionCount(selection);
            // 获取选择的节点
            const nodes = selection.getNodes();

            // 遍历选择区域内的所有节点
            let firstCell: null | TableCellNode = null;
            for (let i = 0; i < nodes.length; i++) {
                const node = nodes[i];
                // 检查节点是否为表格单元格节点。
                if ($isTableCellNode(node)) {
                    // 如果 firstCell 为空，则将当前节点设置为第一个单元格节点：
                    if (firstCell === null) {
                        // 设置单元格的列跨度和行跨度。
                        node.setColSpan(columns).setRowSpan(rows);
                        firstCell = node;
                        // 检查单元格是否包含空段落。
                        const isEmpty = $cellContainsEmptyParagraph(node);
                        let firstChild;
                        // 如果单元格为空且第一个子节点是段落节点，则移除该段落节点。
                        // eslint-disable-next-line no-cond-assign
                        if (isEmpty && $isParagraphNode((firstChild = node.getFirstChild()))) {
                            firstChild.remove();
                        }
                    } else if ($isTableCellNode(firstCell)) {
                        //  检查当前单元格是否包含空段落。
                        const isEmpty = $cellContainsEmptyParagraph(node);
                        // 如果当前单元格不为空，则将其子节点追加到第一个单元格中。
                        if (!isEmpty) {
                            firstCell.append(...node.getChildren());
                        }
                        // 除当前单元格节点。
                        node.remove();
                    }
                }
            }
            // 如果 firstCell 不为空
            if (firstCell !== null) {
                // 如果第一个单元格没有子节点，则创建一个新的段落节点并添加到第一个单元格中。
                if (firstCell.getChildrenSize() === 0) {
                    firstCell.append($createParagraphNode());
                }
                // 选择第一个单元格的最后一个子节点。
                $selectLastDescendant(firstCell);
            }
        });
    };
    /** 取消合并单元格 */
    const unMergeTableCellsAtSelection = () => {
        editor.update(() => {
            $unmergeCell();
        });
    };

    /** 插入行 */
    const insertTableRowAtSelection = useCallback(
        (shouldInsertAfter: boolean, count?: number) => {
            const insertCount = count ?? 1;

            editor.update(() => {
                new Array(insertCount).fill(0).forEach(() => {
                    $insertTableRow(shouldInsertAfter);
                });
            });
        },
        [editor],
    );
    /** 插入列 */
    const insertTableColumnAtSelection = useCallback(
        (shouldInsertAfter: boolean, count?: number) => {
            const insertCount = count ?? 1;

            editor.update(() => {
                new Array(insertCount).fill(0).forEach(() => {
                    $insertTableColumn(shouldInsertAfter);
                });
            });
        },
        [editor],
    );
    /** 删除行 */
    const deleteTableRowAtSelection = useCallback(() => {
        editor.update(() => {
            $deleteTableRow();
        });
    }, [editor]);
    /** 删除列 */
    const deleteTableColumnAtSelection = useCallback(() => {
        editor.update(() => {
            $deleteTableColumn();
        });
    }, [editor]);
    /** 删除表格 */
    const deleteTableAtSelection = useCallback(() => {
        editor.update(() => {
            const tableNode = $getTableNodeFromLexicalNodeOrThrow(tableCellNode);
            tableNode.remove();

            clearTableSelection();
        });
    }, [editor, tableCellNode, clearTableSelection]);

    /** 添加/移除行标题 */
    const toggleTableRowIsHeader = useCallback(() => {
        editor.update(() => {
            const tableNode = $getTableNodeFromLexicalNodeOrThrow(tableCellNode);
            const tableRowIndex = $getTableRowIndexFromTableCellNode(tableCellNode);
            const tableRows = tableNode.getChildren();

            if (tableRowIndex >= tableRows.length || tableRowIndex < 0) {
                throw new Error('Expected table cell to be inside of table row.');
            }

            const tableRow = tableRows[tableRowIndex];
            if (!$isTableRowNode(tableRow)) {
                throw new Error('Expected table row');
            }

            tableRow.getChildren().forEach(tableCell => {
                if (!$isTableCellNode(tableCell)) {
                    throw new Error('Expected table cell');
                }

                // 添加/移除行标题
                tableCell.toggleHeaderStyle(TableCellHeaderStates.ROW);
            });

            clearTableSelection();
        });
    }, [editor, tableCellNode, clearTableSelection]);
    /** 添加/移除列标题 */
    const toggleTableColumnIsHeader = useCallback(() => {
        editor.update(() => {
            const tableNode = $getTableNodeFromLexicalNodeOrThrow(tableCellNode);
            const tableColumnIndex = $getTableColumnIndexFromTableCellNode(tableCellNode);
            const tableRows = tableNode.getChildren<TableRowNode>();
            const maxRowsLength = Math.max(...tableRows.map(row => row.getChildren().length));

            if (tableColumnIndex >= maxRowsLength || tableColumnIndex < 0) {
                throw new Error('Expected table cell to be inside of table row.');
            }

            for (let r = 0; r < tableRows.length; r++) {
                const tableRow = tableRows[r];

                if (!$isTableRowNode(tableRow)) {
                    throw new Error('Expected table row');
                }

                const tableCells = tableRow.getChildren();
                if (tableColumnIndex >= tableCells.length) {
                    continue;
                }

                const tableCell = tableCells[tableColumnIndex];

                if (!$isTableCellNode(tableCell)) {
                    throw new Error('Expected table cell');
                }

                /** 添加/移除列标题 */
                tableCell.toggleHeaderStyle(TableCellHeaderStates.COLUMN);
            }

            clearTableSelection();
        });
    }, [editor, tableCellNode, clearTableSelection]);

    /** 表格操作 */
    const handleMenuChange = useMemoizedFn((item: MenuItemType) => {
        const { key } = item;

        switch (key) {
            case 'insertAbove':
                insertTableRowAtSelection(false);
                break;
            case 'insertBelow':
                insertTableRowAtSelection(true);
                break;
            case 'insertLeft':
                insertTableColumnAtSelection(false);
                break;
            case 'insertRight':
                insertTableColumnAtSelection(true);
                break;
            case 'deleteRow':
                deleteTableRowAtSelection();
                break;
            case 'deleteColumn':
                deleteTableColumnAtSelection();
                break;
            case 'deleteTable':
                deleteTableAtSelection();
                break;
            case 'toggleRowHeader':
                toggleTableRowIsHeader();
                break;
            case 'toggleColumnHeader':
                toggleTableColumnIsHeader();
                break;
            case 'mergeCells':
                mergeTableCellsAtSelection();
                break;
            case 'unMergeCells':
                unMergeTableCellsAtSelection();
                break;
            default:
                break;
        }
    });

    return {
        handleMenuChange,
    };
};
