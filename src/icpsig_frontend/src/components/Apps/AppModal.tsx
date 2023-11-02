// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React from 'react';
import subid from 'src/assets/subid.svg';
import { useModalContext } from 'src/context/ModalContext';
import { NETWORK } from 'src/global/networkConstants';
import { ArrowRightIcon } from 'src/ui-components/CustomIcons';
const AppModal = () => {
	const { closeModal } = useModalContext();
	return (
		<>
			<div className={'flex flex-col cursor-pointer justify-around rounded-lg scale-90 w-[100%] -mt-[25px] -mb-[25px] origin-top-left'}>
				<div className='flex flex-col overflow-auto w-[110%]'>
					<img
						src={subid}
						alt=''
						height='70'
						width='70'
					/>
					<div className='mt-3'>
						<div className='text-3xl text-white font-semibold'>Sub ID</div>
						<div className='mt-2 text-[#8B8B8B] font-medium text-14 leading-tight font-archivo'>One Stop Shop For All Substrate Addresses And Balances</div>
					</div>
					<div className='mt-5 flex flex-col gap-3'>
						<div className='text-[#8B8B8B] font-medium text-base text-14 leading-tight font-archivo'>Available networks</div>
						<div className='flex gap-2 flex-wrap max-w-[400px]'>
							{Object.values(NETWORK).map((net) => (
								<button
									key={net}
									className='rounded-lg py-2 px-[10px] text-sm leading-[15px] text-white text-primary bg-highlight'
								>
									{' '}
									{net}{' '}
								</button>
							))}
						</div>
					</div>
					<button
						className='mt-10 text-white bg-primary p-3 rounded-lg w-full flex items-center justify-center gap-x-1 cursor-pointer'
						onClick={() => {
							closeModal();
						}}
					>
						<span className='font-medium text-xs'>Open app</span>
						<ArrowRightIcon className='text-sm' />
					</button>
				</div>
			</div>
		</>
	);
};
export default AppModal;
