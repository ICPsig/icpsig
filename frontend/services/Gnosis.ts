// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

// import { icpsig_backend } from "../../declarations/icpsig_backend";

const icpsig_backend: any = {};

// create_vault
// transfer
// add_signatory
// remove_signatory
// approve_transaction
// reject_transaction

export class IdentityBackendService {
	createMultisig = async (owners: [string], threshold: number) => {
		try {
			const icpsigAccountConfig = {
				owners,
				threshold
			};
			const multisigAddress = await icpsig_backend.create_vault(icpsigAccountConfig);
			return { data: multisigAddress, error: null };
		} catch (error) {
			console.log('error from createMultisig', error);
			return { data: null, error };
		}
	};

	getAllMultisigByOwner = async (ownerAddress: string): Promise<{ data: any; error: string | null }> => {
		try {
			const data = await icpsig_backend.multisig_by_owner(ownerAddress);
			return { data, error: null };
		} catch (error) {
			console.log('error from getAllMultisigByOwner', error);
			return { data: null, error };
		}
	};

	getMultisigInfoByAddress = async (multisigAddress: string): Promise<{ data: any; error: string | null }> => {
		try {
			const data = await icpsig_backend.multisig_info(multisigAddress);
			return { data, error: null };
		} catch (error) {
			console.log('error from getMultisigInfoByAddress', error);
			return { data: null, error };
		}
	};

	approveTransaction = async (id: string, mutisig: string, transaction: any): Promise<{ data: any; error: string | null }> => {
		try {
			const data = await icpsig_backend.approve_transaction(id, mutisig, transaction);
			return { data, error: null };
		} catch (error) {
			console.log('error from confirmTxByHash', error);
			return { data: null, error };
		}
	};

	createTransferTx = async (from: string, to: string[], value: string[]): Promise<{ data: any; error: string | null }> => {
		try {
			const data = await icpsig_backend.transfer(from, to, value);
			return { data, error: null };
		} catch (error) {
			console.log(error);
			// console.log('error from createMultisigTx', error);
			return { data: null, error };
		}
	};

	createAddOwnerTx = async (multisig: string, signatory: string, threshold: number): Promise<{ data: any; error: string | null }> => {
		try {
			const data = await icpsig_backend.add_signatory(multisig, signatory, threshold);
			return { data, error: null };
		} catch (error) {
			console.log(error);
			return { data: null, error };
		}
	};

	createRemoveOwnerTx = async (multisig: string, signatory: string, threshold: any): Promise<{ data: any; error: string | null }> => {
		try {
			const data = await icpsig_backend.remove_signatory(multisig, signatory, threshold);
			return { data, error: null };
		} catch (error) {
			console.log(error);
			return { data: null, error };
		}
	};

	getPendingTx = async (multisigAddress: string): Promise<{ data: any; error: string | null }> => {
		try {
			const data = await icpsig_backend.pending_transaction(multisigAddress);
			return { data, error: null };
		} catch (error) {
			console.log(error);
			return { data: null, error };
		}
	};

	getTransactionHistory = async (multisigAddress: string): Promise<{ data: any; error: string | null }> => {
		try {
			const data = await icpsig_backend.transaction_history(multisigAddress);
			return { data, error: null };
		} catch (error) {
			console.log(error);
			return { data: null, error };
		}
	};
}
