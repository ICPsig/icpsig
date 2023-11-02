// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { FC, PropsWithChildren } from 'react';
import Loader from 'src/components/UserFlow/Loader';

interface IConnectWalletWrapperProps extends PropsWithChildren {}

const ConnectWalletWrapper: FC<IConnectWalletWrapperProps> = (props) => {
	const { children } = props;
	return (
		<div className='min-h-[70vh] bg-bg-main flex flex-col rounded-xl p-5'>
			<section className='grid grid-cols-2 gap-x-5'>
				<Loader className='bg-primary col-span-1' />
				<Loader className='bg-highlight col-span-1' />
			</section>
			{children}
		</div>
	);
};

export default ConnectWalletWrapper;
