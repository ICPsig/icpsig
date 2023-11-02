// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import noAssets from 'src/assets/icons/no-transaction.svg';

const NoAssets = () => {
	return (
		<div className='flex flex-col gap-y-10 items-center justify-center mt-[82.5px] mb-[110px]'>
			<img
				className='block w-[380px] h-[200px]'
				src={noAssets}
				alt='Zero transaction icon'
			/>
			<p className='font-normal text-sm leading-[15px] text-text_secondary'>No Assets Found.</p>
		</div>
	);
};

export default NoAssets;
