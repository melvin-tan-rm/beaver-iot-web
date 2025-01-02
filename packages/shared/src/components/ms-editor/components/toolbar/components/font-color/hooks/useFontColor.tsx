import { useEffect, useState } from 'react';
import { useMemoizedFn } from 'ahooks';
import {
    $getSelection,
    $isRangeSelection,
    COMMAND_PRIORITY_CRITICAL,
    SELECTION_CHANGE_COMMAND,
} from 'lexical';
import { $getSelectionStyleValueForProperty, $patchStyleText } from '@lexical/selection';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { DEFAULT_FONT_COLOR } from '../constant';

export const useFontColor = () => {
    const [editor] = useLexicalComposerContext();
    const [fontColor, setFontColor] = useState<string>(DEFAULT_FONT_COLOR);

    /** 下拉切换时 */
    const onChange = useMemoizedFn((value: string) => {
        updateFontColorInSelection(value);
    });

    /** 修改内容字体颜色的主要函数 */
    const updateFontColorInSelection = useMemoizedFn((newFontColor: string) => {
        editor.update(() => {
            const selection = $getSelection();
            if (selection === null) return;

            $patchStyleText(selection, {
                color: newFontColor,
            });
        });
    });

    /** 更新工具栏的显示 */
    const $updateToolbar = useMemoizedFn(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) {
            setFontColor(DEFAULT_FONT_COLOR);
            return;
        }

        /** 获取当前字号颜色 */
        const currentFontColor = $getSelectionStyleValueForProperty(
            selection,
            'color',
            DEFAULT_FONT_COLOR,
        );
        setFontColor(currentFontColor);
    });
    useEffect(() => {
        /** 监听字体颜色变化，变化时，更新工具栏 */
        return editor.registerCommand(
            SELECTION_CHANGE_COMMAND,
            () => {
                $updateToolbar();
                return false;
            },
            COMMAND_PRIORITY_CRITICAL,
        );
    }, [editor, $updateToolbar]);

    return {
        /** 字体颜色 */
        fontColor,
        /** 下拉切换时 */
        onChange,
    };
};
