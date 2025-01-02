import { Fragment } from 'react';
import { Button, Stack } from '@mui/material';
import cls from 'classnames';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useI18n, useSignalState } from '../../../../hooks';
import { hasEditable, hasReadOnly } from '../../helper';
import { MODE } from '../../constant';
import { useGroup } from './hooks';
import type { EditorState, IEditorProps } from '../../types';
import './style.less';

type IProps = Pick<
    IEditorProps,
    | 'isEditable'
    | 'onEditableChange'
    | 'onSave'
    | 'onCancel'
    | 'mode'
    | 'editorConfig'
    | 'renderOperator'
>;
const Divider = () => <div className="ms-toolbar__divider" />;
export default function ToolbarPlugin({
    mode = MODE.ALL,
    isEditable,
    editorConfig,
    onEditableChange,
    onSave,
    onCancel,
    renderOperator,
}: IProps) {
    const { getIntlText } = useI18n();
    const [editor] = useLexicalComposerContext();
    const [getEditableState, updateEditableState] = useSignalState<EditorState | null>(null);

    /** 点击保存/编辑时 */
    const handleClick = () => {
        const prevIsEditable = isEditable;

        if (!prevIsEditable) {
            // 保存当前快照
            const editorState = editor.getEditorState();
            updateEditableState(editorState);
        } else {
            updateEditableState(null);
        }

        // 更改当前只读/编辑
        onEditableChange?.(!prevIsEditable);
        if (prevIsEditable) {
            // 保存
            const data = editor.getEditorState().toJSON();
            onSave && onSave(data);
        }
    };
    /** 取消 */
    const handleCancel = async () => {
        await (onCancel && onCancel());

        // 还原默认内容
        const editableState = getEditableState();
        editableState && editor.setEditorState(editableState);

        // 更改当前只读/编辑
        onEditableChange?.(!isEditable);
    };
    const ToolbarGroup = useGroup({ editorConfig });

    const saveBtnNode = (
        <Stack
            direction="row"
            spacing="4px"
            sx={{ height: '100%', alignItems: 'center', justifyContent: 'end' }}
        >
            <Button variant="outlined" onClick={handleCancel}>
                {getIntlText('common.button.cancel')}
            </Button>
            <Button variant="contained" onClick={handleClick}>
                {getIntlText('common.button.save')}
            </Button>
        </Stack>
    );
    const editBtnNode = (
        <Button variant="outlined" onClick={handleClick} className="ms-toolbar__btn">
            {getIntlText('common.button.edit')}
        </Button>
    );

    return (
        <div className="ms-editor-toolbar">
            <div
                className={cls('ms-toolbar__container', {
                    'ms-toolbar__container--editable': isEditable,
                    'ms-toolbar__container--readonly': !isEditable,
                })}
            >
                {isEditable ? (
                    <>
                        <div className="ms-toolbar__functions">
                            {ToolbarGroup?.map((toolbarItem, index) => {
                                const { type, Component } = toolbarItem! || {};
                                const props = (toolbarItem as any)?.props || {};

                                return (
                                    <Fragment key={toolbarItem?.type}>
                                        <Component key={type} disabled={!isEditable} {...props} />
                                        {index !== ToolbarGroup.length - 1 && <Divider />}
                                    </Fragment>
                                );
                            })}
                        </div>
                        {hasReadOnly(mode) && (
                            <div className="ms-toolbar__operator">
                                {renderOperator ? renderOperator(saveBtnNode) : saveBtnNode}
                            </div>
                        )}
                    </>
                ) : (
                    hasEditable(mode) && (
                        <div className="ms-toolbar__operator">
                            {renderOperator ? renderOperator(editBtnNode) : editBtnNode}
                        </div>
                    )
                )}
            </div>
        </div>
    );
}
