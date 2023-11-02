// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
/* eslint-disable sort-keys */

import { Spin } from 'antd';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { MetaMaskAvatar } from 'react-metamask-avatar';
import FailedTransactionLottie from 'src/assets/lottie-graphics/FailedTransaction';
import LoadingLottie from 'src/assets/lottie-graphics/Loading';
import CancelBtn from 'src/components/Multisig/CancelBtn';
import AddBtn from 'src/components/Multisig/ModalBtn';
import { useGlobalUserDetailsContext } from 'src/context/UserDetailsContext';
import AddressComponent from 'src/ui-components/AddressComponent';
import Balance from 'src/ui-components/Balance';
import { CheckOutlined, CopyIcon, WarningCircleIcon } from 'src/ui-components/CustomIcons';
import ProxyImpPoints from 'src/ui-components/ProxyImpPoints';
import copyText from 'src/utils/copyText';
import shortenAddress from 'src/utils/shortenAddress';

import Loader from '../UserFlow/Loader';
import AddProxySuccessScreen from './AddProxySuccessScreen';

interface IMultisigProps {
	className?: string;
	onCancel?: () => void;
	homepage?: boolean;
	signatories?: string[];
	threshold?: number;
	setProxyInProcess?: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddProxy: React.FC<IMultisigProps> = ({ onCancel, homepage, setProxyInProcess }) => {
	const { address: userAddress, multisigAddresses, activeMultisig, addressBook } = useGlobalUserDetailsContext();

	const [loading, setLoading] = useState<boolean>(false);
	const [success] = useState<boolean>(false);
	const [failure, setFailure] = useState<boolean>(false);
	const [loadingMessages] = useState<string>('');

	const multisig = multisigAddresses?.find((item: any) => item.address === activeMultisig);

	const [txnHash] = useState<string>('');

	const createProxy = async () => {
		setLoading(true);
		try {
			console.log('');
		} catch (error) {
			console.log(error);
			setFailure(true);
			setLoading(false);
		}
	};

	const CreateProxyFailedScreen: React.FC = () => {
		return (
			<div className='flex flex-col items-center'>
				<FailedTransactionLottie message='Proxy creation failed!' />
				<div className='flex flex-col w-full gap-y-4 bg-bg-secondary p-4 rounded-lg mb-1 mt-4 text-text_secondary'>
					{txnHash && (
						<div className='flex justify-between items-center'>
							<span>Txn Hash:</span>
							<div className='flex items-center gap-x-1'>
								<span className='text-white'>{shortenAddress(txnHash)}</span>
								<button onClick={() => copyText(txnHash)}>
									<CopyIcon className='mr-2 text-primary' />
								</button>
							</div>
						</div>
					)}
					<div className='flex justify-between items-center'>
						<span>Created:</span>
						<span className='text-white'>{dayjs().format('llll')}</span>
					</div>
					<div className='flex justify-between items-center'>
						<span>Created By:</span>
						<span>
							<AddressComponent address={userAddress} />
						</span>
					</div>
				</div>
			</div>
		);
	};

	return (
		<>
			{success ? (
				<AddProxySuccessScreen
					txnHash={txnHash}
					createdBy={userAddress}
					threshold={multisig?.threshold || 2}
					signatories={multisig?.signatories || []}
					successMessage='Proxy creation in progress!'
					waitMessage='All threshold signatories need to sign the Transaction to Create a Proxy.'
					onDone={() => {
						setProxyInProcess?.(true);
						onCancel?.();
					}}
				/>
			) : failure ? (
				<CreateProxyFailedScreen />
			) : (
				<Spin
					spinning={loading}
					indicator={<LoadingLottie message={loadingMessages} />}
				>
					{!homepage && (
						<div className='flex justify-center gap-x-4 items-center mb-5 w-full'>
							<div className='flex flex-col text-white items-center justify-center'>
								<div className='rounded-lg bg-primary w-9 h-9 mb-2 flex items-center justify-center'>
									<CheckOutlined />
								</div>
								<p className='text-text_secondary'>Create Multisig</p>
							</div>
							<Loader className='bg-primary h-[2px] w-[80px]' />
							<div className='flex flex-col text-white items-center justify-center'>
								<div className='rounded-lg bg-primary w-9 h-9 mb-2 flex items-center justify-center'>2</div>
								<p>Create Proxy</p>
							</div>
						</div>
					)}
					<div className='w-full flex justify-center mb-3'>
						<ProxyImpPoints />
					</div>
					<div className='text-primary mb-2'>Signed As</div>
					<div className='mb-4 p-[10px] border-2 border-dashed border-bg-secondary rounded-lg flex items-center gap-x-4'>
						<div className='flex items-center justify-center w-10 h-10'>
							<MetaMaskAvatar
								address={userAddress}
								size={30}
							/>
						</div>
						<div className='flex flex-col gap-y-[6px]'>
							<h4 className='font-medium text-sm leading-[15px] text-white'>{addressBook?.find((a: any) => a.address === userAddress)?.name}</h4>
							<p className='text-text_secondary font-normal text-xs leading-[13px]'>{userAddress}</p>
						</div>
						<Balance address={userAddress} />
					</div>

					<section className='mb-4 w-full text-waiting bg-waiting bg-opacity-10 p-3 rounded-lg font-normal text-xs leading-[16px] flex items-center gap-x-[11px]'>
						<span>
							<WarningCircleIcon className='text-base' />
						</span>
						<p>A small fees would be deducted from the sender account and approval would be required from threshold signatories to create a proxy.</p>
					</section>

					<div className='flex items-center justify-center gap-x-5 mt-[40px]'>
						<CancelBtn onClick={onCancel} />
						<AddBtn
							title='Create Proxy'
							onClick={createProxy}
						/>
					</div>
				</Spin>
			)}
		</>
	);
};

export default AddProxy;
