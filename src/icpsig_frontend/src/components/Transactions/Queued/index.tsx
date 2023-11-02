// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import dayjs from 'dayjs';
import React, { FC, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useGlobalUserDetailsContext } from 'src/context/UserDetailsContext';
import Loader from 'src/ui-components/Loader';
import { convertSafePendingData } from 'src/utils/convertSafeData/convertSafePending';
import updateDB, { UpdateDB } from 'src/utils/updateDB';

import NoTransactionsQueued from './NoTransactionsQueued';
import Transaction from './Transaction';

const LocalizedFormat = require('dayjs/plugin/localizedFormat');
dayjs.extend(LocalizedFormat);

interface IQueued {
	loading: boolean;
	setLoading: React.Dispatch<React.SetStateAction<boolean>>;
	refetch: boolean;
	setRefetch: React.Dispatch<React.SetStateAction<boolean>>;
}

const Queued: FC<IQueued> = ({ loading, setLoading, refetch, setRefetch }) => {
	const { address, activeMultisig, setActiveMultisigData, activeMultisigData, identityBackend } = useGlobalUserDetailsContext();
	const [queuedTransactions, setQueuedTransactions] = useState<any[]>([]);
	const location = useLocation();

	const handleAfterApprove = (callHash: string) => {
		const payload = queuedTransactions.map((queue) => {
			return queue.txHash === callHash ? { ...queue, signatures: [...(queue.signatures || []), { address }] } : queue;
		});
		setQueuedTransactions(payload);
	};

	const handleAfterExecute = (callHash?: string) => {
		console.log(callHash);
		//   let transaction: any = null;
		//   const payload = queuedTransactions.filter((queue) => {
		//     if (queue.txHash === callHash) {
		//       transaction = queue;
		//     }
		//     return queue.txHash !== callHash;
		//   });
		//   if (transaction) {
		//     if (transaction.type === "addOwnerWithThreshold") {
		//       const [addedAddress, newThreshold] = transaction.dataDecoded.parameters;
		//       const payload = {
		//         ...activeMultisigData,
		//         signatories: [...activeMultisigData.signatories, addedAddress.value],
		//         threshold: newThreshold.value,
		//       };
		//       setActiveMultisigData(payload);
		//       // updateDB(
		//       //   UpdateDB.Update_Multisig,
		//       //   { multisig: payload },
		//       //   address,
		//       //   network
		//       // );
		//     } else if (transaction.type === "removeOwner") {
		//       const [, removedAddress, newThreshold] =
		//         transaction.dataDecoded.parameters;
		//       const payload = {
		//         ...activeMultisigData,
		//         signatories: activeMultisigData.signatories.filter(
		//           (address: string) => address !== removedAddress.value
		//         ),
		//         threshold: newThreshold.value,
		//       };
		//       setActiveMultisigData(payload);
		//       updateDB(
		//         UpdateDB.Update_Multisig,
		//         { multisig: payload },
		//         address,
		//         network
		//       );
		//     }
		//   }
		//   setQueuedTransactions(payload);
	};

	useEffect(() => {
		const hash = location.hash.slice(1);
		const elem = document.getElementById(hash);
		if (elem) {
			elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	}, [location.hash, queuedTransactions]);

	useEffect(() => {
		if (!identityBackend) {
			console.log('retiring');
			return;
		}
		(async () => {
			setLoading(true);
			try {
				const identityData = await identityBackend.getPendingTx(activeMultisig);
				const convertedData = identityData.data;
				setQueuedTransactions(convertedData);
				// if (convertedData?.length > 0)
				// updateDB(
				//   UpdateDB.Update_Pending_Transaction,
				//   { transactions: convertedData },
				//   address,
				//   network
				// );
			} catch (error) {
				console.log(error);
			} finally {
				setLoading(false);
			}
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [activeMultisig, address, refetch, identityBackend]);

	if (loading) {
		return (
			<div className='h-full'>
				<Loader size='large' />
			</div>
		);
	}

	return (
		<>
			{queuedTransactions && queuedTransactions.length > 0 ? (
				<div className='flex flex-col gap-y-[10px]'>
					{queuedTransactions
						.sort((a, b) => (dayjs(a.created_at).isBefore(dayjs(b.created_at)) ? 1 : -1))
						.map((transaction) => {
							return (
								<section
									id={transaction.txHash}
									key={transaction.txHash}
								>
									<Transaction
										value={transaction.amount_token}
										setQueuedTransactions={setQueuedTransactions}
										date={transaction.created_at}
										status={transaction.isExecuted ? 'Executed' : 'Approval'}
										approvals={transaction.signatures ? transaction.signatures.map((item: any) => item.address) : []}
										threshold={activeMultisigData?.threshold || 0}
										callData={transaction.data}
										callHash={transaction.txHash}
										note={transaction.note || ''}
										refetch={() => setRefetch((prev) => !prev)}
										onAfterApprove={handleAfterApprove}
										onAfterExecute={handleAfterExecute}
										numberOfTransactions={queuedTransactions.length || 0}
										notifications={transaction?.notifications || {}}
										txType={transaction.type}
										recipientAddress={transaction.to}
									/>
								</section>
							);
						})}
				</div>
			) : (
				<NoTransactionsQueued />
			)}
		</>
	);
};

export default Queued;
