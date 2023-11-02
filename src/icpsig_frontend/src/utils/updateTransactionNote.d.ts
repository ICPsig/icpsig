interface Args {
    callHash: string;
    multisigAddress?: string;
    note: string;
    network: string;
}
export default function updateTransactionNote({ callHash, multisigAddress, note, network }: Args): Promise<{
    data?: any;
    error?: string;
}>;
export {};
