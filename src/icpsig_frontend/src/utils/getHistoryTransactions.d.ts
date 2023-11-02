import { ITransaction } from '../types';
interface IResponse {
    error?: string | null;
    data: ITransaction[];
    count: number;
}
export default function getHistoryTransactions(multisigAddress: string, network: string, entries: number, page: number): Promise<IResponse>;
export {};
