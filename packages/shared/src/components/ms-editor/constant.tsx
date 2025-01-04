/* eslint-disable no-bitwise */
/** theme css prefix */
export const THEME_PREFIX = 'ms-editor-theme';

export const NAMESPACE = 'ms-lexical-editor';

export const enum MODE {
    /** 只读 */
    READONLY = 1 << 0,
    /** 编辑 */
    EDITABLE = 1 << 1,
    /** 可读可写 */
    ALL = MODE.EDITABLE + MODE.READONLY,
}
