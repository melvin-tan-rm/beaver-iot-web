import { useMemoizedFn } from 'ahooks';
import { SerializedEditorState } from 'lexical';
import { $generateHtmlFromNodes } from '@lexical/html';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import type { EditorHandlers, IEditorProps } from '../types';

type IProps = Pick<IEditorProps, 'onEditableChange'>;
export const useTransmit = ({ onEditableChange }: IProps) => {
    const [editor] = useLexicalComposerContext();

    /** 获取富文本实例 */
    const getEditor = () => {
        return new Proxy(editor, {
            get: (target, prop) => {
                if (prop === 'setEditable') return onEditableChange;
                return Reflect.get(target, prop);
            },
        });
    };
    /** 获取富文本的html结构 */
    const getEditorHtml = () => {
        return new Promise<string>(resolve => {
            editor.getEditorState().read(() => {
                const htmlString = $generateHtmlFromNodes(editor, null);
                resolve(htmlString);
            });
        });
    };
    /** 设置富文本内容 */
    const setEditorContent = (content: string | SerializedEditorState) => {
        editor.setEditorState(editor.parseEditorState(content));
    };

    return useMemoizedFn(
        (): EditorHandlers => ({
            getEditor,
            getEditorHtml,
            setEditorContent,
        }),
    );
};
