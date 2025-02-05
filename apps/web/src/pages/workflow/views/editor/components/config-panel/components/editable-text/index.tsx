import React, { useState } from 'react';
import { useControllableValue } from 'ahooks';
import { Tooltip } from '@/components';
import './style.less';

interface Props {
    value?: string;
    defaultValue?: string;
    onChange?: (value: Props['value']) => void;
}

const EditableText: React.FC<Props> = props => {
    const [value, setValue] = useControllableValue(props);
    const [editing, setEditing] = useState(false);

    return (
        <div className="ms-editable-text">
            {!editing ? (
                <div className="ms-editable-text-view" onClick={() => setEditing(true)}>
                    <Tooltip autoEllipsis title={value || ''} />
                </div>
            ) : (
                <input
                    // eslint-disable-next-line jsx-a11y/no-autofocus
                    autoFocus
                    type="text"
                    className="ms-editable-text-input"
                    value={value}
                    onBlur={() => setEditing(false)}
                    onChange={e => setValue(e.target.value)}
                />
            )}
        </div>
    );
};

export default EditableText;
