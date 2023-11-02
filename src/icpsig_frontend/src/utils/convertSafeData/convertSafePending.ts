// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

export interface IQueuedTransactions {
	amount_token: string;
	created_at: Date;
	data: string;
	executed: boolean;
	network: string;
	safeAddress: string;
	signatures: Array<{ address: string; signature: string }>;
	to: string;
	txHash: string;
	type: string;
	dataDecoded: any;
}
export const convertSafePendingData = (data: any) => {
	const convertedData: IQueuedTransactions = {
		amount_token: data?.value || '0',
		created_at: data.submissionDate,
		data: data.data,
		dataDecoded: data?.dataDecoded || null,
		executed: data.isExecuted,
		network: data.network,
		safeAddress: data.safe,
		signatures: data?.confirmations?.map((user: any) => ({ address: user?.owner || '', signature: user?.signature || '' })) || [],
		to: data.to,
		txHash: data.safeTxHash,
		type: data?.dataDecoded?.method || 'Sent'
	};
	return convertedData;
};
