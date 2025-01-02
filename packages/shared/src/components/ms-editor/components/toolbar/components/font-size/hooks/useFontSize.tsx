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
import { DEFAULT_FONT_SIZE } from '../constant';

export const useFontSize = () => {
    const [editor] = useLexicalComposerContext();
    const [fontSize, setFontSize] = useState<number>(DEFAULT_FONT_SIZE);

    /** 下拉切换时 */
    const onChange = useMemoizedFn((value: React.Key) => {
        updateFontSizeInSelection(`${value}px`);
    });
    /** 修改内容字号的主要函数 */
    const updateFontSizeInSelection = useMemoizedFn((newFontSize: string) => {
        editor.update(() => {
            if (!editor.isEditable()) return;

            const selection = $getSelection();
            if (selection === null) return;

            $patchStyleText(selection, {
                'font-size': newFontSize,
            });
        });
    });

    /** 更新工具栏的显示 */
    const $updateToolbar = useMemoizedFn(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) {
            setFontSize(DEFAULT_FONT_SIZE);
            return;
        }

        /** 获取当前字号大小 */
        const currentFontSize = $getSelectionStyleValueForProperty(
            selection,
            'font-size',
            `${DEFAULT_FONT_SIZE}px`,
        );
        setFontSize(currentFontSize ? Number(currentFontSize.slice(0, -2)) : DEFAULT_FONT_SIZE);
    });
    useEffect(() => {
        /** 监听字号变化，变化时，更新工具栏 */
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
        /** 字号 */
        fontSize,
        /** 下拉切换时 */
        onChange,
    };
};
