export declare enum UpdateDB {
    Edit_Multisig = "editMultisig",
    Update_Pending_Transaction = "updatePendingTransaction",
    Update_History_Transaction = "updateHistoryTransaction",
    Update_Multisig = "updateMultisig"
}
export default function updateDB(key: UpdateDB, data: any, address: string, network: string): Promise<any> | undefined;
