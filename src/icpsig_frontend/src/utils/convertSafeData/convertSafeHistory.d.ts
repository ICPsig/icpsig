export interface IHistoryTransactions {
    amount_token: string;
    created_at: Date;
    data: any;
    decodedData: any;
    approvals: string[];
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
    executor: string;
    from: string;
}
export declare const convertSafeHistoryData: (data: any) => IHistoryTransactions;
