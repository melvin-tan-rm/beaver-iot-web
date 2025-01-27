import { useEffect } from 'react';
import { useClickAway, useMemoizedFn } from 'ahooks';
import { getDOMCellFromTarget } from '@lexical/table';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

interface IProps {
    anchorElem: HTMLElement;
    menuRootRef: React.MutableRefObject<HTMLElement | null>;
    setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
export const useMenuRoot = ({ anchorElem, menuRootRef, setIsMenuOpen }: IProps) => {
    const [editor] = useLexicalComposerContext();

    /** 设置点击的位置 */
    const setupMenuRootStyle = useMemoizedFn(({ x, y }: { x: number; y: number }) => {
        const menuRoot = menuRootRef.current;
        if (!menuRoot) return;

        const { y: editorElemY, left: editorElemLeft } = anchorElem.getBoundingClientRect();

        menuRoot.style.width = `${1}px`;
        menuRoot.style.height = `${1}px`;
        menuRoot.style.transform = `translate(${x - editorElemLeft}px, ${y - editorElemY - 4}px)`;
        menuRoot.style.opacity = '1';
    });
    /** 右键 */
    const handleContextMenu = useMemoizedFn(e => {
        setIsMenuOpen(false);
        const { target } = e;
        // 判断点击的是否是表格
        const cell = getDOMCellFromTarget(target as HTMLElement);
        if (!cell) return;

        const menuRoot = menuRootRef.current;
        if (!menuRoot) return;

        e.preventDefault();
        e.stopPropagation();

        // 设置点击位置
        setupMenuRootStyle(e);

        setTimeout(() => {
            // 打开菜单
            setIsMenuOpen(true);
        }, 0);
    });
    useEffect(() => {
        const root = editor.getRootElement();
        if (!root) return;

        root.addEventListener('contextmenu', handleContextMenu);
        return () => {
            root.removeEventListener('contextmenu', handleContextMenu);
        };
    }, [editor]);

    // 目标元素外点击，关闭 dropdown
    useClickAway(() => {
        setIsMenuOpen(false);
    }, [menuRootRef]);
};
