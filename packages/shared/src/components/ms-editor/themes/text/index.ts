import type { EditorThemeClasses } from 'lexical';
import { getEditorClass } from '../../helper';
import './text.less';

/** 文字样式主题定义 */
export const TextEditorTheme: EditorThemeClasses = {
    text: {
        bold: getEditorClass('text-bold'),
        code: getEditorClass('text-code'),
        italic: getEditorClass('text-italic'),
        strikethrough: getEditorClass('text-strike-through'),
        underline: getEditorClass('text-underline'),
        underlineStrikethrough: getEditorClass('text-underline-strike-through'),
        subscript: getEditorClass('text-subscript'),
        superscript: getEditorClass('text-superscript'),
    },
};
