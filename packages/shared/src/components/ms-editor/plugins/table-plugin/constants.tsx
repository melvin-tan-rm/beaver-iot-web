import { getEditorClass } from '../../helper';

/** 拖拽样式类名 */
export const RESIZER_CELL_CLASS = 'table-cell__resizer';

/** 添加按钮的容器类名 */
export const TABLE_ADD_CONTAINER_CLASS = getEditorClass('table-add-container');
/** 添加按钮的通用类名 */
export const TABLE_ADD_BUTTON_CLASS = getEditorClass('table-add-button');
/** 添加行按钮的类名 */
export const TABLE_ADD_ROWS_CLASS = getEditorClass('table-add-rows');
/** 添加列按钮的类名 */
export const TABLE_ADD_COLUMNS_CLASS = getEditorClass('table-add-columns');
/** 添加列按钮的Icon类名 */
export const TABLE_ADD_ICON_CLASS = getEditorClass('table-add-icon');

/** 添加按钮的宽度 */
export const BUTTON_WIDTH_PX = 16;
/** 添加按钮的间距 */
export const BUTTON_WIDTH_PADDING = 4;
/** 添加按钮的总宽度 */
export const BUTTON_CONTAINER_WIDTH = BUTTON_WIDTH_PX + BUTTON_WIDTH_PADDING;

/** 表格元素 */
export const TABLE_CELL = 'table-cell';
