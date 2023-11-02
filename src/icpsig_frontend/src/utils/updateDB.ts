// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import updateMultisigTransactions from './updateHistoryTransaction';
import updateMultisig from './updateMultisig';
import updateMultisigSignatory from './updateMultisigSignatory';

// of the Apache-2.0 license. See the LICENSE file for details.
export enum UpdateDB {
	Edit_Multisig = 'editMultisig',
	Update_Pending_Transaction = 'updatePendingTransaction',
	Update_History_Transaction = 'updateHistoryTransaction',
	Update_Multisig = 'updateMultisig'
}

export default function updateDB(key: UpdateDB, data: any, address: string, network: string) {
	try {
		switch (key) {
			case UpdateDB.Edit_Multisig: {
				return updateMultisigSignatory({ address, network, txBody: data });
			}
			case UpdateDB.Update_History_Transaction: {
				return updateMultisigTransactions({ address, network, txBody: data });
			}
			case UpdateDB.Update_Pending_Transaction: {
				return updateMultisigTransactions({ address, network, txBody: data });
			}
			case UpdateDB.Update_Multisig: {
				return updateMultisig({ address, network, txBody: data });
			}
		}
	} catch (error) {
		console.log(error);
	}
}
