import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import Konva from 'konva';
import { Tag, Text, Label } from 'react-konva';
import { Html } from 'react-konva-utils';
import type { Vector2d } from 'konva/lib/types';
import { yellow, white, black } from '@milesight/shared/src/services/theme';

interface Props {
    /** Text content */
    content?: string;

    /** Visible or not */
    visible?: boolean;

    /** Text position */
    position?: Vector2d;

    /** Text scale */
    scale?: number;

    /** Text color */
    color?: string;

    /** Text padding */
    padding?: number;

    /** Text font size */
    fontSize?: number;

    /** Background */
    backgroundColor?: string;
}

/** Default scale */
const DEFAULT_SCALE = 1;

/** Default font size */
const DEFAULT_TEXT_SIZE = 16;

/** Default text padding */
const DEFAULT_TEXT_PADDING = 4;

const EditableText: React.FC<Props> = ({
    content,
    visible,
    position,
    scale = DEFAULT_SCALE,
    color = black,
    padding = DEFAULT_TEXT_PADDING,
    fontSize = DEFAULT_TEXT_SIZE,
    backgroundColor = yellow[600],
}) => {
    // ---------- Render Text content ----------
    const [text, setText] = useState(content);

    useEffect(() => {
        setText(content);
    }, [content]);

    // ---------- Text Editing state ----------
    const labelRef = useRef<Konva.Label>(null);
    const [isEditing, setIsEditing] = useState(false);

    const handleDoubleClick = useCallback(() => {
        setIsEditing(true);
    }, []);

    // ---------- Render input ----------
    const inputRef = useRef<HTMLInputElement>(null);
    const inputStyle = useMemo(() => {
        const labelNode = labelRef.current;
        const result: React.CSSProperties = { display: 'none' };

        if (!isEditing || !labelNode) return result;
        result.display = 'block';
        result.position = 'absolute';
        result.top = `${position?.y || 0}px`;
        result.left = `${position?.x || 0}px`;
        result.width = `100px`;
        result.height = `${labelNode.height() * scale}px`;
        result.margin = '0px';
        result.padding = `${padding * scale}px`;

        result.color = color;
        result.fontSize = `${fontSize}px`;
        result.border = `1px solid ${backgroundColor}`;
        result.background = white;
        result.outline = 'none';
        result.lineHeight = `${labelNode.height() - 2}px`;
        result.transformOrigin = 'left top';

        let transform = '';
        const rotation = labelRef.current?.rotation();
        if (rotation) transform += `rotateZ(${rotation}deg)`;
        result.transform = transform;

        return result;
    }, [backgroundColor, color, fontSize, padding, position?.x, position?.y, scale, isEditing]);
    const [inputText, setInputText] = useState(text);

    const handleInputKeyDown = (e: any) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            setText(inputText);
            setIsEditing(false);
        }
        if (e.key === 'Escape') {
            setInputText(text);
            setIsEditing(false);
        }
    };

    useEffect(() => {
        setInputText(text);
    }, [text]);

    useEffect(() => {
        if (!isEditing || !inputRef.current) return;

        inputRef.current.focus();
    }, [isEditing]);

    if (!content) return null;
    return (
        <>
            <Label
                ref={labelRef}
                x={position?.x}
                y={position?.y}
                visible={visible && !isEditing}
                onDblClick={handleDoubleClick}
                onDblTap={handleDoubleClick}
            >
                <Tag fill={backgroundColor} />
                <Text
                    y={2}
                    verticalAlign="middle"
                    fill={color}
                    text={text}
                    fontSize={fontSize / scale}
                    padding={padding / scale}
                />
            </Label>
            {isEditing && (
                <Html>
                    <input
                        ref={inputRef}
                        value={inputText}
                        style={inputStyle}
                        onBlur={() => {
                            setText(inputText);
                            setIsEditing(false);
                        }}
                        onKeyDown={handleInputKeyDown}
                        onChange={e => {
                            setInputText(e.target.value);
                        }}
                    />
                </Html>
            )}
        </>
    );
};

export default EditableText;
