import React from 'react';
interface IMultisigProps {
    className?: string;
    onCancel?: () => void;
    homepage?: boolean;
    signatories?: string[];
    threshold?: number;
    setProxyInProcess?: React.Dispatch<React.SetStateAction<boolean>>;
}
declare const AddProxy: React.FC<IMultisigProps>;
export default AddProxy;
