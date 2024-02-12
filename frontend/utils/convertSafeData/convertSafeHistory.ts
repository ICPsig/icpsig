// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

export interface IHistoryTransactions {
	amount_token: string;
	created_at: Date;
	data: any;
	decodedData: any;
	approvals: string[];
	executed: boolean;
	network: string;
	safeAddress: string;
	signatures: Array<{ address: string; signature: string }>;
	to: string;
	txHash: string;
	type: string;
	executor: string;
	from: string;
}
export const convertSafeHistoryData = (data: any) => {
	const convertedData: IHistoryTransactions = {
		amount_token: data?.value || data?.transfers?.[0]?.value || '0',
		approvals: data?.confirmations?.map((user: any) => user?.owner || '') || [],
		created_at: data?.executionDate || new Date(),
		data: data.data,
		decodedData: data?.dataDecoded,
		executed: data.isExecuted,
		executor: data?.executor || data?.from,
		from: data?.from || '',
		network: data.network,
		safeAddress: data.safe,
		signatures:
			data?.confirmations?.map((user: any) => ({
				address: user?.owner || '',
				signature: user?.signature || ''
			})) || [],
		to: data.to,
		txHash: data.safeTxHash || data.txHash,
		type: data?.dataDecoded?.method || data.txType || 'Sent'
	};
	return convertedData;
};
