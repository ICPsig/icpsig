import React from 'react';
interface ITransactionFailedScreen {
    txnHash?: string;
    created_at: Date;
    sender: string;
    onDone?: () => void;
    failedMessage: string;
    waitMessage?: string;
}
declare const TransactionFailedScreen: ({ txnHash, created_at, sender, onDone, failedMessage, waitMessage }: ITransactionFailedScreen) => React.JSX.Element;
export default TransactionFailedScreen;
