// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { Divider, Spin } from 'antd';
import React, { FC } from 'react';
import AddressComponent from 'src/ui-components/AddressComponent';
import { CopyIcon } from 'src/ui-components/CustomIcons';
import copyText from 'src/utils/copyText';
import shortenAddress from 'src/utils/shortenAddress';

interface IReceivedInfoProps {
	className?: string;
	amount: string;
	addedOwner?: string;
	amountType: string;
	amount_usd: number;
	date: string;
	// time: string;
	from: string;
	to: string | string[];
	callHash: string;
	note?: string;
	loading?: boolean;
}

const ReceivedInfo: FC<IReceivedInfoProps> = ({ amount, to, date, from, callHash, note, loading, addedOwner }) => {
	return (
		<article className='p-4 rounded-lg bg-bg-main flex-1'>
			<p className='flex items-center gap-x-1 text-white font-medium text-sm leading-[15px]'>
				<span>Received</span>
				<span className='text-success'>{amount}</span>
				<span>from:</span>
			</p>
			<div className='mt-3'>
				<AddressComponent address={from} />
			</div>
			<Divider className='bg-text_secondary my-5' />
			<div className=' flex items-center gap-x-7 mb-3'>
				<span className='text-text_secondary font-normal text-sm leading-[15px]'>To:</span>
				<AddressComponent address={to.toString()} />
			</div>
			<div className='w-full max-w-[418px] flex items-center gap-x-5'>
				<span className='text-text_secondary font-normal text-sm leading-[15px]'>Txn Hash:</span>
				<p className='flex items-center gap-x-3 font-normal text-xs leading-[13px] text-text_secondary'>
					<span className='text-white font-normal text-sm leading-[15px]'>{shortenAddress(callHash, 10)}</span>
					<span className='flex items-center gap-x-2 text-sm'>
						<button onClick={() => copyText(callHash)}>
							<CopyIcon />
						</button>
						{/* <ExternalLinkIcon /> */}
					</span>
				</p>
			</div>
			{date && (
				<div className='w-full max-w-[418px] flex items-center gap-x-5 mt-3'>
					<span className='text-text_secondary font-normal text-sm leading-[15px]'>Executed:</span>
					<p className='flex items-center gap-x-3 font-normal text-xs leading-[13px] text-text_secondary'>
						<span className='text-white font-normal text-sm leading-[15px]'>{date}</span>
					</p>
				</div>
			)}
			{addedOwner && (
				<div className='w-full max-w-[418px] flex items-center  gap-x-5 mt-3'>
					<span className='text-text_secondary font-normal text-sm leading-[15px]'>Added Owner:</span>
					<p className='flex items-center gap-x-3 font-normal text-xs leading-[13px] text-text_secondary'>
						<AddressComponent address={addedOwner} />
					</p>
				</div>
			)}
			{loading ? (
				<Spin className='mt-3' />
			) : (
				note && (
					<div className='w-full max-w-[418px] flex items-center gap-x-5 mt-3'>
						<span className='text-text_secondary font-normal text-sm leading-[15px]'>Note:</span>
						<p className='flex items-center gap-x-3 font-normal text-xs leading-[13px] text-text_secondary'>
							<span className='text-white font-normal text-sm leading-[15px] whitespace-pre'>{note}</span>
						</p>
					</div>
				)
			)}
		</article>
	);
};

export default ReceivedInfo;
