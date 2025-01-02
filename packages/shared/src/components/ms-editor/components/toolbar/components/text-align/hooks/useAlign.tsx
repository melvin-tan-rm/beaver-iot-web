import { useEffect, useState } from 'react';
import { useMemoizedFn } from 'ahooks';
import {
    $getSelection,
    $isRangeSelection,
    COMMAND_PRIORITY_CRITICAL,
    FORMAT_ELEMENT_COMMAND,
    SELECTION_CHANGE_COMMAND,
} from 'lexical';
import { mergeRegister } from '@lexical/utils';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { hasAlignFormat } from '../helper';

type FontAlign = 'left' | 'center' | 'right';
type FontAlignState = `is${Capitalize<FontAlign>}`;

export const useAlign = () => {
    const [editor] = useLexicalComposerContext();
    const [textAlignState, setTextAlignState] = useState<Record<FontAlignState, boolean>>({
        isLeft: false,
        isCenter: false,
        isRight: false,
    });

    /** 左对齐 */
    const insertElementLeft = useMemoizedFn(() => {
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left');
    });
    /** 居中对齐 */
    const insertElementCenter = useMemoizedFn(() => {
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center');
    });
    /** 右对齐 */
    const insertElementRight = useMemoizedFn(() => {
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right');
    });
    /** 触发对应的文字变更 */
    const onDispatch = useMemoizedFn((type: FontAlign) => {
        const strategy: Record<FontAlign, () => void> = {
            left: insertElementLeft,
            center: insertElementCenter,
            right: insertElementRight,
        };

        const fn = strategy[type];
        return fn && fn();
    });
    /** 选中时 */
    const onClick = useMemoizedFn((type: FontAlign) => {
        onDispatch(type);
    });

    /** 更新工具栏的显示 */
    const $updateToolbar = useMemoizedFn(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) {
            setTextAlignState({
                isLeft: false,
                isCenter: false,
                isRight: false,
            });
            return;
        }

        const nodes = selection.getNodes();
        const [node] = nodes || [];
        if (!node) return;

        setTextAlignState({
            isLeft: hasAlignFormat(node, 'left'),
            isCenter: hasAlignFormat(node, 'center'),
            isRight: hasAlignFormat(node, 'right'),
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
            /** 监听选中文字，变化时更新工具栏 */
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
        /** 位置状态 */
        textAlignState,
        /** 选中时 */
        onClick,
    };
};
