import { FC } from 'react';
interface IReceivedInfoProps {
    className?: string;
    amount: string;
    addedOwner?: string;
    amountType: string;
    amount_usd: number;
    date: string;
    from: string;
    to: string | string[];
    callHash: string;
    note?: string;
    loading?: boolean;
}
declare const ReceivedInfo: FC<IReceivedInfoProps>;
export default ReceivedInfo;
