// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
// of the Apache-2.0 license. See the LICENSE file for details.

import { firebaseFunctionsHeader } from 'src/global/firebaseFunctionsHeader';
import { FIREBASE_FUNCTIONS_URL } from 'src/global/firebaseFunctionsUrl';

interface IUpdateMultisigSignatory {
	address: string;
	txBody: any;
	network: string;
}

export default async function updateMultisigTransactions({ address, txBody, network }: IUpdateMultisigSignatory) {
	try {
		const res = await fetch(`${FIREBASE_FUNCTIONS_URL}/updateTransactions`, {
			body: JSON.stringify(txBody),
			headers: firebaseFunctionsHeader(network, address),
			method: 'POST'
		});
		const data = await res.json();
		return { data };
	} catch (error) {
		return { error };
	}
}
