import React from 'react';
interface IAddProxySuccessScreen {
    txnHash?: string;
    createdBy: string;
    threshold: number;
    signatories: string[];
    onDone?: () => void;
    successMessage?: string;
    waitMessage?: string;
}
declare const AddProxySuccessScreen: ({ txnHash, createdBy, threshold, signatories, onDone, successMessage, waitMessage }: IAddProxySuccessScreen) => React.JSX.Element;
export default AddProxySuccessScreen;
