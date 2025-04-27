import React, { useState } from 'react';
import { IconButton } from '@mui/material';
import { useCopy } from '@milesight/shared/src/hooks';
import {
    ContentCopyIcon,
    VisibilityIcon,
    VisibilityOffIcon,
} from '@milesight/shared/src/components';
import { Tooltip } from '@/components';
import './style.less';

type OptionItem = {
    label: string;
    value: string;
    type?: 'text' | 'password';
    copyable?: boolean;
};

export interface Props {
    title?: string;

    options?: OptionItem[];
}

const ParamsList: React.FC<Props> = ({ title, options }) => {
    const { handleCopy } = useCopy();
    const [visible, setVisible] = useState<Record<string, boolean>>({});

    return (
        <div className="ms-node-form-group">
            <div className="ms-node-form-group-header">
                {title && <div className="ms-node-form-group-title">{title}</div>}
            </div>
            <div className="ms-node-form-group-item">
                <div className="ms-params-list">
                    {options?.map(option => (
                        <div className="ms-params-list-item" key={option.label}>
                            <div className="ms-params-list-item-label">{option.label}</div>
                            <div className="ms-params-list-item-value">
                                <div className="content">
                                    <Tooltip
                                        autoEllipsis
                                        title={
                                            visible[option.label] || option.type !== 'password'
                                                ? option.value
                                                : option.value.replace(/./g, '*')
                                        }
                                    />
                                </div>
                                <div className="actions">
                                    {option.type === 'password' && (
                                        <IconButton
                                            onClick={() => {
                                                setVisible(prev => ({
                                                    ...prev,
                                                    [option.label]: !prev[option.label],
                                                }));
                                            }}
                                        >
                                            {!visible[option.label] ? (
                                                <VisibilityIcon />
                                            ) : (
                                                <VisibilityOffIcon />
                                            )}
                                        </IconButton>
                                    )}
                                    {option.copyable !== false && (
                                        <IconButton
                                            onClick={e => {
                                                handleCopy(
                                                    option.value,
                                                    (e.target as HTMLElement)?.parentElement,
                                                );
                                            }}
                                        >
                                            <ContentCopyIcon />
                                        </IconButton>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ParamsList;
