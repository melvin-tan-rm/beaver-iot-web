import { useEffect, useMemo } from 'react';
import { useControllableValue } from 'ahooks';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { hasEditable, hasReadOnly } from '../helper';
import type { IEditorProps } from '../types';

export const useEditable = (props: IEditorProps) => {
    const { mode } = props;
    const [editor] = useLexicalComposerContext();
    const [isEditable, setIsEditable] = useControllableValue<boolean>(props, {
        defaultValue: false,
        defaultValuePropName: 'defaultEditable',
        valuePropName: 'isEditable',
        trigger: 'onEditableChange',
    });

    useEffect(() => {
        editor.setEditable(!!isEditable);
    }, [editor, isEditable]);

    return useMemo(() => {
        // 默认可读可写
        if (!mode) return [isEditable, setIsEditable] as const;

        // 有写入权限时，富文本可编辑
        if (!hasEditable(mode)) return [false, () => void 0] as const;

        // 有只读权限时，富文本只读
        if (!hasReadOnly(mode)) return [true, () => void 0] as const;

        return [isEditable, setIsEditable] as const;
    }, [isEditable, mode, setIsEditable]);
};
