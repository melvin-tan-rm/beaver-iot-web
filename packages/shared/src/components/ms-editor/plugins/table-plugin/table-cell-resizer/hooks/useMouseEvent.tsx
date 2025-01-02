import { useEffect, useRef } from 'react';
import { $getNearestNodeFromDOMNode } from 'lexical';
import {
    $getTableNodeFromLexicalNodeOrThrow,
    getDOMCellFromTarget,
    type TableDOMCell,
} from '@lexical/table';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useMemoizedFn } from 'ahooks';
import { delay } from '../../../../../../utils/tools';
import { isMouseDownOnEvent } from '../helper';
import type { MouseDraggingDirection, MousePosition } from '../type';

interface IProps {
    resetState: () => void;
    updateMouseCurrentPos: React.Dispatch<React.SetStateAction<MousePosition | null>>;
    updateIsMouseDown: React.Dispatch<React.SetStateAction<boolean>>;
    draggingDirection: MouseDraggingDirection | null;
    tableRectRef: React.MutableRefObject<DOMRect | null>;
    activeCell: TableDOMCell | null;
    updateActiveCell: React.Dispatch<React.SetStateAction<TableDOMCell | null>>;
}
export const useMouseEvent = ({
    resetState,
    updateMouseCurrentPos,
    updateIsMouseDown,
    draggingDirection,
    tableRectRef,
    activeCell,
    updateActiveCell,
}: IProps) => {
    const [editor] = useLexicalComposerContext();

    const targetRef = useRef<HTMLElement | null>(null);
    const resizerRef = useRef<HTMLDivElement | null>(null);

    /** 设置活动的表格项 */
    const setupActiveCell = useMemoizedFn((cell: TableDOMCell, target: HTMLElement) => {
        editor.update(() => {
            // 获取最近的表格单元格节点 tableCellNode。
            const tableCellNode = $getNearestNodeFromDOMNode(cell.elem);
            if (!tableCellNode) {
                throw new Error('TableCellResizer: Table cell node not found.');
            }

            // 获取表格节点 tableNode。
            const tableNode = $getTableNodeFromLexicalNodeOrThrow(tableCellNode);
            // 通过表格节点的键获取表格元素 tableElement。
            const tableElement = editor.getElementByKey(tableNode.getKey());

            if (!tableElement) {
                throw new Error('TableCellResizer: Table element not found.');
            }

            // 并设置新的活动单元格 activeCell
            targetRef.current = target;
            tableRectRef.current = tableElement.getBoundingClientRect();
            updateActiveCell(cell);
        });
    });
    /** 更新鼠标坐标 */
    const setupMousePos = useMemoizedFn((x: number, y: number) => {
        updateMouseCurrentPos({ x, y });
    });

    useEffect(() => {
        const onMouseMove = async (event: MouseEvent) => {
            await delay(0);

            // 正在拖拽时，更新位置
            if (draggingDirection) {
                setupMousePos(event.clientX, event.clientY);
                return;
            }

            const { target } = event;

            // 更新 `isMouseDown` 状态，用于判断鼠标是否按下
            updateIsMouseDown(isMouseDownOnEvent(event));
            if (resizerRef.current && resizerRef.current.contains(target as Node)) return;
            if (targetRef.current === target) return;

            // 获取目标元素对应的表格单元格 cell
            targetRef.current = target as HTMLElement;
            const cell = getDOMCellFromTarget(target as HTMLElement);

            // 如果 cell 存在且与当前活动单元格 activeCell 不同，则使用 editor.update 更新编辑器状态：
            if (cell && activeCell !== cell) {
                setupActiveCell(cell, target as HTMLElement);
            } else if (cell == null) {
                // 如果 cell 为空，则调用 resetState 重置状态
                resetState();
            }
        };

        // 记录鼠标按下状态
        const onMouseDown = async () => {
            await delay(0);
            updateIsMouseDown(true);
        };
        // 记录鼠标抬起状态
        const onMouseUp = async () => {
            await delay(0);
            updateIsMouseDown(false);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mousedown', onMouseDown);
        document.addEventListener('mouseup', onMouseUp);

        return () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mousedown', onMouseDown);
            document.removeEventListener('mouseup', onMouseUp);
        };
    }, [activeCell, draggingDirection, editor, resetState]);
};
