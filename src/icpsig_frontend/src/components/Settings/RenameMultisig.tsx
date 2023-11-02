// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { Form, Input } from 'antd';
import React, { useState } from 'react';
import CancelBtn from 'src/components/Settings/CancelBtn';
import ModalBtn from 'src/components/Settings/ModalBtn';
import { useModalContext } from 'src/context/ModalContext';
import { useGlobalUserDetailsContext } from 'src/context/UserDetailsContext';
import { firebaseFunctionsHeader } from 'src/global/firebaseFunctionsHeader';
import { FIREBASE_FUNCTIONS_URL } from 'src/global/firebaseFunctionsUrl';
import { NotificationStatus } from 'src/types';
import queueNotification from 'src/ui-components/QueueNotification';

const RenameMultisig = ({ name }: { name: string }) => {
	const { toggleVisibility } = useModalContext();

	const [multisigName, setMultisigName] = useState<string>(name);
	const [loading, setLoading] = useState<boolean>(false);
	const { activeMultisig, setUserDetailsContextState, multisigAddresses } = useGlobalUserDetailsContext();

	const multisig = multisigAddresses.find((item: any) => item.address === activeMultisig || item.proxy === activeMultisig);

	const handleMultisigNameChange = async () => {
		try {
			setLoading(true);
			const userAddress = localStorage.getItem('address');
			const signature = localStorage.getItem('signature');

			if (!userAddress || !signature || !multisigAddresses || !multisig?.address) {
				console.log('ERROR');
				setLoading(false);
				return;
			} else {
				const changeNameRes = await fetch(`${FIREBASE_FUNCTIONS_URL}/renameMultisigEth`, {
					body: JSON.stringify({
						address: multisig?.address,
						name: multisigName
					}),
					method: 'POST'
				});

				const { data: changeNameData, error: changeNameError } = (await changeNameRes.json()) as { data: any; error: string };

				if (changeNameError) {
					queueNotification({
						header: 'Error!',
						message: changeNameError,
						status: NotificationStatus.ERROR
					});
					setLoading(false);
					return;
				}

				if (changeNameData) {
					const copyMultisigAddresses = [...multisigAddresses];
					const copyObject = copyMultisigAddresses?.find((item) => item.address === multisig.address);
					if (copyObject) {
						copyObject.name = multisigName;
						setUserDetailsContextState((prev: any) => {
							return {
								...prev,
								multisigAddresses: copyMultisigAddresses,
								multisigSettings: {
									...prev.multisigSettings,
									[multisig.address]: {
										...prev.multisigSettings[multisig.address],
										name: multisigName
									}
								}
							};
						});
					}

					queueNotification({
						header: 'Success!',
						message: 'Multisig Renamed!',
						status: NotificationStatus.SUCCESS
					});
					setLoading(false);
					toggleVisibility();
				}
			}
		} catch (error) {
			console.log('ERROR', error);
			setLoading(false);
		}
	};

	return (
		<Form className='my-0'>
			<div className='flex flex-col gap-y-3'>
				<label
					className='text-white font-anormal text-sm leading-[15px]'
					htmlFor='review'
				>
					Enter Name
				</label>
				<Form.Item
					name='multisig_name'
					rules={[]}
					className='border-0 outline-0 my-0 p-0'
					initialValue={multisigName}
				>
					<Input
						placeholder='Mutlisig Name'
						className='text-sm font-normal m-0 leading-[15px] border-0 outline-0 p-3 placeholder:text-[#505050] bg-bg-secondary rounded-lg text-white'
						id='multisig_name'
						value={multisigName}
						defaultValue={multisigName}
						onChange={(e) => setMultisigName(e.target.value)}
					/>
				</Form.Item>
			</div>
			<div className='flex items-center justify-between gap-x-5 mt-[30px]'>
				<CancelBtn onClick={toggleVisibility} />
				<ModalBtn
					loading={loading}
					onClick={handleMultisigNameChange}
					title='Update'
				/>
			</div>
		</Form>
	);
};

export default RenameMultisig;
