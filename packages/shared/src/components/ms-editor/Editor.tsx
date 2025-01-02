import React, { forwardRef, useImperativeHandle, useState } from 'react';
import cls from 'classnames';

import { TablePlugin } from '@lexical/react/LexicalTablePlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';

import { Toolbar } from './components';
import { TableHoverActionsPlugin, TableActionMenuPlugin, TableCellResizerPlugin } from './plugins';
import { useTransmit, useEditable, useEditConfigure } from './hooks';
import type { EditorHandlers, IEditorProps } from './types';

import './style.less';

export const LexicalEditor = forwardRef<EditorHandlers, IEditorProps>((props, ref) => {
    const { mode, placeholder, editorConfig, onSave, onCancel, renderOperator } = props;
    const { toolbar = true, plugin } = editorConfig || {};
    const { table: tablePlugin } = plugin || {};
    const [isEditable, onEditableChange] = useEditable(props);

    const [floatingAnchorElem, setFloatingAnchorElem] = useState<HTMLDivElement | null>(null);
    const onRef = (_floatingAnchorElem: HTMLDivElement) => {
        if (_floatingAnchorElem !== null) {
            setFloatingAnchorElem(_floatingAnchorElem);
        }
    };

    const handler = useTransmit({ onEditableChange });
    /** 暴露给父组件的方法 */
    useImperativeHandle(ref, handler);

    return (
        <div
            className={cls('ms-editor-container', {
                'ms-editor-container--readonly': !isEditable,
            })}
        >
            {!!toolbar && (
                <Toolbar
                    mode={mode}
                    isEditable={isEditable}
                    onEditableChange={onEditableChange}
                    onSave={onSave}
                    onCancel={onCancel}
                    editorConfig={editorConfig}
                    renderOperator={renderOperator}
                />
            )}
            <div className="ms-editor-inner">
                <RichTextPlugin
                    contentEditable={
                        <div className="ms-editor-content" ref={onRef}>
                            <ContentEditable className="ms-editor-input" />
                        </div>
                    }
                    placeholder={<div className="ms-editor-placeholder">{placeholder}</div>}
                    ErrorBoundary={LexicalErrorBoundary}
                />
                <HistoryPlugin />
                <AutoFocusPlugin />
                <TablePlugin />

                {floatingAnchorElem && (
                    <>
                        <TableHoverActionsPlugin
                            anchorElem={floatingAnchorElem!}
                            plugins={tablePlugin}
                        />
                        <TableCellResizerPlugin
                            anchorElem={floatingAnchorElem!}
                            plugins={tablePlugin}
                        />
                    </>
                )}
                <TableActionMenuPlugin plugins={tablePlugin} />
            </div>
        </div>
    );
});

export default React.memo(
    forwardRef<EditorHandlers, IEditorProps>((props, ref) => {
        const editorConfigure = useEditConfigure();

        return (
            <LexicalComposer initialConfig={editorConfigure}>
                <LexicalEditor {...props} ref={ref} />
            </LexicalComposer>
        );
    }),
);
