import { useEffect, useState } from 'react';
import { useDebounceFn, useMemoizedFn } from 'ahooks';

import { $getNearestNodeFromDOMNode } from 'lexical';
import {
    $getTableColumnIndexFromTableCellNode,
    $getTableRowIndexFromTableCellNode,
    $isTableCellNode,
    $isTableNode,
    TableCellNode,
    TableNode,
    TableRowNode,
} from '@lexical/table';
import { $findMatchingParent } from '@lexical/utils';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

import { getMouseInfo } from '../helper';
import { useWhenScroll } from './useWhenScroll';
import { BUTTON_CONTAINER_WIDTH } from '../../constants';

interface IProps {
    anchorElem: HTMLElement;
    isEditable: boolean;
    shouldListenMouseMove: boolean;
    setShownRow: React.Dispatch<React.SetStateAction<boolean>>;
    setShownColumn: React.Dispatch<React.SetStateAction<boolean>>;
    tableDOMNodeRef: React.MutableRefObject<HTMLElement | null>;
}
export const useShowBtn = ({
    anchorElem,
    isEditable,
    shouldListenMouseMove,
    setShownRow,
    setShownColumn,
    tableDOMNodeRef,
}: IProps) => {
    const [editor] = useLexicalComposerContext();
    const [position, setPosition] = useState({});

    /**
     * 获取表格节点
     */
    const getTableNodeElement = useMemoizedFn((tableDOMNode: HTMLElement) => {
        if (!tableDOMNode) return;

        tableDOMNodeRef.current = tableDOMNode;

        let hoveredRowNode: TableCellNode | null = null;
        let hoveredColumnNode: TableCellNode | null = null;
        let tableDOMElement: HTMLElement | null = null;

        editor.update(() => {
            // 获取最近的表格单元格节点。
            const maybeTableCell = $getNearestNodeFromDOMNode(tableDOMNode);
            if (!$isTableCellNode(maybeTableCell)) return;

            // 查找包含该单元格的表格节点
            const table = $findMatchingParent(maybeTableCell, node => $isTableNode(node));
            if (!$isTableNode(table)) return;

            // 获取表格 DOM 元素。
            tableDOMElement = editor.getElementByKey(table?.getKey());
            if (!tableDOMElement) return;

            // 获取表格的行数和列数。
            const rowCount = table.getChildrenSize();
            const colCount = (
                (table as TableNode).getChildAtIndex(0) as TableRowNode
            )?.getChildrenSize();

            // 获取当前单元格的行索引和列索引。
            const rowIndex = $getTableRowIndexFromTableCellNode(maybeTableCell);
            const colIndex = $getTableColumnIndexFromTableCellNode(maybeTableCell);

            // 判断当前单元格是否是最后一行或最后一列，并相应地设置 `hoveredRowNode` 或 `hoveredColumnNode。`
            if (rowIndex === rowCount - 1) {
                hoveredRowNode = maybeTableCell;
            } else if (colIndex === colCount - 1) {
                hoveredColumnNode = maybeTableCell;
            }
        });

        return {
            tableDOMElement,
            hoveredRowNode,
            hoveredColumnNode,
        };
    });

    /**
     * 设置按钮的样式
     */
    const setupBtnStyle = useMemoizedFn(
        (
            tableDOMElement: HTMLElement,
            hoveredRowNode: TableCellNode | null,
            hoveredColumnNode: TableCellNode | null,
        ) => {
            if (!tableDOMElement) return;

            // 获取表格 DOM 元素的位置信息:
            const {
                width: tableElemWidth,
                y: tableElemY,
                x: tableElemX,
                right: tableElemRight,
                bottom: tableElemBottom,
                height: tableElemHeight,
            } = (tableDOMElement as HTMLTableElement).getBoundingClientRect();
            // 获取挂载点的位置信息
            const { y: editorElemY, left: editorElemLeft } = anchorElem.getBoundingClientRect();

            // 根据鼠标悬停的位置更新 UI:
            if (hoveredRowNode) {
                setShownColumn(false);
                setShownRow(true);
                setPosition({
                    height: BUTTON_CONTAINER_WIDTH,
                    left: tableElemX - editorElemLeft,
                    top: tableElemBottom - editorElemY,
                    width: tableElemWidth,
                });
            } else if (hoveredColumnNode) {
                setShownColumn(true);
                setShownRow(false);
                setPosition({
                    height: tableElemHeight,
                    left: tableElemRight - editorElemLeft,
                    top: tableElemY - editorElemY,
                    width: BUTTON_CONTAINER_WIDTH,
                });
            }
        },
    );

    /** 隐藏添加按钮 */
    const hiddenButton = useMemoizedFn(() => {
        setShownRow(false);
        setShownColumn(false);
        cancelDebouncedOnMouseMove();
    });
    // 滚动时，隐藏按钮
    const { getIsScroll } = useWhenScroll(hiddenButton);

    const { run: debouncedOnMouseMove, cancel: cancelDebouncedOnMouseMove } = useDebounceFn(
        (event: MouseEvent) => {
            if (getIsScroll()) return;

            const { isOutside, tableDOMNode } = getMouseInfo(event);

            if (isOutside) {
                // 鼠标不在表格内，不显示增加按钮
                setShownRow(false);
                setShownColumn(false);
                return;
            }
            if (!tableDOMNode) return;

            const { tableDOMElement, hoveredRowNode, hoveredColumnNode } =
                getTableNodeElement(tableDOMNode) || {};
            if (!tableDOMElement) return;

            setupBtnStyle(tableDOMElement, hoveredRowNode!, hoveredColumnNode!);
        },
        {
            wait: 50,
            maxWait: 250,
        },
    );

    useEffect(() => {
        if (!shouldListenMouseMove || !isEditable) return;

        document.addEventListener('mousemove', debouncedOnMouseMove);

        return () => {
            document.removeEventListener('mousemove', debouncedOnMouseMove);
        };
    }, [shouldListenMouseMove, debouncedOnMouseMove, cancelDebouncedOnMouseMove, isEditable]);

    return {
        position,
    };
};
