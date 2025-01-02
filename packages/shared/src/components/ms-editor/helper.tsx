/* eslint-disable no-bitwise */
import { MODE, THEME_PREFIX } from './constant';

/**
 * 返回富文本编译器的Class类名
 * @tag 工具类
 */
export const getEditorClass = (className: string) => {
    return `${THEME_PREFIX}__${className}`;
};

/**
 * 是否有可编辑权限
 * @param mode 权限位
 * @tag 工具类
 */
export const hasEditable = (mode: number | MODE) => {
    return !!(mode & MODE.EDITABLE);
};

/**
 * 是否有可只读权限
 * @param mode 权限位
 * @tag 工具类
 */
export const hasReadOnly = (mode: number | MODE) => {
    return !!(mode & MODE.READONLY);
};

/**
 * 获取富文本编辑器滚动容器
 * @tag 工具类
 */
export const getEditorContent = () => {
    return document.querySelector('.ms-editor-content') as HTMLElement;
};
