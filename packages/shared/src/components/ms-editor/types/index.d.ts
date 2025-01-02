import type { LexicalEditor, SerializedEditorState, SerializedLexicalNode } from 'lexical';
import type { InsertTableCommandPayload } from '@lexical/table';
import { MODE } from '../constant';

/** 编辑器实例类型 */
export type MSEditor = LexicalEditor;
export interface IEditorProps {
    /** 默认编辑模式 */
    defaultEditable?: boolean;
    /** 是否可编辑 */
    isEditable?: boolean;
    /** 更改编辑模式回调 */
    onEditableChange?: (editable: boolean) => void;
    /** 模式 */
    mode?: MODE;
    /** 输入提示文字 */
    placeholder?: string;
    /** 保存函数 */
    onSave?: (content: SerializedEditorState<SerializedLexicalNode>) => void;
    /** 取消函数 */
    onCancel?: () => Promise<void> | void;
    /** 富文本配置 */
    editorConfig?: EditorConfig;
    /** 渲染操作按钮函数 */
    renderOperator?: (node: React.ReactNode) => React.ReactNode;
}
/** 富文本配置 */
export interface EditorConfig {
    /** 工具栏位置配置 */
    toolbar?:
        | (
              | FontSizeItemConfig
              | TextFormatItemConfig
              | FontColorItemConfig
              | TextAlignItemConfig
              | TableItemConfig
          )[]
        | boolean;
    /** 插件配置 */
    plugin?: EditorPlugin;
}

export interface EditorPlugin {
    table: (HoverActionTablePlugin | CellResizeTablePlugin | actionMenuTablePlugin)[];
}
export interface EditorTablePlugin<T extends string> {
    name: T;
    load?: boolean;
}
export interface HoverActionTablePlugin extends EditorTablePlugin<'table-hover-action'> {
    config?: {
        row?: boolean;
        column?: boolean;
    };
}
export interface CellResizeTablePlugin extends EditorTablePlugin<'table-cell-resizer'> {
    config?: {
        row?: boolean;
        column?: boolean;
    };
}
export interface actionMenuTablePlugin extends EditorTablePlugin<'table-action-menu'> {
    config?: {
        /** 操作菜单显示配置 */
        menus: Partial<Record<MenuType, boolean>>;
        /** 是否显示横线 */
        isDivider?: boolean;
    };
}

/** 工具栏配置 */
export interface ToolbarItemConfig<T extends string = string> {
    name: T;
    visible?: boolean;
}
/** 文字大小配置 */
export type FontSizeItemConfig = ToolbarItemConfig<'fontSize'>;

/** 文本格式化配置 */
export interface TextFormatItemConfig extends ToolbarItemConfig<'textFormat'> {
    items?: ToolbarItemConfig<'fontBold' | 'fontItalic' | 'fontUnderline' | 'fontStrikethrough'>[];
}
/** 文字颜色配置 */
export type FontColorItemConfig = ToolbarItemConfig<'fontColor'>;

/** 文本位置配置 */
export interface TextAlignItemConfig extends ToolbarItemConfig<'textAlign'> {
    items?: ToolbarItemConfig<'textAlignLeft' | 'textAlignCenter' | 'textAlignRight'>[];
}
/** 表格配置 */
export interface TableItemConfig extends ToolbarItemConfig<'table'> {
    initConfig?: Partial<InsertTableCommandPayload>;
}

export interface EditorHandlers {
    /** 获取富文本实例 */
    getEditor: () => MSEditor;
    /** 获取富文本的html结构 */
    getEditorHtml: () => Promise<string>;
    /** 设置富文本内容 */
    setEditorContent: (content: string | SerializedEditorState) => void;
}

/** 工具栏组件属性 */
export interface ToolbarProps {
    /** 类名 */
    className?: string;
    /** 是否禁用 */
    disabled?: boolean;
    /** 是否选中 */
    isActive?: boolean;
    /** 点击事件 */
    onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
    children: React.ReactNode;
}

/** 表格右键操作菜单项 */
export type MenuType =
    | 'insertAbove'
    | 'insertBelow'
    | 'insertLeft'
    | 'insertRight'
    | 'deleteRow'
    | 'deleteColumn'
    | 'deleteTable'
    | 'toggleRowHeader'
    | 'toggleColumnHeader'
    | 'mergeCells'
    | 'unMergeCells';

export type * from 'lexical';
export type * from '@lexical/table';
