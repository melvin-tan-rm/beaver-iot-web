import { useEffect } from 'react';
import { TableCellNode } from '@lexical/table';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

interface IProps {
    tableCellNode: TableCellNode;
    updateTableCellNode: React.Dispatch<React.SetStateAction<TableCellNode>>;
}
export const useMutation = ({ tableCellNode, updateTableCellNode }: IProps) => {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        // 监听`TableCellNode`类型节点的变化
        return editor.registerMutationListener(
            TableCellNode,
            nodeMutations => {
                // 检查节点是否更新
                const nodeUpdated = nodeMutations.get(tableCellNode.getKey()) === 'updated';
                if (!nodeUpdated) return;

                // 获取最新的 tableCellNode
                editor.getEditorState().read(() => {
                    updateTableCellNode(tableCellNode.getLatest());
                });
            },
            // { skipInitialization: true },
        );
    }, [editor, tableCellNode]);
};
