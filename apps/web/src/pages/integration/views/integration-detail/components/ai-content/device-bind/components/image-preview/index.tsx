import React, { memo } from 'react';
import HoverPopover from 'material-ui-popup-state/HoverPopover';
import { usePopupState, bindHover, bindPopover } from 'material-ui-popup-state/hooks';
import './style.less';

interface Props {
    /** Popover ID */
    key: ApiKey;
    /** Image URL */
    src: string;
}

/**
 *  Image preview component
 */
const ImagePreview: React.FC<Props> = memo(({ key, src }) => {
    const popupState = usePopupState({ variant: 'popover', popupId: `${key}` });

    return (
        <>
            <div className="ms-com-image-preview" {...bindHover(popupState)}>
                <img src={src} alt="preview" />
            </div>
            <HoverPopover
                {...bindPopover(popupState)}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <div className="ms-com-image-preview-picture">
                    <img src={src} alt="preview" />
                </div>
            </HoverPopover>
        </>
    );
});

export default ImagePreview;
