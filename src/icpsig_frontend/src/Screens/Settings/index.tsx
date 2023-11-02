// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import ManageMultisig from 'src/components/Settings/ManageMultisig';
import Notifications from 'src/components/Settings/Notifications';
import TransactionFields from 'src/components/Settings/TransactionFields';
import { useGlobalUserDetailsContext } from 'src/context/UserDetailsContext';
import Loader from 'src/ui-components/Loader';

enum ETab {
	SIGNATORIES,
	NOTIFICATIONS,
	TRANSACTIONS
}

const Settings = () => {
	const [tab, setTab] = useState(ETab.SIGNATORIES);
	const [loading, setLoading] = useState<boolean>(true);
	const { activeMultisigData } = useGlobalUserDetailsContext();

	useEffect(() => {
		if (Object.keys(activeMultisigData).length > 0) {
			setLoading(false);
		}
	}, [activeMultisigData]);

	if (loading) {
		return <Loader size='large' />;
	}
	return (
		<div className='scale-[80%] h-[125%] w-[125%] origin-top-left'>
			<div className='flex items-center mb-5'>
				<button
					onClick={() => setTab(ETab.SIGNATORIES)}
					className={classNames('rounded-lg p-3 text-sm leading-[15px] w-[110px] text-white', {
						'text-primary bg-highlight': tab === ETab.SIGNATORIES
					})}
				>
					{/* <QueueIcon /> */}
					Signatories
				</button>
				<button
					onClick={() => setTab(ETab.NOTIFICATIONS)}
					className={classNames('rounded-lg p-3 text-sm leading-[15px] w-[110px] text-white', {
						'text-primary bg-highlight': tab === ETab.NOTIFICATIONS
					})}
				>
					{/* <HistoryIcon/> */}
					Notifications
				</button>
				<button
					onClick={() => setTab(ETab.TRANSACTIONS)}
					className={classNames('rounded-lg p-3 text-sm leading-[15px] text-white', {
						'text-primary bg-highlight': tab === ETab.TRANSACTIONS
					})}
				>
					Transaction Fields
				</button>
			</div>
			{tab === ETab.SIGNATORIES ? <ManageMultisig /> : tab === ETab.NOTIFICATIONS ? <Notifications /> : <TransactionFields />}
		</div>
	);
};

export default Settings;
