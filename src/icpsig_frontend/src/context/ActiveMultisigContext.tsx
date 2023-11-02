// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
/* eslint-disable sort-keys */
/* eslint-disable no-tabs */

import React, { createContext, useContext, useState } from 'react';
import { ISharedAddressBooks } from '../types';

export interface IActiveMultisigContext extends ISharedAddressBooks {
	setActiveMultisigContextState: React.Dispatch<React.SetStateAction<IActiveMultisigContext>>;
}

export const initialActiveMultisigContext: IActiveMultisigContext = {
	records: {},
	multisig: '',
	roles: [],
	setActiveMultisigContextState: (): void => {
		throw new Error('setActiveMultisigContextState function must be overridden');
	}
};

export const ActiveMultisigContext = createContext(initialActiveMultisigContext);

export function useActiveMultisigContext() {
	return useContext(ActiveMultisigContext);
}

export const ActiveMultisigProvider = ({ children }: React.PropsWithChildren<{}>) => {
	const [activeMultisigContextState, setActiveMultisigContextState] = useState<IActiveMultisigContext>(initialActiveMultisigContext);

	return <ActiveMultisigContext.Provider value={{ ...activeMultisigContextState, setActiveMultisigContextState }}>{children}</ActiveMultisigContext.Provider>;
};
