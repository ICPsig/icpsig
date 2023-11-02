import { ITransaction } from 'src/types';
type Args = Omit<ITransaction, 'created_at' | 'amount_usd' | 'amount_token' | 'id' | 'token' | 'block_number' | 'from'> & {
    amount?: string;
    safeAddress?: string;
    executed?: boolean;
    type?: 'sent' | 'received';
    transactionFields?: {
        category: string;
        subfields: {
            [subfield: string]: {
                name: string;
                value: string;
            };
        };
    };
};
export declare function addNewTransaction({ amount, executed, transactionFields, type, network, callData, callHash, to, note, safeAddress }: Args): Promise<{
    data?: ITransaction;
    error: string;
} | any>;
export {};
