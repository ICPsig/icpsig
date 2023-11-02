// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { AutoComplete, Form, Input } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import React, { useEffect, useState } from 'react';
import LoadingLottie from 'src/assets/lottie-graphics/Loading';
import { useGlobalUserDetailsContext } from 'src/context/UserDetailsContext';
import AddressComponent from 'src/ui-components/AddressComponent';
import { CheckOutlined, OutlineCloseIcon } from 'src/ui-components/CustomIcons';
import styled from '@xstyled/styled-components';

import Loader from '../../UserFlow/Loader';

interface Props {
	className?: string;
	multisigAddress: string;
	setMultisigAddress: React.Dispatch<React.SetStateAction<string>>;
	multisigName: string;
	setMultisigName: React.Dispatch<React.SetStateAction<string>>;
}

const NameAddress = ({ className, multisigAddress, setMultisigAddress, multisigName, setMultisigName }: Props) => {
	const { address, identityBackend } = useGlobalUserDetailsContext();
	const { multisigAddresses } = useGlobalUserDetailsContext();

	const [allIcpMultisig, setAllIcpMultisig] = useState<DefaultOptionType[]>([]);
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		if (!identityBackend) {
			return;
		}
		const getAllIcpMultisig = async () => {
			setLoading(true);
			const icpMultisig = (await identityBackend.getAllMultisigByOwner(address)).data;
			const multiSigs = multisigAddresses.map((item) => item.address);
			const filteredIcpMultisig = icpMultisig?.filter((item: any) => !multiSigs.includes(item)) || [];
			setMultisigAddress(filteredIcpMultisig[0]);
			if (filteredIcpMultisig?.length > 0) {
				setAllIcpMultisig(
					filteredIcpMultisig.map((address: string) => ({
						label: (
							<AddressComponent
								onlyAddress
								address={address}
							/>
						),
						value: address
					}))
				);
			}
			setLoading(false);
		};
		getAllIcpMultisig();
	}, [address, multisigAddresses, identityBackend, setMultisigAddress]);

	return (
		<div className={className}>
			<div className='flex flex-col items-center w-[800px] h-[400px]'>
				<div className='flex justify-around items-center mb-10 w-full'>
					<div className='flex flex-col items-center text-white justify-center'>
						<div className='rounded-lg bg-primary w-9 h-9 mb-2 flex items-center justify-center'>
							<CheckOutlined />
						</div>
						<p>Select Network</p>
					</div>
					<Loader className='bg-primary h-[2px] w-[80px]' />
					<div className='flex flex-col text-white items-center justify-center'>
						<div className='rounded-lg bg-primary w-9 h-9 mb-2 flex items-center justify-center'>2</div>
						<p>Name & Address</p>
					</div>
					<Loader className='bg-bg-secondary h-[2px] w-[80px]' />
					<div className='flex flex-col text-white items-center justify-center'>
						<div className='rounded-lg bg-highlight text-primary w-9 h-9 mb-2 flex items-center justify-center'>3</div>
						<p>Owners</p>
					</div>
					<Loader className='bg-bg-secondary h-[2px] w-[80px]' />
					<div className='flex flex-col text-white items-center justify-center'>
						<div className='rounded-lg bg-highlight text-primary w-9 h-9 mb-2 flex items-center justify-center'>4</div>
						<p>Review</p>
					</div>
				</div>
				<div>
					{loading ? (
						<LoadingLottie
							message='Fetching Your Multisigs'
							width={250}
						/>
					) : (
						<Form className='my-0 w-[560px] mt-10'>
							<div className='flex flex-col gap-y-3'>
								<label
									className='text-primary text-xs leading-[13px] font-normal'
									htmlFor='name'
								>
									Safe Name
								</label>
								<Form.Item
									name='name'
									rules={[]}
									className='border-0 outline-0 my-0 p-0'
								>
									<Input
										placeholder='my-polka-safe'
										className='text-sm font-normal m-0 leading-[15px] border-0 outline-0 p-3 text-white placeholder:text-[#505050] bg-bg-secondary rounded-lg'
										id='name'
										value={multisigName}
										onChange={(e) => setMultisigName(e.target.value)}
									/>
								</Form.Item>
							</div>
							<div className='flex flex-col gap-y-3 mt-5'>
								<label
									className='text-primary text-xs leading-[13px] font-normal'
									htmlFor='address'
								>
									Safe Address*
								</label>
								<Form.Item
									name='Address'
									rules={[{ required: true }]}
									className='border-0 outline-0 my-0 p-0'
									help={!multisigAddress && 'Please enter a Valid Address'}
									validateStatus={!multisigAddress || !multisigAddress ? 'error' : 'success'}
								>
									<AutoComplete
										onChange={(value) => setMultisigAddress(value)}
										value={multisigAddress}
										allowClear
										clearIcon={<OutlineCloseIcon className='text-primary w-2 h-2' />}
										notFoundContent={!multisigAddress && <span className='text-white'>We can&apos;t find your multisigs, please enter multisig address.</span>}
										placeholder='Unique Safe Address'
										id='Address'
										options={allIcpMultisig}
									/>
								</Form.Item>
							</div>
						</Form>
					)}
				</div>
			</div>
		</div>
	);
};

export default styled(NameAddress)`
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
