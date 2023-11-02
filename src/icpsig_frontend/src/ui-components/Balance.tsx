// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useEffect, useState } from 'react';

import Loader from './Loader';

interface Props {
	className?: string;
	address: string;
	onChange?: (balance: string) => void;
}

const Balance = ({ address, className }: Props) => {
	const [balance, setBalance] = useState<string>('0');
	const [loading, setLoading] = useState<boolean>(false);

	const fetchEthBalance = async (address: string) => {
		try {
			setLoading(true);
			//@ts-ignore
			const allTokens = await window.ic.plug.requestBalance();
			const balance = allTokens.find((token: any) => token.symbol === 'ICP').amount;
			console.log(balance);
			if (balance) setBalance(balance);
		} catch (err) {
			console.log('Err from fetchEthBalance', err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (address) fetchEthBalance(address);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [address]);

	return (
		<div className={`bg-highlight rounded-lg px-[10px] py-[6px] ml-auto font-normal text-xs leading-[13px] flex items-center justify-center ${className}`}>
			<span className='text-primary mr-2'>Balance: </span>
			{loading ? <Loader /> : <span className='text-white'>{parseFloat(balance).toFixed(3)}</span>}
		</div>
	);
};

export default Balance;
