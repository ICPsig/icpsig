// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
// import { QrDisplayAddress } from '@polkadot/react-qr';
import React, { useState } from 'react';

const AddressQr = ({ address }: { address: string }) => {
	const [genesisHash] = useState('');

	return <div className='flex flex-col items-center'>{/* <QrDisplayAddress size={150} address={address} genesisHash={genesisHash} /> */}</div>;
};

export default AddressQr;
