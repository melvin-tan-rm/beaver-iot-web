import React, { useEffect, useState } from 'react';
import { useI18n } from '@milesight/shared/src/hooks';
import { Modal, ExitToAppIcon } from '@milesight/shared/src/components';
import { curl2Json } from '@milesight/shared/src/utils/curl-parser';
import { CodeEditor } from '@/components';

import './style.less';

export interface HttpCurlDialogProps {
    onChange?: (data: Record<string, any>) => void;
}

const HttpCurlDialog: React.FC<HttpCurlDialogProps> = ({ onChange }) => {
    const { getIntlText } = useI18n();
    const [visible, setVisible] = useState(false);
    const [content, setContent] = useState('');
    const handleConfirm = () => {
        const result = curl2Json(content);
        setVisible(false);
        onChange?.(result);
    };

    // reset content when visible changes
    useEffect(() => {
        if (visible) return;
        setContent('');
    }, [visible]);

    return (
        <div className="ms-http-curl-import">
            <div className="ms-http-curl-import-trigger" onClick={() => setVisible(true)}>
                <ExitToAppIcon />
                {getIntlText('workflow.label.import_from_curl')}
            </div>
            <Modal
                size="lg"
                className="ms-http-curl-import-modal"
                visible={visible}
                title={getIntlText('workflow.label.import_from_curl')}
                onCancel={() => setVisible(false)}
                onOk={handleConfirm}
            >
                <CodeEditor
                    editorLang="text"
                    placeholder={getIntlText('workflow.label.placeholder_please_enter_curl')}
                    renderHeader={() => null}
                    value={content}
                    onChange={setContent}
                />
            </Modal>
        </div>
    );
};

export default HttpCurlDialog;
