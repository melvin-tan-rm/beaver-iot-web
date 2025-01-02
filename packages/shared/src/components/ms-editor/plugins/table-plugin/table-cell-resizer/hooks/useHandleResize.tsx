import { MouseEventHandler, useCallback } from 'react';

import { $getNearestNodeFromDOMNode, type LexicalEditor } from 'lexical';
import {
    $computeTableMapSkipCellCheck,
    $getTableNodeFromLexicalNodeOrThrow,
    $getTableRowIndexFromTableCellNode,
    $isTableCellNode,
    $isTableRowNode,
} from '@lexical/table';
import { calculateZoomLevel } from '@lexical/utils';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import type { TableCellNode, TableDOMCell, TableMapType, TableMapValueType } from '@lexical/table';

import { MIN_COLUMN_WIDTH, MIN_ROW_HEIGHT } from '../constant';
import { isHeightChanging } from '../helper';
import type { MouseDraggingDirection, MousePosition } from '../type';

interface IProps {
    activeCell: TableDOMCell | null;
    mouseStartPosRef: React.MutableRefObject<MousePosition | null>;
    updateDraggingDirection: React.Dispatch<React.SetStateAction<MouseDraggingDirection | null>>;
    updateMouseCurrentPos: React.Dispatch<React.SetStateAction<MousePosition | null>>;
    resetState: () => void;
}
export const useHandleResize = ({
    activeCell,
    mouseStartPosRef,
    updateMouseCurrentPos,
    updateDraggingDirection,
    resetState,
}: IProps) => {
    const [editor] = useLexicalComposerContext();

    /** 获取单元格的宽度。 */
    const getCellNodeWidth = (
        cell: TableCellNode,
        activeEditor: LexicalEditor,
    ): number | undefined => {
        const width = cell.getWidth();
        if (width !== undefined) return width;

        const domCellNode = activeEditor.getElementByKey(cell.getKey());
        if (domCellNode == null) return;

        const computedStyle = getComputedStyle(domCellNode);
        return (
            domCellNode.clientWidth -
            parseFloat(computedStyle.paddingLeft) -
            parseFloat(computedStyle.paddingRight)
        );
    };
    /** 获取单元格的高度。 */
    const getCellNodeHeight = (
        cell: TableCellNode,
        activeEditor: LexicalEditor,
    ): number | undefined => {
        const domCellNode = activeEditor.getElementByKey(cell.getKey());
        return domCellNode?.clientHeight;
    };
    /** 获取单元格在表格中的列索引 */
    const getCellColumnIndex = (tableCellNode: TableCellNode, tableMap: TableMapType) => {
        for (let row = 0; row < tableMap.length; row++) {
            for (let column = 0; column < tableMap[row].length; column++) {
                if (tableMap[row][column].cell === tableCellNode) {
                    return column;
                }
            }
        }
    };

    /** 更新表格行的高度 */
    const updateRowHeight = useCallback(
        (heightChange: number) => {
            if (!activeCell) {
                throw new Error('TableCellResizer: Expected active cell.');
            }

            editor.update(
                () => {
                    // 获取最近的表格单元格节点 tableCellNode
                    const tableCellNode = $getNearestNodeFromDOMNode(activeCell.elem);
                    if (!$isTableCellNode(tableCellNode)) {
                        throw new Error('TableCellResizer: Table cell node not found.');
                    }
                    // 取表格节点 tableNode
                    const tableNode = $getTableNodeFromLexicalNodeOrThrow(tableCellNode);

                    // 获取表格单元格所在的行索引 tableRowIndex
                    const tableRowIndex = $getTableRowIndexFromTableCellNode(tableCellNode);
                    // 获取表格的所有行 tableRows
                    const tableRows = tableNode.getChildren();

                    // 检查 tableRowIndex 是否在有效范围内
                    if (tableRowIndex >= tableRows.length || tableRowIndex < 0) {
                        throw new Error('Expected table cell to be inside of table row.');
                    }
                    // 获取对应的表格行 tableRow
                    const tableRow = tableRows[tableRowIndex];

                    if (!$isTableRowNode(tableRow)) {
                        throw new Error('Expected table row');
                    }

                    // 获取表格行的高度 height
                    let height = tableRow.getHeight();
                    // 如果高度未定义，则获取该行的所有单元格，并计算这些单元格的最小高度。
                    if (height === undefined) {
                        const rowCells = tableRow.getChildren<TableCellNode>();
                        height = Math.min(
                            ...rowCells.map(cell => getCellNodeHeight(cell, editor) ?? Infinity),
                        );
                    }
                    // 计算新的高度 newHeight，确保其不小于最小行高度 MIN_ROW_HEIGHT。
                    const newHeight = Math.max(height + heightChange, MIN_ROW_HEIGHT);
                    // 设置表格行的新高度 newHeight。
                    tableRow.setHeight(newHeight);
                },
                { tag: 'skip-scroll-into-view' },
            );
        },
        [activeCell, editor],
    );
    /** 更新表格列的宽度 */
    const updateColumnWidth = useCallback(
        (widthChange: number) => {
            if (!activeCell) {
                throw new Error('TableCellResizer: Expected active cell.');
            }
            editor.update(
                () => {
                    // 获取最近的表格单元格节点 tableCellNode。
                    const tableCellNode = $getNearestNodeFromDOMNode(activeCell.elem);
                    // 检查 tableCellNode 是否为表格单元格节点
                    if (!$isTableCellNode(tableCellNode)) {
                        throw new Error('TableCellResizer: Table cell node not found.');
                    }
                    // 获取表格节点 tableNode。
                    const tableNode = $getTableNodeFromLexicalNodeOrThrow(tableCellNode);
                    // 计算表格的映射 tableMap
                    const [tableMap] = $computeTableMapSkipCellCheck(tableNode, null, null);
                    // 获取单元格所在列的索引 columnIndex
                    const columnIndex = getCellColumnIndex(tableCellNode, tableMap);
                    if (columnIndex === undefined) {
                        throw new Error('TableCellResizer: Table column not found.');
                    }

                    for (let row = 0; row < tableMap.length; row++) {
                        // 遍历 tableMap 中的每一行，获取当前列的单元格 cell
                        const cell: TableMapValueType = tableMap[row][columnIndex];
                        // 检查当前单元格是否为该行的起始单元格，并且是否为该列的最后一个单元格或下一个单元格不同。
                        if (
                            cell.startRow === row &&
                            (columnIndex === tableMap[row].length - 1 ||
                                tableMap[row][columnIndex].cell !==
                                    tableMap[row][columnIndex + 1].cell)
                        ) {
                            // 获取单元格的宽度 width。
                            const width = getCellNodeWidth(cell.cell, editor);
                            if (width === undefined) {
                                continue;
                            }
                            // 计算新的宽度 newWidth，确保其不小于最小列宽度 `MIN_COLUMN_WIDTH`
                            const newWidth = Math.max(width + widthChange, MIN_COLUMN_WIDTH);
                            // 设置单元格的新宽度 newWidth
                            cell.cell.setWidth(newWidth);
                        }
                    }
                },
                { tag: 'skip-scroll-into-view' },
            );
        },
        [activeCell, editor],
    );

    /** 处理鼠标抬起事件 */
    const mouseUpHandler = useCallback(
        (direction: MouseDraggingDirection) => {
            const handler = (event: MouseEvent) => {
                event.preventDefault();
                event.stopPropagation();
                if (!activeCell) {
                    throw new Error('TableCellResizer: Expected active cell.');
                }
                if (!mouseStartPosRef.current) return;

                // 获取鼠标起始位置的 x 和 y 坐标。
                const { x, y } = mouseStartPosRef.current;
                if (activeCell === null) return;

                // 然后计算当前缩放级别 zoom
                const zoom = calculateZoomLevel(event.target as Element);

                // 如果是调整高度，计算高度变化量 heightChange，然后调用`updateRowHeight`更新行高
                if (isHeightChanging(direction)) {
                    const heightChange = (event.clientY - y) / zoom;
                    updateRowHeight(heightChange);
                } else {
                    // 如果是调整宽度，计算宽度变化量 widthChange，然后调用`updateColumnWidth`更新列宽
                    const widthChange = (event.clientX - x) / zoom;
                    updateColumnWidth(widthChange);
                }

                resetState();
                document.removeEventListener('mouseup', handler);
            };
            return handler;
        },
        [activeCell, resetState, updateColumnWidth, updateRowHeight],
    );

    /** 用于切换调整状态。记录鼠标起始位置并更新拖拽方向，同时添加鼠标抬起事件监听。 */
    const toggleResize = useCallback(
        (direction: MouseDraggingDirection): MouseEventHandler<HTMLDivElement> =>
            event => {
                event.preventDefault();
                event.stopPropagation();
                if (!activeCell) {
                    throw new Error('TableCellResizer: Expected active cell.');
                }

                mouseStartPosRef.current = {
                    x: event.clientX,
                    y: event.clientY,
                };
                updateMouseCurrentPos(mouseStartPosRef.current);
                updateDraggingDirection(direction);

                document.addEventListener('mouseup', mouseUpHandler(direction));
            },
        [activeCell, mouseUpHandler],
    );

    return {
        toggleResize,
    };
};
