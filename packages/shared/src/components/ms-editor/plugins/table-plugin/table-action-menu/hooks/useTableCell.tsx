import { useCallback, useEffect } from 'react';
import { $getSelection, $isRangeSelection } from 'lexical';
import { $getTableCellNodeFromLexicalNode, type TableCellNode } from '@lexical/table';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

interface IProps {
    menuRootRef: React.MutableRefObject<HTMLElement | null>;
    setTableMenuCellNode: React.Dispatch<React.SetStateAction<TableCellNode | null>>;
}
export const useTableCell = ({ menuRootRef, setTableMenuCellNode }: IProps) => {
    const [editor] = useLexicalComposerContext();

    /** 获取选中的表格 */
    const $moveMenu = useCallback(() => {
        const menu = menuRootRef.current;
        const selection = $getSelection();
        const nativeSelection = window.getSelection();
        const { activeElement } = document;

        if (selection == null || menu == null) {
            setTableMenuCellNode(null);
            return;
        }

        const rootElement = editor.getRootElement();
        if (
            $isRangeSelection(selection) &&
            rootElement !== null &&
            nativeSelection !== null &&
            rootElement.contains(nativeSelection.anchorNode)
        ) {
            // 拿到选中的表格
            const tableCellNodeFromSelection = $getTableCellNodeFromLexicalNode(
                selection.anchor.getNode(),
            );

            if (tableCellNodeFromSelection == null) {
                setTableMenuCellNode(null);
                return;
            }

            // 拿到表格的DOM节点
            const tableCellParentNodeDOM = editor.getElementByKey(
                tableCellNodeFromSelection.getKey(),
            );

            if (tableCellParentNodeDOM == null) {
                setTableMenuCellNode(null);
                return;
            }

            // 保存表格选中的表格，供菜单定位使用
            setTableMenuCellNode(tableCellNodeFromSelection);
        } else if (!activeElement) {
            setTableMenuCellNode(null);
        }
    }, [editor]);

    useEffect(() => {
        return editor.registerUpdateListener(() => {
            editor.getEditorState().read(() => {
                $moveMenu();
            });
        });
    });
};
