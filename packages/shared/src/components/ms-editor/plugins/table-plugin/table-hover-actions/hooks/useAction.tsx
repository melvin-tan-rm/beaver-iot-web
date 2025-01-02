import { useEffect, useRef } from 'react';
import { useMemoizedFn } from 'ahooks';

import { $getNearestNodeFromDOMNode, NodeKey } from 'lexical';
import {
    $insertTableColumn__EXPERIMENTAL as $insertTableColumn,
    $insertTableRow__EXPERIMENTAL as $insertTableRow,
    TableNode,
} from '@lexical/table';
import { mergeRegister } from '@lexical/utils';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

interface IProps {
    setShouldListenMouseMove: React.Dispatch<React.SetStateAction<boolean>>;
    setShownRow: React.Dispatch<React.SetStateAction<boolean>>;
    setShownColumn: React.Dispatch<React.SetStateAction<boolean>>;
    tableDOMNodeRef: React.MutableRefObject<HTMLElement | null>;
}
export const useAction = ({
    setShouldListenMouseMove,
    setShownRow,
    setShownColumn,
    tableDOMNodeRef,
}: IProps) => {
    const [editor] = useLexicalComposerContext();
    const codeSetRef = useRef<Set<NodeKey>>(new Set());

    useEffect(() => {
        return mergeRegister(
            // 用于注册一个监听器，以监听 TableNode 类型的节点的变化。
            editor.registerMutationListener(
                TableNode,
                mutations => {
                    // 读取编辑器的上下文状态
                    editor.getEditorState().read(() => {
                        // 记录表格的增减，`shouldListenMouseMove`维护判断富文本中是否还有表格,
                        for (const [key, type] of mutations) {
                            switch (type) {
                                case 'created':
                                    codeSetRef.current.add(key);
                                    setShouldListenMouseMove(codeSetRef.current.size > 0);
                                    break;

                                case 'destroyed':
                                    codeSetRef.current.delete(key);
                                    setShouldListenMouseMove(codeSetRef.current.size > 0);
                                    break;

                                default:
                                    break;
                            }
                        }
                    });
                },
                // { skipInitialization: false },
            ),
        );
    }, [editor]);

    /** 操作按钮 */
    const insertAction = useMemoizedFn((insertRow: boolean) => {
        editor.update(() => {
            if (tableDOMNodeRef.current) {
                const maybeTableNode = $getNearestNodeFromDOMNode(tableDOMNodeRef.current);
                maybeTableNode?.selectEnd();

                if (insertRow) {
                    // 添加行
                    $insertTableRow();
                    setShownRow(false);
                } else {
                    // 添加列
                    $insertTableColumn();
                    setShownColumn(false);
                }
            }
        });
    });

    return {
        insertAction,
    };
};
