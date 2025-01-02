/* eslint-disable no-bitwise */
/** 主题样式前缀 */
export const THEME_PREFIX = 'ms-editor-theme';

/** 命名空间 */
export const NAMESPACE = 'ms-lexical-editor';

/** 模式枚举 */
export const enum MODE {
    /** 只读 */
    READONLY = 1 << 0,
    /** 编辑 */
    EDITABLE = 1 << 1,
    /** 可读可写 */
    ALL = MODE.EDITABLE + MODE.READONLY,
}
