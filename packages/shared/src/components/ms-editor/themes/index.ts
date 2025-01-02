import type { EditorThemeClasses } from 'lexical';
import { getEditorClass } from '../helper';

import { TableEditorTheme } from './table';
import { TextEditorTheme } from './text';

/** 常规样式主题定义 */
export const EditorTheme: EditorThemeClasses = {
    paragraph: getEditorClass('paragraph'),
    ...TableEditorTheme, // 表格主题
    ...TextEditorTheme, // 文本主题
};
