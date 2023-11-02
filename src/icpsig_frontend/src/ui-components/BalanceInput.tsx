// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Form, Input } from 'antd';
import React from 'react';
import { chainProperties } from 'src/global/networkConstants';

interface Props {
	className?: string;
	label?: string;
	fromBalance?: string;
	onChange: (balance: string) => void;
	placeholder?: string;
	defaultValue?: string;
}

const BalanceInput = ({ className, label = '', onChange, placeholder = '', defaultValue = '' }: Props) => {
	return (
		<section className={`${className}`}>
			<label className='text-primary font-normal text-xs leading-[13px] block mb-[5px]'>{label}</label>
			<div className='flex items-center gap-x-[10px]'>
				<article className='w-full'>
					<Form.Item
						className='border-0 outline-0 my-0 p-0'
						name='balance'
						rules={[{ required: true }]}
					>
						<div className='flex items-center h-[50px]'>
							<Input
								id='balance'
								onChange={(e) => onChange(e.target.value)}
								placeholder={`${placeholder} `}
								defaultValue={defaultValue}
								className='w-full h-full text-sm font-normal leading-[15px] border-0 outline-0 p-3 placeholder:text-[#505050] bg-bg-secondary rounded-lg text-white pr-24'
							/>
							<div className='absolute right-0 text-white px-3 flex items-center justify-center'>
								{/* <ParachainIcon src={chainProperties[network].logo} className='mr-2' />
							<span>{chainProperties[network].ticker}</span> */}
							</div>
						</div>
					</Form.Item>
				</article>
			</div>
		</section>
	);
};

export default BalanceInput;
