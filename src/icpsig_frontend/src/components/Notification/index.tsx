// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import classNames from 'classnames';
import dayjs from 'dayjs';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import noNotification from 'src/assets/icons/no-notification.svg';
import { useGlobalUserDetailsContext } from 'src/context/UserDetailsContext';
import { firebaseFunctionsHeader } from 'src/global/firebaseFunctionsHeader';
import { FIREBASE_FUNCTIONS_URL } from 'src/global/firebaseFunctionsUrl';
import { INotification } from 'src/types';
import { NotificationIcon } from 'src/ui-components/CustomIcons';
import Loader from 'src/ui-components/Loader';

import NotificationCard from './NotificationCard';

export enum ENotificationStatus {
	READ = 'READ',
	UNREAD = 'UNREAD'
}

const Notification = () => {
	const { address, setUserDetailsContextState } = useGlobalUserDetailsContext();

	const [loading, setLoading] = useState(true);
	const [notifications, setNotifications] = useState<INotification[]>([]);
	const [isVisible, toggleVisibility] = useState(false);
	const isMouseEnter = useRef(false);
	const unreadNotificationAvailable = !notifications.length ? undefined : notifications.filter(({ created_at }) => (dayjs().isAfter(created_at) ? false : true));

	const getNotifications = useCallback(async () => {
		if (!address) return;

		setLoading(true);
		const getNotificationsRes = await fetch(`${FIREBASE_FUNCTIONS_URL}/getNotificationsEth`, {
			method: 'POST'
		});

		const { data, error } = await getNotificationsRes.json();
		if (error) {
			console.log('Error in Fetching notifications: ', error);
		}
		if (data) {
			setNotifications(data as INotification[]);
		}
		setLoading(false);
	}, [address]);

	const markAllRead = useCallback(async () => {
		const newNotifiedTill = new Date();
		localStorage.setItem('notifiedTill', newNotifiedTill.toISOString());
		setUserDetailsContextState((prevState: any) => {
			return {
				...prevState,
				notifiedTill: newNotifiedTill
			};
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (!address) return;
		getNotifications();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [address]);

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
				onClick={() => {
					isVisible ? toggleVisibility(false) : toggleVisibility(true);
				}}
				className='flex items-center justify-center outline-none border-none text-white bg-highlight rounded-lg p-2.5 shadow-none text-sm'
			>
				<NotificationIcon />
			</button>

			<div
				className={classNames(
					'absolute scale-90 top-[30px] -right-40 bg-bg-main rounded-xl border border-primary py-[13.5px] z-10 min-w-[344px] sm:min-w-[400px] max-h-[460px] px-1',
					{
						'opacity-0 h-0 pointer-events-none hidden': !isVisible,
						'opacity-100 h-auto': isVisible
					}
				)}
				onMouseEnter={() => {
					isMouseEnter.current = true;
				}}
				onMouseLeave={() => {
					isMouseEnter.current = false;
				}}
			>
				<div className='flex gap-x-5 items-center justify-between mb-1 px-3'>
					<h3 className='text-white font-bold text-lg'>Notifications</h3>
					{!!unreadNotificationAvailable?.length && (
						<button
							onClick={() => markAllRead()}
							className='outline-none border-none shadow-none py-[6px[ px-[10px] text-sm flex items-center justify-center h-[25px] rounded-md text-failure bg-failure bg-opacity-10'
						>
							Mark all as read
						</button>
					)}
				</div>
				<div className='overflow-y-auto px-3 pt-0 max-h-[375px] '>
					<div>
						{loading ? (
							<Loader size='large' />
						) : notifications.length > 0 ? (
							<section>
								<div className='flex flex-col gap-y-[10px] mt-2'>
									{notifications.map((notification, index) => {
										return (
											<NotificationCard
												key={index}
												{...notification}
											/>
										);
									})}
								</div>
							</section>
						) : (
							<section className='flex flex-col items-center'>
								<div className='mt-10'>
									<img
										src={noNotification}
										className='w-10 h-10'
										alt='No notification icon'
									/>
								</div>
								<p className='text-white text-base font-medium mt-10'>No new notifications</p>
							</section>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Notification;
