// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import Web3 from 'web3';

export default function isValidWeb3Address(address: string): boolean {
	try {
		return Boolean(Web3.utils.isAddress?.(address));
	} catch (error) {
		return false;
	}
}
