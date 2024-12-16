import React from 'react';

import { useI18n } from '@milesight/shared/src/hooks';
import { Modal, type ModalProps } from '@milesight/shared/src/components';
import { TableTransfer } from '@/components';

/**
 * add member modal
 */
const AddMemberModal: React.FC<ModalProps> = props => {
    const { visible, ...restProps } = props;

    const { getIntlText } = useI18n();

    const renderModal = () => {
        if (visible) {
            return (
                <Modal
                    width="1200px"
                    visible={visible}
                    title={getIntlText('user.role.add_user_member_modal_title')}
                    sx={{
                        '& .MuiDialogContent-root': {
                            display: 'flex',
                        },
                    }}
                    {...restProps}
                >
                    <TableTransfer />
                </Modal>
            );
        }

        return null;
    };

    return renderModal();
};

export default AddMemberModal;
