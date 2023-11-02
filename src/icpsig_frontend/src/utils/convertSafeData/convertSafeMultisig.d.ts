export interface IMultisigAddress {
    address: string;
    name: string;
    signatories: Array<{
        address: string;
        signature: string;
    }>;
    threshold: string;
    disabled: boolean;
}
export declare const convertSafeMultisig: (data: any) => IMultisigAddress;
