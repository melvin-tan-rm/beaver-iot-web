import type { EditorThemeClasses } from 'lexical';
import { getEditorClass } from '../../helper';
import './table.less';

/** 表格样式主题定义 */
export const TableEditorTheme: EditorThemeClasses = {
    table: getEditorClass('table'),
    tableCell: getEditorClass('table-cell'),
    tableCellHeader: getEditorClass('table-cell-header'),
    tableSelected: getEditorClass('table-selected'),
    tableSelection: getEditorClass('table-selection'),
    tableCellResizer: getEditorClass('table-cell-resizer'),
};
