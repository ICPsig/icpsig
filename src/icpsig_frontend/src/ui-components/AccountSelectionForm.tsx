// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { FC } from 'react';

import AddressDropdown from './AddressDropdown';

interface IAccountSelectionFormProps {
	accounts: Array<any>;
	address: string;
	onAccountChange: (address: string) => void;
	title: string;
	disabled?: boolean;
}

const AccountSelectionForm: FC<IAccountSelectionFormProps> = ({ accounts, address, onAccountChange, title, disabled }) => {
	return (
		<article className='flex flex-col gap-y-2 w-[320px]'>
			<h3 className='text-primary font-normal text-xs'>{title}</h3>
			<AddressDropdown
				disabled={disabled}
				accounts={accounts}
				defaultAddress={address}
				onAccountChange={onAccountChange}
			/>
		</article>
	);
};

export default AccountSelectionForm;
