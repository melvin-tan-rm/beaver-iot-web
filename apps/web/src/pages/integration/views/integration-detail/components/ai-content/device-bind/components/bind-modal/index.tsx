import React, { useState, useMemo } from 'react';
import { useRequest } from 'ahooks';
import { Button } from '@mui/material';
import { useI18n, useTime } from '@milesight/shared/src/hooks';
import { Modal, ArrowBackIcon, type ModalProps } from '@milesight/shared/src/components';
import { ImageAnnotation } from '@/components';
import { aiApi, awaitWrap, isRequestSuccess, getResponseData } from '@/services/http';
import './style.less';

const BindModal: React.FC<ModalProps> = ({ onCancel, ...props }) => {
    const { getIntlText } = useI18n();

    return (
        <Modal
            {...props}
            fullScreen
            size="full"
            className="ms-com-device-bind-modal"
            title={getIntlText('setting.integration.ai_bind_device')}
            onCancel={onCancel}
        >
            <div className="modal-header">
                <div className="modal-header-left">
                    <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={onCancel}>
                        {getIntlText('common.label.back')}
                    </Button>
                    <div className="modal-header-title">
                        {getIntlText('setting.integration.ai_bind_device')}
                    </div>
                </div>
                <div className="modal-header-right">
                    <Button variant="contained">{getIntlText('common.button.save')}</Button>
                </div>
            </div>
            <div className="modal-content">
                <div className="modal-infer-form">AI Inference Form</div>
                <div className="modal-infer-setting-root">
                    <div className="modal-infer-setting-header">Inference Mode Setting</div>
                </div>
            </div>
        </Modal>
    );
};

export default BindModal;
