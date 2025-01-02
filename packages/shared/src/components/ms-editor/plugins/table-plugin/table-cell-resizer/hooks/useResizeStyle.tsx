import { useCallback } from 'react';
import { TableDOMCell } from '@lexical/table';
import { calculateZoomLevel } from '@lexical/utils';
import { useMemoizedFn } from 'ahooks';
import { useTheme } from '../../../../../../hooks';
import { isHeightChanging } from '../helper';
import type { MouseDraggingDirection, MousePosition } from '../type';

interface IProps {
    activeCell: TableDOMCell | null;
    draggingDirection: MouseDraggingDirection | null;
    mouseCurrentPos: MousePosition | null;
    tableRectRef: React.MutableRefObject<DOMRect | null>;
    anchorElem: HTMLElement;
}
interface IStyle {
    bottom: React.CSSProperties;
    right: React.CSSProperties;
}
export const useResizeStyle = ({
    activeCell,
    draggingDirection,
    mouseCurrentPos,
    tableRectRef,
    anchorElem,
}: IProps) => {
    const { getCSSVariableValue } = useTheme();

    /**
     * 定义了两个基本样式对象 styles，分别用于调整底部（bottom）和右侧（right）的手柄样式。
     */
    const initStyles = useMemoizedFn((activeCell: TableDOMCell): IStyle => {
        // 获取活动单元格的尺寸和位置
        const { height, width, top, left } = activeCell.elem.getBoundingClientRect();
        const zoneWidth = 4; // 定义了可以拖拽的边缘区域宽度

        const { y: editorElemY, left: editorElemLeft } = anchorElem.getBoundingClientRect();
        return {
            bottom: {
                backgroundColor: 'none',
                cursor: 'row-resize',
                height: `${zoneWidth}px`,
                left: `${window.scrollX - editorElemLeft + left}px`,
                top: `${window.scrollY - editorElemY + top + height - zoneWidth / 2}px`,
                width: `${width}px`,
            },
            right: {
                backgroundColor: 'none',
                cursor: 'col-resize',
                height: `${height}px`,
                left: `${window.scrollX - editorElemLeft + left + width - zoneWidth / 2}px`,
                top: `${window.scrollY - editorElemY + top}px`,
                width: `${zoneWidth}px`,
            },
        };
    });

    /** 根据拖拽方向和位置调整相应的手柄样式 */
    const updateStyle = useMemoizedFn(
        (
            activeCell: TableDOMCell,
            styles: IStyle,
            draggingDirection: MouseDraggingDirection | null,
        ) => {
            const tableRect = tableRectRef.current;
            if (!(draggingDirection && mouseCurrentPos && tableRect)) return styles;

            const { y: editorElemY, left: editorElemLeft } = anchorElem.getBoundingClientRect();
            const zoom = calculateZoomLevel(activeCell!.elem);
            // 设置拖拽线的宽度
            const solidWidth = 2;
            // 设置拖拽线的颜色
            const solidColor = getCSSVariableValue('--border-color-blue');

            // 根据拖拽方向调整相应的手柄样式：
            if (isHeightChanging(draggingDirection)) {
                // 如果拖拽方向是调整高度，则更新手柄和竖线的位置
                styles[draggingDirection].left = `${
                    window.scrollX - editorElemLeft + tableRect.left
                }px`;
                styles[draggingDirection].top = `${
                    window.scrollY - editorElemY + mouseCurrentPos.y / zoom
                }px`;
                styles[draggingDirection].height = `${solidWidth}px`;
                styles[draggingDirection].width = `${tableRect.width}px`;
            } else {
                // 如果拖拽方向是调整宽度，则更新手柄和横线的位置
                styles[draggingDirection].top = `${window.scrollY - editorElemY + tableRect.top}px`;
                styles[draggingDirection].left = `${
                    window.scrollX - editorElemLeft + mouseCurrentPos.x / zoom
                }px`;
                styles[draggingDirection].width = `${solidWidth}px`;
                styles[draggingDirection].height = `${tableRect.height}px`;
            }

            styles[draggingDirection].backgroundColor = solidColor;
            return styles;
        },
    );

    /** 用于获取调整手柄的样式。根据活动单元格的位置和尺寸，以及拖拽方向和鼠标当前位置，计算调整手柄的样式。 */
    const getResizes = useCallback(() => {
        if (!activeCell) {
            // 没有活动单元格，则返回空对象。
            return {
                bottom: null,
                left: null,
                right: null,
                top: null,
            };
        }

        // 初始化手柄样式
        const styles = initStyles(activeCell);
        // 根据拖拽方向和位置调整相应的手柄样式
        return updateStyle(activeCell, styles, draggingDirection);
    }, [activeCell, draggingDirection, mouseCurrentPos, getCSSVariableValue]);

    return {
        getResizes,
    };
};
