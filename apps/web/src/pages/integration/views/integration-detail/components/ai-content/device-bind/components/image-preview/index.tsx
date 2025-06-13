import React, { useState, useRef } from 'react';
import { Popover } from '@mui/material';
import { useDebounceFn } from 'ahooks';
import './style.less';

interface Props {
    /** Image URL */
    src: string;
}

const ImagePreview: React.FC<Props> = ({ src }) => {
    const triggerRef = useRef<HTMLDivElement>(null);
    const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);

    const { run: handleMouseEnter, cancel: cancelMouseEnter } = useDebounceFn(
        () => {
            setAnchorEl(triggerRef.current);
        },
        { wait: 300 },
    );

    return (
        <>
            <div
                ref={triggerRef}
                className="ms-com-image-preview"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={() => {
                    setAnchorEl(null);
                    cancelMouseEnter();
                }}
            >
                <img src={src} alt="preview" />
            </div>
            <Popover
                open={!!anchorEl}
                onClose={() => setAnchorEl(null)}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <div className="ms-com-image-preview-picture">
                    <img src={src} alt="preview" />
                </div>
            </Popover>
        </>
    );
};

export default ImagePreview;
