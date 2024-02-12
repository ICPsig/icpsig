// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
export interface IMultisigAddress {
	address: string;
	name: string;
	signatories: Array<{ address: string; signature: string }>;
	threshold: string;
	disabled: boolean;
}

export const convertSafeMultisig = (data: any) => {
	const convertedData: IMultisigAddress = {
		address: data.address,
		disabled: false,
		name: data.name,
		signatories: data?.owners || [],
		threshold: data.threshold
	};
	return convertedData;
};
