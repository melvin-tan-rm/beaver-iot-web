/* eslint-disable no-bitwise */
import type { MouseDraggingDirection } from './type';

/** 判断当前拖拽方向是否为调整高度 */
export const isHeightChanging = (direction: MouseDraggingDirection) => direction === 'bottom';

/** 检查鼠标是否按下 */
export const isMouseDownOnEvent = (event: MouseEvent) => (event.buttons & 1) === 1;
