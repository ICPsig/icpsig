import React, { ReactNode } from 'react';
interface IModalProps {
    isOpen: boolean;
    handleCancel: () => void;
    handleOk: () => void;
    title?: string;
    children: ReactNode;
}
declare const CustomModal: React.FC<IModalProps>;
export default CustomModal;
