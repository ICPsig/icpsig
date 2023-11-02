import React, { FC } from 'react';
import { IQueueItem, ITxNotification } from 'src/types';
interface ITransactionProps {
    status: 'Approval' | 'Cancelled' | 'Executed';
    date: Date;
    approvals: string[];
    threshold: number;
    callData: string;
    callHash: string;
    note: string;
    refetch?: () => void;
    setQueuedTransactions?: React.Dispatch<React.SetStateAction<IQueueItem[]>>;
    numberOfTransactions: number;
    notifications?: ITxNotification;
    value: string;
    onAfterApprove?: any;
    onAfterExecute?: any;
    txType?: any;
    recipientAddress?: string;
}
declare const Transaction: FC<ITransactionProps>;
export default Transaction;
