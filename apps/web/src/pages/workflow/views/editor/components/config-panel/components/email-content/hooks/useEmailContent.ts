import { useState, useRef, useEffect } from 'react';
import { useMemoizedFn } from 'ahooks';

import { type EditorHandlers } from '@milesight/shared/src/components';

export function useEmailContent(content: string) {
    const [modalVisible, setModalVisible] = useState(false);
    const [smallEditorContent, setSmallEditorContent] = useState<string>('');

    const showModal = useMemoizedFn(async () => {
        const richTextContent = await editorRef.current?.getEditorHtml();

        console.log('richTextContent ? ', richTextContent);
        setSmallEditorContent(richTextContent || '');

        setTimeout(() => {
            setModalVisible(true);
        }, 100);
    });

    const hiddenModal = useMemoizedFn(() => setModalVisible(false));

    const editorRef = useRef<EditorHandlers>(null);

    useEffect(() => {
        const newContent = content || '';

        editorRef.current?.setEditorHtmlContent(newContent);
        setSmallEditorContent(newContent);
    }, [content]);

    return {
        modalVisible,
        showModal,
        hiddenModal,
        editorRef,
        smallEditorContent,
    };
}
