// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
// import { PlusCircleOutlined } from '@ant-design/icons';
import { AutoComplete, Button, Form, Input, Spin, Tooltip } from 'antd';
import React, { useState } from 'react';
import AddMultisigSVG from 'src/assets/add-multisig.svg';
import FailedTransactionLottie from 'src/assets/lottie-graphics/FailedTransaction';
import LoadingLottie from 'src/assets/lottie-graphics/Loading';
import RemoveMultisigSVG from 'src/assets/remove-multisig.svg';
import AddProxySuccessScreen from 'src/components/Multisig/AddProxySuccessScreen';
import CancelBtn from 'src/components/Settings/CancelBtn';
import AddBtn from 'src/components/Settings/ModalBtn';
import Loader from 'src/components/UserFlow/Loader';
import { useGlobalUserDetailsContext } from 'src/context/UserDetailsContext';
import { NotificationStatus } from 'src/types';
import { WarningCircleIcon } from 'src/ui-components/CustomIcons';
import queueNotification from 'src/ui-components/QueueNotification';
import { addNewTransaction } from 'src/utils/addNewTransaction';
import styled from '@xstyled/styled-components';

interface ISignatory {
	name: string;
	address: string;
}

const addRecipientHeading = () => {
	const elm = document.getElementById('recipient_list');
	if (elm) {
		const parentElm = elm.parentElement;
		if (parentElm) {
			const isElmPresent = document.getElementById('recipient_heading');
			if (!isElmPresent) {
				const recipientHeading = document.createElement('p');
				recipientHeading.textContent = 'Recent Addresses';
				recipientHeading.id = 'recipient_heading';
				recipientHeading.classList.add('recipient_heading');
				parentElm.insertBefore(recipientHeading, parentElm.firstChild!);
			}
		}
	}
};

const AddOwner = ({ onCancel, className }: { onCancel?: () => void; className?: string }) => {
	const { multisigAddresses, activeMultisig, addressBook, address, identityBackend } = useGlobalUserDetailsContext();
	const multisig = multisigAddresses.find((item: any) => item.address === activeMultisig || item.proxy === activeMultisig);
	const [loading, setLoading] = useState(false);
	const [success] = useState<boolean>(false);
	const [failure] = useState<boolean>(false);
	const [loadingMessages] = useState<string>('');
	const [txnHash] = useState<string>('');
	const [newThreshold, setNewThreshold] = useState<number>(multisig?.threshold || 2);

	const [signatoriesArray, setSignatoriesArray] = useState<ISignatory[]>([{ address: '', name: '' }]);

	const onSignatoryChange = (value: any, i: number) => {
		setSignatoriesArray((prevState) => {
			const copyArray = [...prevState];
			const copyObject = { ...copyArray[i] };
			copyObject.address = value;
			copyArray[i] = copyObject;
			return copyArray;
		});
	};
	const onNameChange = (event: any, i: number) => {
		setSignatoriesArray((prevState) => {
			const copyArray = [...prevState];
			const copyObject = { ...copyArray[i] };
			copyObject.name = event.target.value;
			copyArray[i] = copyObject;
			return copyArray;
		});
	};

	const onRemoveSignatory = (i: number) => {
		const copyOptionsArray = [...signatoriesArray];
		copyOptionsArray.splice(i, 1);
		setSignatoriesArray(copyOptionsArray);
	};

	const handleAddOwner = async () => {
		if (!identityBackend) {
			return;
		}
		setLoading(true);
		try {
			const safeTxHash = (await identityBackend.createAddOwnerTx(activeMultisig, signatoriesArray?.[0].address, newThreshold)).data;
			if (safeTxHash) {
				onCancel?.();
				setLoading(false);
				queueNotification({
					header: 'Success',
					message: 'New Transaction Created.',
					status: NotificationStatus.SUCCESS
				});
			} else {
				setLoading(false);
				queueNotification({
					header: 'Failed',
					message: 'Something went wrong.',
					status: NotificationStatus.ERROR
				});
			}
		} catch (err) {
			console.log(err);
			onCancel?.();
			setLoading(false);
			queueNotification({
				header: 'Error.',
				message: 'Please try again.',
				status: NotificationStatus.ERROR
			});
		}
	};

	return (
		<>
			{success ? (
				<AddProxySuccessScreen
					createdBy={address}
					signatories={multisig?.signatories || []}
					threshold={multisig?.threshold || 2}
					txnHash={txnHash}
					onDone={() => onCancel?.()}
					successMessage='Multisig Edit in Progress!'
					waitMessage='All threshold signatories need to sign the Transaction to Edit the Multisig.'
				/>
			) : failure ? (
				<FailedTransactionLottie message='Failed!' />
			) : (
				<Spin
					spinning={loading}
					indicator={<LoadingLottie message={loadingMessages} />}
				>
					<Form className={`my-0 w-[560px] ${className}`}>
						<div className='flex justify-center gap-x-4 items-center mb-6 w-full'>
							<div className='flex flex-col text-white items-center justify-center'>
								<img src={AddMultisigSVG} />
								<p className='text-text_secondary'>Add New Multisig</p>
							</div>
							<Loader className='bg-primary h-[2px] w-[80px]' />
							<div className='flex flex-col text-white items-center justify-center'>
								<img src={RemoveMultisigSVG} />
								<p className='text-text_secondary'>Remove Old Multisig</p>
							</div>
						</div>
						<section className='mb-4 w-full text-waiting bg-waiting bg-opacity-10 p-3 rounded-lg font-normal text-xs leading-[16px] flex items-center gap-x-[11px]'>
							<span>
								<WarningCircleIcon className='text-base' />
							</span>
							<p>Adding Signatories would require you to sign two transactions and approval from other signatories.</p>
						</section>
						<div className='max-h-[40vh] overflow-y-auto'>
							{signatoriesArray.map((signatory, i) => (
								<div
									className='flex flex-col gap-y-2 max-h-[20vh] overflow-y-auto'
									key={i}
								>
									<div className='flex items-center gap-x-4'>
										<div className='flex-1 flex items-start gap-x-4'>
											<Form.Item>
												<label className='text-primary text-xs leading-[13px] font-normal'>Name</label>
												<Input
													placeholder={'Name'}
													className=' text-sm font-normal m-0 leading-[15px] border-0 outline-0 p-3 placeholder:text-[#505050] bg-bg-secondary rounded-lg text-white'
													value={signatory.name}
													onChange={(e) => onNameChange(e, i)}
												/>
											</Form.Item>
											<Form.Item
												className='w-full'
												name={'Address'}
												rules={[{ required: true }]}
											>
												<label className='text-primary text-xs leading-[13px] font-normal'>Address</label>
												<AutoComplete
													onClick={addRecipientHeading}
													options={addressBook
														.filter((item: any) => !signatoriesArray.some((e) => e.address === item.address) && !multisig?.signatories.includes(item.address))
														.map((item: any) => ({
															label: item.name,
															value: item.address
														}))}
													id={'Address'}
													placeholder={'Address'}
													onChange={(value) => onSignatoryChange(value, i)}
												/>
											</Form.Item>
										</div>
										{i !== 0 && (
											<Button
												className='bg-bg-secondary rounded-lg text-white border-none outline-none '
												onClick={() => onRemoveSignatory(i)}
											>
												-
											</Button>
										)}
									</div>
								</div>
							))}
						</div>
						<div className='flex flex-col gap-y-3 mt-5'>
							<label
								className='text-primary text-xs leading-[13px] font-normal'
								htmlFor='address'
							>
								Threshold
							</label>
							<div className='flex items-center gap-x-3'>
								<p className='flex items-center justify-center gap-x-[16.83px] p-[12.83px] bg-bg-secondary rounded-lg'>
									<Tooltip title={newThreshold === 2 && 'Minimum Threshold must be 2'}>
										<Button
											onClick={() => {
												if (newThreshold !== 2) {
													setNewThreshold((prev) => prev - 1);
												}
											}}
											className={`p-0 outline-none border rounded-full flex items-center justify-center ${
												newThreshold === 2 ? 'border-text_secondary text-text_secondary' : 'text-primary border-primary'
											} w-[14.5px] h-[14.5px]`}
										>
											-
										</Button>
									</Tooltip>
									<span className='text-white text-sm'>{newThreshold}</span>
									<Tooltip title={newThreshold === (multisig?.signatories.length || 0) + signatoriesArray.length && 'Threshold must be Less than or Equal to Signatories'}>
										<Button
											onClick={() => {
												if (newThreshold < (multisig?.signatories.length || 0) + signatoriesArray.length) {
													setNewThreshold((prev) => prev + 1);
												}
											}}
											className={`p-0 outline-none border rounded-full flex items-center justify-center ${
												newThreshold === (multisig?.signatories.length || 0) + signatoriesArray.length ? 'border-text_secondary text-text_secondary' : 'text-primary border-primary'
											} w-[14.5px] h-[14.5px]`}
										>
											+
										</Button>
									</Tooltip>
								</p>
								<p className='text-text_secondary font-normal text-sm leading-[15px]'>
									out of
									<span className='text-white mx-1 font-medium'>{(multisig?.signatories.length || 0) + signatoriesArray.length}</span>
									owners
								</p>
							</div>
						</div>
						<div className='flex items-center justify-between gap-x-5 mt-[30px]'>
							<CancelBtn onClick={onCancel} />
							<AddBtn
								onClick={handleAddOwner}
								loading={loading}
								disabled={!signatoriesArray.length || signatoriesArray.some((item) => item.address === '' || multisig?.signatories.includes(item.address))}
								title='Add'
							/>
						</div>
					</Form>
				</Spin>
			)}
		</>
	);
};

export default styled(AddOwner)`
	.ant-select input {
		font-size: 14px !important;
		font-style: normal !important;
		line-height: 15px !important;
		border: 0 !important;
		outline: 0 !important;
		background-color: #24272e !important;
		border-radius: 8px !important;
		color: white !important;
		padding: 12px !important;
		display: block !important;
		height: auto !important;
	}
	.ant-select-selector {
		border: none !important;
		height: 40px !important;
		box-shadow: none !important;
	}

	.ant-select {
		height: 40px !important;
	}
	.ant-select-selection-search {
		inset: 0 !important;
	}
	.ant-select-selection-placeholder {
		color: #505050 !important;
		z-index: 100;
		display: flex !important;
		align-items: center !important;
	}
`;
