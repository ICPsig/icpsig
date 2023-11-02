import React from 'react';
interface ITransactionSuccessScreen {
    amount: string;
    txnHash?: string;
    created_at: Date;
    sender: string;
    recipients: string[];
    onDone?: () => void;
    successMessage: string;
    waitMessage?: string;
}
declare const TransactionSuccessScreen: ({ amount, txnHash, created_at, sender, recipients, onDone, successMessage, waitMessage }: ITransactionSuccessScreen) => React.JSX.Element;
export default TransactionSuccessScreen;
