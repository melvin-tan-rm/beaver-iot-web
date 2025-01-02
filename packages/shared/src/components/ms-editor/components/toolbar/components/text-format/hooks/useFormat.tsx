import { useEffect, useState } from 'react';
import { useMemoizedFn } from 'ahooks';
import {
    $getSelection,
    $isRangeSelection,
    COMMAND_PRIORITY_CRITICAL,
    FORMAT_TEXT_COMMAND,
    SELECTION_CHANGE_COMMAND,
} from 'lexical';
import { mergeRegister } from '@lexical/utils';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

type FontFormat = 'bold' | 'italic' | 'underline' | 'strikethrough';
type FontFormatState = `is${Capitalize<FontFormat>}`;
export const useFormat = () => {
    const [editor] = useLexicalComposerContext();
    const [textFormatState, setTextFormatState] = useState<Record<FontFormatState, boolean>>({
        isBold: false,
        isItalic: false,
        isUnderline: false,
        isStrikethrough: false,
    });

    /** 加粗 */
    const insertBold = useMemoizedFn(() => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
    });
    /** 斜体 */
    const insertItalic = useMemoizedFn(() => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
    });
    /** 下划线 */
    const insertUnderline = useMemoizedFn(() => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
    });
    /** 删除线 */
    const insertStrikethrough = useMemoizedFn(() => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
    });
    /** 触发对应的文字变更 */
    const onDispatch = useMemoizedFn((type: FontFormat) => {
        const strategy: Record<FontFormat, () => void> = {
            bold: insertBold,
            italic: insertItalic,
            underline: insertUnderline,
            strikethrough: insertStrikethrough,
        };

        const fn = strategy[type];
        return fn && fn();
    });
    /** 选中时 */
    const onClick = useMemoizedFn((type: FontFormat) => {
        onDispatch(type);
    });

    /** 更新工具栏的显示 */
    const $updateToolbar = useMemoizedFn(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) {
            setTextFormatState({
                isBold: false,
                isItalic: false,
                isUnderline: false,
                isStrikethrough: false,
            });
            return;
        }

        setTextFormatState({
            isBold: selection.hasFormat('bold'),
            isItalic: selection.hasFormat('italic'),
            isUnderline: selection.hasFormat('underline'),
            isStrikethrough: selection.hasFormat('strikethrough'),
        });
    });
    useEffect(() => {
        return mergeRegister(
            /** 当内容变化时 */
            editor.registerUpdateListener(({ editorState }) => {
                editorState.read(() => {
                    $updateToolbar();
                });
            }),
            /** 监听字号变化，变化时，更新工具栏 */
            editor.registerCommand(
                SELECTION_CHANGE_COMMAND,
                () => {
                    $updateToolbar();
                    return false;
                },
                COMMAND_PRIORITY_CRITICAL,
            ),
        );
    }, [editor, $updateToolbar]);

    return {
        /** 字体状态 */
        textFormatState,
        /** 选中时 */
        onClick,
    };
};
