interface IUpdateMultisig {
    address: string;
    txBody: any;
    network: string;
}
export default function updateMultisig({ address, txBody, network }: IUpdateMultisig): Promise<any>;
export {};
