/* eslint-disable no-bitwise */
import { MODE, THEME_PREFIX } from './constant';

/**
 * returns the editor class name
 */
export const getEditorClass = (className: string) => {
    return `${THEME_PREFIX}__${className}`;
};

/**
 * whether editable
 * @param mode
 */
export const hasEditable = (mode: number | MODE) => {
    return !!(mode & MODE.EDITABLE);
};

/**
 * whether read only
 * @param mode
 */
export const hasReadOnly = (mode: number | MODE) => {
    return !!(mode & MODE.READONLY);
};

/**
 * get editor container html node
 */
export const getEditorContent = () => {
    return document.querySelector('.ms-editor-content') as HTMLElement;
};
