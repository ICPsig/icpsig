// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useState } from 'react';
import DragDrop from 'src/components/AddressBook/DragDrop';
import CancelBtn from 'src/components/Settings/CancelBtn';
import AddBtn from 'src/components/Settings/ModalBtn';
import { useModalContext } from 'src/context/ModalContext';
import { useGlobalUserDetailsContext } from 'src/context/UserDetailsContext';
import { firebaseFunctionsHeader } from 'src/global/firebaseFunctionsHeader';
import { FIREBASE_FUNCTIONS_URL } from 'src/global/firebaseFunctionsUrl';
import { IAddressBookItem } from 'src/types';
import { NotificationStatus } from 'src/types';
import queueNotification from 'src/ui-components/QueueNotification';

const ImportAdress = () => {
	const { toggleVisibility } = useModalContext();
	const [addresses, setAddresses] = useState<IAddressBookItem[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const { addressBook, setUserDetailsContextState } = useGlobalUserDetailsContext();

	const handleAddAddress = async (address: string, name: string, email?: string, discord?: string, telegram?: string, roles?: string[]) => {
		try {
			const userAddress = localStorage.getItem('address');
			const signature = localStorage.getItem('signature');

			if (!userAddress || !signature) {
				console.log('ERROR');
				return;
			} else {
				if (addressBook.some((item: any) => item.address === address)) {
					return;
				}

				const addAddressRes = await fetch(`${FIREBASE_FUNCTIONS_URL}/addToAddressBookEth`, {
					body: JSON.stringify({
						address,
						discord: discord || '',
						email: email || '',
						name,
						roles: roles || [],
						telegram: telegram || ''
					}),
					method: 'POST'
				});

				const { data: addAddressData, error: addAddressError } = (await addAddressRes.json()) as {
					data: IAddressBookItem[];
					error: string;
				};

				if (addAddressError) {
					queueNotification({
						header: 'Error!',
						message: addAddressError,
						status: NotificationStatus.ERROR
					});
					return;
				}

				if (addAddressData) {
					setUserDetailsContextState((prevState: any) => {
						return {
							...prevState,
							addressBook: addAddressData
						};
					});
				}
			}
		} catch (error) {
			console.log('ERROR', error);
			setLoading(false);
		}
	};

	const addImportedAddresses = () => {
		setLoading(true);
		Promise.all(addresses.map((item) => handleAddAddress(item.address, item.name, item.email, item.discord, item.telegram, item.roles))).then(() => {
			queueNotification({
				header: 'Success!',
				message: 'Addresses Added.',
				status: NotificationStatus.SUCCESS
			});
			setLoading(false);
			toggleVisibility();
		});
	};

	return (
		<div className='flex flex-col w-[560px]'>
			<div className='bg-bg-secondary p-4 m-3 rounded-md'>
				<DragDrop setAddresses={setAddresses} />
			</div>
			<div className='flex items-center justify-between gap-x-5 mt-[30px]'>
				<CancelBtn onClick={toggleVisibility} />
				<AddBtn
					onClick={addImportedAddresses}
					loading={loading}
					title='Import'
				/>
			</div>
		</div>
	);
};

export default ImportAdress;
