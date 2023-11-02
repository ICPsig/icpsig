// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { Badge, Modal } from 'antd';
import classNames from 'classnames';
import React, { FC, useEffect, useState } from 'react';
import { MetaMaskAvatar } from 'react-metamask-avatar';
import { Link, useLocation } from 'react-router-dom';
import polkasafeLogo from 'src/assets/icons/polkasafe.svg';
import AddMultisig from 'src/components/Multisig/AddMultisig';
import { useGlobalUserDetailsContext } from 'src/context/UserDetailsContext';
import { AddressBookIcon, AppsIcon, AssetsIcon, HomeIcon, NotificationIcon, OutlineCloseIcon, SettingsIcon, TransactionIcon, UserPlusIcon } from 'src/ui-components/CustomIcons';

interface Props {
	className?: string;
}

const Menu: FC<Props> = ({ className }) => {
	const { multisigAddresses, setUserDetailsContextState, activeMultisig, multisigSettings } = useGlobalUserDetailsContext();
	const [selectedMultisigAddress, setSelectedMultisigAddress] = useState(activeMultisig || localStorage.getItem('active_multisig') || '');
	const location = useLocation();
	const userAddress = localStorage.getItem('address');
	useEffect(() => {
		if (activeMultisig) {
			setSelectedMultisigAddress(activeMultisig);
		}
	}, [activeMultisig]);

	const [openAddMultisig, setOpenAddMultisig] = useState(false);

	const menuItems = [
		{
			icon: <HomeIcon />,
			key: '/',
			title: 'Home'
		},
		{
			icon: <AssetsIcon />,
			key: '/assets',
			title: 'Assets'
		},
		{
			icon: <TransactionIcon />,
			key: '/transactions',
			title: 'Transactions'
		},
		{
			icon: <AddressBookIcon />,
			key: '/address-book',
			title: 'Address Book'
		},
		{
			icon: <AppsIcon />,
			key: '/apps',
			title: 'Apps'
		}
	];

	if (userAddress) {
		menuItems.push(
			{
				icon: <NotificationIcon />,
				key: '/notification-settings',
				title: 'Notifications'
			},
			{
				icon: <SettingsIcon />,
				key: '/settings',
				title: 'Settings'
			}
		);
	}

	const AddMultisigModal: FC = () => {
		return (
			<Modal
				centered
				footer={false}
				closeIcon={
					<button
						className='outline-none border-none bg-highlight w-6 h-6 rounded-full flex items-center justify-center'
						onClick={() => setOpenAddMultisig(false)}
					>
						<OutlineCloseIcon className='text-primary w-2 h-2' />
					</button>
				}
				open={openAddMultisig}
				className={`${className} w-auto md:min-w-[500px] scale-90 origin-center`}
			>
				<AddMultisig
					onCancel={() => setOpenAddMultisig(false)}
					isModalPopup={true}
				/>
			</Modal>
		);
	};

	return (
		<div className={classNames(className, 'bg-bg-main flex flex-col h-full py-[25px] px-3')}>
			<AddMultisigModal />
			<div className='flex flex-col mb-3'>
				<section className='flex mb-7 justify-center w-full'>
					<Link
						className='text-white'
						to='/'
					>
						<Badge
							offset={[-15, 35]}
							size='small'
							count='Beta'
							color='#1573FE'
						>
							<img
								src={polkasafeLogo}
								alt='polkasafe logo'
								className='h-[25px]'
							/>
						</Badge>
					</Link>
				</section>
				<section>
					<h2 className='uppercase text-text_secondary ml-3 text-[10px] font-primary'>Menu</h2>
					<ul className='flex flex-col py-2 text-white list-none'>
						{menuItems.map((item) => {
							return (
								<li
									className='w-full'
									key={item.key}
								>
									<Link
										className={classNames('flex items-center gap-x-2 flex-1 rounded-lg p-3 font-medium text-[13px]', {
											'bg-highlight text-primary': item.key === location.pathname
										})}
										to={item.key}
									>
										{item.icon}
										{item.title}
										{item.title === 'Notifications' && <div className={'px-[6px] py-[1px] text-[10px] rounded-lg text-xs bg-primary text-white'}>New</div>}
									</Link>
								</li>
							);
						})}
					</ul>
				</section>
			</div>
			<h2 className='uppercase text-text_secondary ml-3 text-[10px] font-primary flex items-center justify-between'>
				<span>Multisigs</span>
				<span className='bg-highlight text-primary rounded-full flex items-center justify-center h-5 w-5 font-normal text-xs'>
					{multisigAddresses ? multisigAddresses.length : '0'}
				</span>
			</h2>
			<section className='overflow-y-auto max-h-full [&::-webkit-scrollbar]:hidden flex-1 mb-3'>
				{multisigAddresses && (
					<ul className='flex flex-col gap-y-2 py-3 text-white list-none'>
						{multisigAddresses
							.filter((multisig) => !multisigSettings?.[`${multisig.address}_${multisig.network}`]?.deleted && !multisig.disabled)
							.map((multisig) => {
								return (
									<li
										className='w-full'
										key={multisig.address}
									>
										<button
											className={classNames('w-full flex items-center gap-x-2 flex-1 rounded-lg p-3 font-medium text-[13px]', {
												'bg-highlight text-primary': multisig.address === selectedMultisigAddress
											})}
											onClick={() => {
												setUserDetailsContextState((prevState: any) => {
													return {
														...prevState,
														activeMultisig: multisig.address
													};
												});
												localStorage.setItem('active_multisig', multisig.address);
											}}
										>
											<MetaMaskAvatar
												address={multisig.address}
												size={23}
											/>
											<span className='truncate'>{multisig.name}</span>
										</button>
									</li>
								);
							})}
					</ul>
				)}
			</section>
			{userAddress && (
				<section className='mt-auto'>
					<button
						className='text-white bg-primary p-3 rounded-lg w-full flex items-center justify-center gap-x-2 cursor-pointer'
						onClick={() => setOpenAddMultisig(true)}
					>
						<UserPlusIcon className='text-sm' />
						<span className='font-medium text-xs'>Add Multisig</span>
					</button>
				</section>
			)}
		</div>
	);
};

export default Menu;
