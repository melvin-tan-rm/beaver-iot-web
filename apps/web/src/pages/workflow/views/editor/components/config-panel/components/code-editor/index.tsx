import React, { useCallback, useMemo } from 'react';
import { CodeEditor as CodeMirror, type EditorProps, type EditorSupportLang } from '@/components';
import { CODE_EXPRESSION_DEFAULT_VALUE } from '../../constants';
import './style.less';

export interface CodeEditorData {
    language: EditorSupportLang;
    expression: string;
}
export interface IProps extends Omit<EditorProps, 'value' | 'onChange'> {
    /** Whether to automatically fill in the default value when language change. */
    autoFillDefaultValue?: boolean;
    defaultValues?: Partial<Record<EditorSupportLang, string>>;
    value: CodeEditorData;
    onChange: (value: CodeEditorData) => void;
}
export const DEFAULT_LANGUAGE = 'js';
/**
 * Code Editor Component
 *
 * Note: Use in CodeNode, IfelseNode
 */
const CodeEditor: React.FC<IProps> = ({
    autoFillDefaultValue,
    defaultValues = CODE_EXPRESSION_DEFAULT_VALUE,
    value,
    onChange,
    ...props
}) => {
    const { language = DEFAULT_LANGUAGE, expression } = value || {};

    /** Actual form change callbacks */
    const handleChange = useCallback(
        (data: CodeEditorData) => {
            const { language, expression } = data;

            onChange?.({
                language,
                expression,
            });
        },
        [onChange],
    );

    /** Callback function triggered when the language changes. */
    const handleEditorLangChange = useCallback(
        (language: EditorSupportLang) => {
            let expression = '';

            if (autoFillDefaultValue && defaultValues[language]) {
                expression = defaultValues[language] || '';
            }

            handleChange?.({
                language,
                expression,
            });
        },
        [autoFillDefaultValue, defaultValues, handleChange],
    );
    /** Callback function triggered when the content value changes. */
    const handleEditorValueChange = useCallback(
        (expression: string) => {
            handleChange?.({ language, expression });
        },
        [handleChange, language],
    );
    const supportLangs = useMemo<EditorSupportLang[]>(() => ['groovy', 'js', 'python', 'mvel'], []);
    return (
        <CodeMirror
            {...props}
            height="200px"
            editorLang={language}
            onLangChange={handleEditorLangChange}
            value={expression}
            onChange={handleEditorValueChange}
            supportLangs={supportLangs}
        />
    );
};

export default CodeEditor;
