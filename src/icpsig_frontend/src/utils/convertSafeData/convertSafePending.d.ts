export interface IQueuedTransactions {
    amount_token: string;
    created_at: Date;
    data: string;
    executed: boolean;
    network: string;
    safeAddress: string;
    signatures: Array<{
        address: string;
        signature: string;
    }>;
    to: string;
    txHash: string;
    type: string;
    dataDecoded: any;
}
export declare const convertSafePendingData: (data: any) => IQueuedTransactions;
