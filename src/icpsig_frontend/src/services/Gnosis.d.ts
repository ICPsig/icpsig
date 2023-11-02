export declare class IdentityBackendService {
    createMultisig: (owners: [string], threshold: number) => Promise<{
        data: any;
        error: null;
    } | {
        data: null;
        error: any;
    }>;
    getAllMultisigByOwner: (ownerAddress: string) => Promise<{
        data: any;
        error: string | null;
    }>;
    getMultisigInfoByAddress: (multisigAddress: string) => Promise<{
        data: any;
        error: string | null;
    }>;
    approveTransaction: (id: string, mutisig: string, transaction: any) => Promise<{
        data: any;
        error: string | null;
    }>;
    createTransferTx: (from: string, to: string[], value: string[]) => Promise<{
        data: any;
        error: string | null;
    }>;
    createAddOwnerTx: (multisig: string, signatory: string, threshold: number) => Promise<{
        data: any;
        error: string | null;
    }>;
    createRemoveOwnerTx: (multisig: string, signatory: string, threshold: any) => Promise<{
        data: any;
        error: string | null;
    }>;
    getPendingTx: (multisigAddress: string) => Promise<{
        data: any;
        error: string | null;
    }>;
    getTransactionHistory: (multisigAddress: string) => Promise<{
        data: any;
        error: string | null;
    }>;
}
