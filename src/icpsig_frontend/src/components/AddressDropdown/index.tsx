// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { Button } from 'antd';
import classNames from 'classnames';
import React, { useRef, useState } from 'react';
import { MetaMaskAvatar } from 'react-metamask-avatar';
import { Link, useNavigate } from 'react-router-dom';
import { useGlobalIdentityContext } from 'src/context/IdentityProviderContext';
import { useGlobalUserDetailsContext } from 'src/context/UserDetailsContext';
import { DEFAULT_ADDRESS_NAME } from 'src/global/default';
import Balance from 'src/ui-components/Balance';
import { CircleArrowDownIcon, CopyIcon, WarningRoundedIcon } from 'src/ui-components/CustomIcons';
import copyText from 'src/utils/copyText';
import shortenAddress from 'src/utils/shortenAddress';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface IAddress {
	value: string;
	imgSrc: string;
}
const AddressDropdown = () => {
	const { account } = useGlobalIdentityContext();
	const { addressBook, loggedInWallet, setUserDetailsContextState } = useGlobalUserDetailsContext();
	const navigate = useNavigate();

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [isVisible, toggleVisibility] = useState(false);
	const isMouseEnter = useRef(false);

	const handleDisconnect = async () => {
		localStorage.clear();
		setUserDetailsContextState((prevState: any) => {
			return {
				...prevState,
				activeMultisig: '',
				addressBook: [],
				multisigAddresses: []
			};
		});
		toggleVisibility(false);
		return navigate('/', { replace: true });
	};

	if (!account) {
		return (
			<Link
				to={'/'}
				className='flex items-center justify-center gap-x-2 outline-none border-none text-white bg-highlight rounded-lg p-2.5 shadow-none text-xs'
			>
				<WarningRoundedIcon className='text-sm text-primary' />
				Not Connected
			</Link>
		);
	}

	return (
		<div
			className='relative'
			onBlur={() => {
				if (!isMouseEnter.current) {
					isVisible ? toggleVisibility(false) : null;
				}
			}}
		>
			<button
				onClick={() => (isVisible ? toggleVisibility(false) : toggleVisibility(true))}
				className='flex items-center justify-center gap-x-2 outline-none border-none text-white bg-highlight rounded-lg p-2.5 shadow-none text-xs'
			>
				<p className='flex items-center gap-x-2'>
					{
						<span className='bg-primary flex items-center justify-center rounded-full'>
							<MetaMaskAvatar
								address={account}
								size={15}
							/>
						</span>
					}
					<span
						title={account}
						className='hidden md:inline-flex w-20 overflow-hidden truncate'
					>
						{addressBook?.find((item: any) => item.address === account)?.name || DEFAULT_ADDRESS_NAME}
					</span>
				</p>
				<CircleArrowDownIcon
					className={classNames('hidden md:inline-flex text-sm', {
						'text-primary': account,
						'text-white': !account
					})}
				/>
			</button>

			<div
				className={classNames('absolute scale-90 top-13 left-[-90px] rounded-xl border border-primary bg-bg-main py-[13.5px] px-3 z-40 min-w-[300px]', {
					'opacity-0 h-0 pointer-events-none hidden': !isVisible,
					'opacity-100 h-auto': isVisible
				})}
				onMouseEnter={() => {
					isMouseEnter.current = true;
				}}
				onMouseLeave={() => {
					isMouseEnter.current = false;
				}}
			>
				<div className='flex items-center justify-center flex-col gap-y-5'>
					<div className='flex items-center justify-center flex-col gap-y-2'>
						<MetaMaskAvatar
							address={account}
							size={50}
						/>
						<p className='text-white font-normal text-sm'>{addressBook?.find((item: any) => item.address === account)?.name || DEFAULT_ADDRESS_NAME}</p>
						<p className='bg-bg-secondary mb-1 w-[300px] font-normal gap-x-2 text-sm p-2 rounded-lg flex items-center justify-center'>
							<span className='text-text_secondary'>{shortenAddress(account)}</span>
							<button onClick={() => copyText(account)}>
								<CopyIcon className='text-base text-primary cursor-pointer' />
							</button>
						</p>
						<Balance
							className='ml-0'
							address={account}
						/>
					</div>
					<div className='w-full'>
						<p className='border-t border-text_secondary flex items-center text-normal text-sm justify-between w-full p-2'>
							<span className='text-text_secondary'>Wallet</span>
							<span className='text-white capitalize'>Pludge-Wallet</span>
						</p>
					</div>
					<Button
						onClick={handleDisconnect}
						className='rounded-lg outline-none border-none bg-failure bg-opacity-10 w-full flex items-center justify-center font-normal text-sm p-2 text-failure'
					>
						Disconnect
					</Button>
				</div>
			</div>
		</div>
	);
};

export default AddressDropdown;
