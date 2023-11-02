interface IUpdateMultisigSignatory {
    address: string;
    txBody: any;
    network: string;
}
export default function updateMultisigTransactions({ address, txBody, network }: IUpdateMultisigSignatory): Promise<{
    data: any;
    error?: undefined;
} | {
    error: any;
    data?: undefined;
}>;
export {};
