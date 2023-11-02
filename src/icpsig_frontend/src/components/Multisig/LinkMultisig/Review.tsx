// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { MetaMaskAvatar } from 'react-metamask-avatar';
import { DEFAULT_ADDRESS_NAME } from 'src/global/default';
import { IMultisigAddress } from 'src/types';
import { CheckOutlined, CopyIcon, ExternalLinkIcon } from 'src/ui-components/CustomIcons';
import copyText from 'src/utils/copyText';
import shortenAddress from 'src/utils/shortenAddress';

import Loader from '../../UserFlow/Loader';

interface ISignatory {
	name: string;
	address: string;
}

interface Props {
	signatories: ISignatory[];
	multisigData?: IMultisigAddress;
	multisigName: string;
}

const Review = ({ multisigData, signatories, multisigName }: Props) => {
	return (
		<div>
			<div className='flex flex-col items-center text-white w-[800px] h-[400px]'>
				<div className='flex justify-around items-center mb-10 w-full'>
					<div className='flex flex-col text-white items-center justify-center'>
						<div className='rounded-lg bg-primary w-9 h-9 mb-2 flex items-center justify-center'>
							<CheckOutlined />
						</div>
						<p>Select Network</p>
					</div>
					<Loader className='bg-primary h-[2px] w-[80px]' />
					<div className='flex flex-col text-white items-center justify-center'>
						<div className='rounded-lg bg-primary w-9 h-9 mb-2 flex items-center justify-center'>
							<CheckOutlined />
						</div>
						<p>Name & Address</p>
					</div>
					<Loader className='bg-primary h-[2px] w-[80px]' />
					<div className='flex flex-col text-white items-center justify-center'>
						<div className='rounded-lg bg-primary w-9 h-9 mb-2 flex items-center justify-center'>
							<CheckOutlined />
						</div>
						<p>Owners</p>
					</div>
					<Loader className='bg-primary h-[2px] w-[80px]' />
					<div className='flex flex-col text-white items-center justify-center'>
						<div className='rounded-lg bg-primary w-9 h-9 mb-2 flex items-center justify-center'>4</div>
						<p>Review</p>
					</div>
				</div>
				<div className='flex w-[80%] h-[30vh] mt-5'>
					<div className='flex flex-col justify-between w-[60%] mr-2 h-full rounded-lg bg-bg-secondary text-sm overflow-auto [&::-webkit-scrollbar]:hidden'>
						<h1 className='mt-5 mx-5'>Details</h1>
						<div>
							<div className='flex items-center justify-between m-5'>
								<p className='text-text_secondary'>Network:</p>
								<p className='text-primary capitalize'>{multisigData?.network}</p>
							</div>
							<div className='flex items-center justify-between mx-5 mb-5'>
								<p className='text-text_secondary'>Safe Name:</p>
								<p>{multisigName ? multisigName : multisigData?.name}</p>
							</div>
							<div className='flex items-center justify-between mx-5 mb-5'>
								<p className='text-text_secondary'>Safe Address:</p>
								<div className='flex items-center'>
									<MetaMaskAvatar
										address={multisigData?.address || ''}
										size={30}
									/>
									<p className='mx-2'>{shortenAddress(multisigData?.address || '')}</p>
									<button onClick={() => copyText(multisigData?.address || '')}>
										<CopyIcon className='mr-2 text-text_secondary hover:text-primary' />
									</button>
								</div>
							</div>
							<div className='flex items-center justify-between mx-5 mb-5'>
								<p className='text-text_secondary'>Confirmations:</p>
								<p>
									<span className='text-primary'>{multisigData?.threshold}</span> out {multisigData?.signatories.length} owners
								</p>
							</div>
						</div>
					</div>
					<div className='w-[50%] ml-2 h-full rounded-lg bg-bg-secondary [&::-webkit-scrollbar]:hidden'>
						<div className='flex flex-col h-full rounded-lg bg-bg-secondary text-sm'>
							<h1 className='mt-5 mx-5'>Owners</h1>
							<div className='flex flex-1 flex-col items-center justify-start overflow-auto'>
								{signatories.map((item, i: number) => (
									<div
										className='flex items-center mx-5 mt-5'
										key={i}
									>
										<MetaMaskAvatar
											address={item.address}
											size={30}
										/>
										<div className='flex flex-col'>
											<p className='text-sm'>{item.name || DEFAULT_ADDRESS_NAME}</p>
											<div className='flex'>
												<p className='text-sm text-text_secondary'>{shortenAddress(item.address)}</p>
												<button
													className='mx-1'
													onClick={() => navigator.clipboard.writeText(item.address)}
												>
													<CopyIcon className='text-text_secondary cursor-pointer hover:text-primary' />
												</button>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Review;
