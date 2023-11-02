import React from 'react';
interface IMultisigProps {
    className?: string;
    onCancel?: () => void;
    isModalPopup?: boolean;
    homepage?: boolean;
}
declare const CreateMultisig: React.FC<IMultisigProps>;
export default CreateMultisig;
