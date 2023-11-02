// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { Button } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import ConnectWalletImg from 'src/assets/connect-wallet.svg';
import { useGlobalIdentityContext } from 'src/context/IdentityProviderContext';
import { useGlobalUserDetailsContext } from 'src/context/UserDetailsContext';
import { FIREBASE_FUNCTIONS_URL } from 'src/global/firebaseFunctionsUrl';
import { WalletIcon } from 'src/ui-components/CustomIcons';

const ConnectWallet = () => {
	const { identity, login, setAccounts, account, setPrinciple } = useGlobalIdentityContext();
	const [loading, setLoading] = useState<boolean>(false);
	const { connectAddress } = useGlobalUserDetailsContext();

	const handlePolkasafeLogin = async () => {
		const res = await fetch(`${FIREBASE_FUNCTIONS_URL}/login`, {
			body: JSON.stringify({ account }),
			headers: {
				'Content-Type': 'application/json'
			},
			method: 'POST'
		});
		const { token } = await res.json();
	};

	const handleLogin = useCallback(async () => {
		try {
			setLoading(true);
			if (!identity) {
				login();
				setLoading(false);
				return;
			}
			handlePlugLogin();
		} catch (err) {
			console.log(err);
		}
		setLoading(false);
	}, []);

	const handlePlugLogin = async () => {
		//@ts-ignore
		const icWidnowObject = window.ic.plug;
		if (icWidnowObject?.sessionManager?.sessionData) {
			return;
		}
		const whitelist = identity.whitelist;
		const host = 'https://mainnet.dfinity.network';
		//@ts-ignore
		const onConnectionUpdate = async () => {};

		try {
			await icWidnowObject.requestConnect({
				whitelist,
				host,
				onConnectionUpdate,
				timeout: 100000
			});
			const principal = icWidnowObject.sessionManager.sessionData.principalId;
			const account = icWidnowObject.sessionManager.sessionData.accountId;

			setPrinciple(principal);
			setAccounts(account);
			localStorage.setItem('address', account);
			connectAddress();
		} catch (e) {
			console.log(e);
		}
	};

	return (
		<div className='rounded-xl flex flex-col items-center justify-center min-h-[400px] bg-bg-main'>
			<img
				src={ConnectWalletImg}
				alt='Wallet'
				height={120}
				width={120}
				className='mb-4 mt-1'
			/>
			<>
				<h2 className='font-bold text-lg text-white'>Get Started</h2>
				<p className='mt-[10px]  text-normal text-sm text-white'>Connect your wallet</p>
				<p className='text-text_secondary text-sm font-normal mt-[20px] mb-2'>Your first step towards creating a safe & secure MultiSig</p>
				{identity ? (
					<div className='mt-[20px]'>
						<Button
							icon={<WalletIcon />}
							loading={loading}
							onClick={handlePlugLogin}
							className={`mt-[25px] text-sm border-none outline-none flex items-center justify-center bg-primary text-white
              max-w-[320px] w-full`}
						>
							Sign In
						</Button>
					</div>
				) : (
					<Button
						icon={<WalletIcon />}
						onClick={handleLogin}
						loading={loading}
						className={'mt-[25px] text-sm border-none outline-none flex items-center justify-center bg-primary text-white'}
					>
						Connect
					</Button>
				)}
			</>
		</div>
	);
};

export default ConnectWallet;
