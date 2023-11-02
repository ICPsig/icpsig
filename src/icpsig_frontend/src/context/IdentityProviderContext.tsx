// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { AuthClient } from '@dfinity/auth-client';
import { AccountIdentifier } from '@dfinity/nns';
import React, { useContext, useEffect, useState } from 'react';

export const OLD_MAINNET_IDENTITY_SERVICE_URL = 'https://identity.ic0.app';

const getIdentityProvider = () => {
	// If we are in mainnet in the old domain, we use the old identity provider.
	if (location.host.endsWith('.ic0.app')) {
		return OLD_MAINNET_IDENTITY_SERVICE_URL;
	}

	return OLD_MAINNET_IDENTITY_SERVICE_URL;
};

export interface IdentityContextType {
	login: any;
	principle: any;
	account: any;
	setAccounts: any;
	setPrinciple: any;
	identity: any;
}

export const IdentityContext: React.Context<IdentityContextType> = React.createContext({} as IdentityContextType);

export interface IdentityContextProviderProps {
	children?: React.ReactElement;
}

export function IdentityContextProvider({ children }: IdentityContextProviderProps): React.ReactElement {
	const [principle, setPrinciple] = useState<string>('');
	const [account, setAccounts] = useState<string>('');
	const [authClient, setAuthClient] = useState<any>(null);
	const [identity, setIdentity] = useState<any>(null);

	const handleConnect = async () => {
		authClient.login({
			// 7 days in nanoseconds
			identityProvider: getIdentityProvider(),
			maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000),
			onSuccess: async () => {
				const identity = await authClient.getIdentity();
				setIdentity(identity);
			}
		});
	};

	useEffect(() => {
		if (authClient) {
			return;
		}
		AuthClient.create().then((res: any) => {
			setAuthClient(res);
			res.isAuthenticated().then((isAuthenticated: boolean) => {
				if (isAuthenticated) {
					setIdentity(res.getIdentity());
				}
			});
		});
	}, []);

	return (
		<IdentityContext.Provider
			value={{
				login: handleConnect,
				principle,
				account,
				identity,
				setAccounts,
				setPrinciple
			}}
		>
			{children}
		</IdentityContext.Provider>
	);
}

export function useGlobalIdentityContext() {
	return useContext(IdentityContext);
}
