// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { PlusCircleOutlined } from '@ant-design/icons';
import { Button, Dropdown, Form, Input, MenuProps, Modal } from 'antd';
import { Checkbox } from 'antd';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useGlobalUserDetailsContext } from 'src/context/UserDetailsContext';
import { firebaseFunctionsHeader } from 'src/global/firebaseFunctionsHeader';
import { FIREBASE_FUNCTIONS_URL } from 'src/global/firebaseFunctionsUrl';
import { CHANNEL, IUserNotificationTriggerPreferences, NotificationStatus, Triggers } from 'src/types';
import {
	BellIcon,
	CheckOutlined,
	CircleArrowDownIcon,
	DiscordIcon,
	ElementIcon,
	MailIcon,
	OutlineCloseIcon,
	SlackIcon,
	TelegramIcon,
	WarningCircleIcon
} from 'src/ui-components/CustomIcons';
import PrimaryButton from 'src/ui-components/PrimaryButton';
import queueNotification from 'src/ui-components/QueueNotification';

import DiscordInfoModal from './DiscordInfoModal';
import SlackInfoModal from './SlackInfoModal';
import TelegramInfoModal from './TelegramInfoModal';

const Notifications = () => {
	const { pathname } = useLocation();
	const { notification_preferences, address, setUserDetailsContextState } = useGlobalUserDetailsContext();
	const [notifyAfter, setNotifyAfter] = useState<number>(8);
	const emailPreference = notification_preferences?.channelPreferences?.[CHANNEL.EMAIL];
	const [email, setEmail] = useState<string>(emailPreference?.handle || '');
	const [emailValid, setEmailValid] = useState<boolean>(true);
	const [newTxn, setNewTxn] = useState<boolean>(false);
	const [txnExecuted, setTxnExecuted] = useState<boolean>(false);
	const [cancelledTxn, setCancelledTxn] = useState<boolean>(false);
	const [scheduleTxn, setScheduleTxn] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const [verificationLoading, setVerificationLoading] = useState<boolean>(false);

	const [openTelegramModal, setOpenTelegramModal] = useState<boolean>(false);
	const [openDiscordModal, setOpenDiscordModal] = useState<boolean>(false);
	const [openSlackModal, setOpenSlackModal] = useState<boolean>(false);
	const [remindersFromOthers, setReminderFromOthers] = useState<boolean>(false);
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [resendEmail, setResendEmail] = useState<boolean>(emailPreference?.verified || false);
	const [enabledUpdate, setEnableUpdate] = useState<boolean>(false);

	const emailVerificationRegex =
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	useEffect(() => {
		if (email) {
			const validEmail = emailVerificationRegex.test(email);
			if (validEmail) {
				setEmailValid(true);
			} else {
				setEmailValid(false);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [email]);

	useEffect(() => {
		const triggerPreferences = notification_preferences?.triggerPreferences;
		if (triggerPreferences) {
			setNewTxn(triggerPreferences[Triggers.INIT_MULTISIG_TRANSFER]?.enabled || false);
			setTxnExecuted(triggerPreferences[Triggers.EXECUTED_TRANSACTION]?.enabled || false);
			setCancelledTxn(triggerPreferences[Triggers.CANCELLED_TRANSACTION]?.enabled || false);
			setScheduleTxn(triggerPreferences[Triggers.SCHEDULED_APPROVAL_REMINDER]?.enabled || false);
			setNotifyAfter(triggerPreferences[Triggers.SCHEDULED_APPROVAL_REMINDER]?.hoursToRemindIn || 8);
			setReminderFromOthers(triggerPreferences[Triggers.APPROVAL_REMINDER]?.enabled || false);
		}
	}, [notification_preferences]);

	const handleEnableUpdate = useCallback(() => {
		if (notification_preferences) {
			const triggerPreferences = notification_preferences.triggerPreferences;
			const oldPreferences = {
				cancelledTxn: triggerPreferences[Triggers.CANCELLED_TRANSACTION]?.enabled || false,
				newTxn: triggerPreferences[Triggers.INIT_MULTISIG_TRANSFER]?.enabled || false,
				notifyAfter: triggerPreferences[Triggers.SCHEDULED_APPROVAL_REMINDER]?.hoursToRemindIn || 8,
				remindersFromOthers: triggerPreferences[Triggers.APPROVAL_REMINDER]?.enabled || false,
				scheduleTxn: triggerPreferences[Triggers.SCHEDULED_APPROVAL_REMINDER]?.enabled || false,
				txnExecuted: triggerPreferences[Triggers.EXECUTED_TRANSACTION]?.enabled || false
			};
			const newPreferences = {
				cancelledTxn,
				newTxn,
				notifyAfter,
				remindersFromOthers,
				scheduleTxn,
				txnExecuted
			};
			if (JSON.stringify(oldPreferences) === JSON.stringify(newPreferences)) {
				setEnableUpdate(false);
				return;
			}
			setEnableUpdate(true);
		}
	}, [cancelledTxn, newTxn, notification_preferences, notifyAfter, remindersFromOthers, scheduleTxn, txnExecuted]);

	useEffect(() => {
		handleEnableUpdate();
	}, [handleEnableUpdate]);

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const notifyAfterHours: MenuProps['items'] = [8, 12, 24, 48].map((hr) => {
		return {
			key: hr,
			label: <span className={`${hr === notifyAfter ? 'text-primary' : 'text-white'}`}>{hr === 1 ? `${hr} hr` : `${hr} hrs`}</span>
		};
	});

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const onNotifyHoursChange: MenuProps['onClick'] = ({ key }) => {
		setNotifyAfter(Number(key));
	};

	const updateNotificationPreferences = async () => {
		try {
			const userAddress = localStorage.getItem('address');
			const signature = localStorage.getItem('signature');

			if (!userAddress || !signature) {
				console.log('ERROR');
				return;
			} else {
				const newPreferences: {
					[index: string]: IUserNotificationTriggerPreferences;
				} = {
					[Triggers.CANCELLED_TRANSACTION]: {
						enabled: cancelledTxn,
						name: Triggers.CANCELLED_TRANSACTION
					},
					[Triggers.EXECUTED_TRANSACTION]: {
						enabled: txnExecuted,
						name: Triggers.EXECUTED_TRANSACTION
					},
					[Triggers.EDIT_MULTISIG_USERS_EXECUTED]: {
						enabled: txnExecuted,
						name: Triggers.EDIT_MULTISIG_USERS_EXECUTED
					},
					[Triggers.EXECUTED_PROXY]: {
						enabled: txnExecuted,
						name: Triggers.EXECUTED_PROXY
					},
					[Triggers.INIT_MULTISIG_TRANSFER]: {
						enabled: newTxn,
						name: Triggers.INIT_MULTISIG_TRANSFER
					},
					[Triggers.CREATED_PROXY]: {
						enabled: newTxn,
						name: Triggers.CREATED_PROXY
					},
					[Triggers.SCHEDULED_APPROVAL_REMINDER]: {
						enabled: scheduleTxn,
						hoursToRemindIn: notifyAfter,
						name: Triggers.SCHEDULED_APPROVAL_REMINDER
					},
					[Triggers.EDIT_MULTISIG_USERS_START]: {
						enabled: newTxn,
						name: Triggers.EDIT_MULTISIG_USERS_START
					},
					[Triggers.APPROVAL_REMINDER]: {
						enabled: remindersFromOthers,
						name: Triggers.APPROVAL_REMINDER
					}
				};
				setLoading(true);

				const updateNotificationTriggerRes = await fetch(`${FIREBASE_FUNCTIONS_URL}/updateNotificationTriggerPreferencesEth`, {
					body: JSON.stringify({
						triggerPreferences: newPreferences
					}),

					method: 'POST'
				});

				const { data: updateNotificationTriggerData, error: updateNotificationTriggerError } = (await updateNotificationTriggerRes.json()) as {
					data: string;
					error: string;
				};

				if (updateNotificationTriggerError) {
					queueNotification({
						header: 'Failed!',
						message: updateNotificationTriggerError,
						status: NotificationStatus.ERROR
					});
					setLoading(false);
					return;
				}

				if (updateNotificationTriggerData) {
					queueNotification({
						header: 'Success!',
						message: 'Your Notification Preferences has been Updated.',
						status: NotificationStatus.SUCCESS
					});
					setUserDetailsContextState((prev: any) => ({
						...prev,
						notification_preferences: {
							...prev.notification_preferences,
							triggerPreferences: newPreferences
						}
					}));
					setLoading(false);
				}
			}
		} catch (error) {
			console.log('ERROR', error);
			queueNotification({
				header: 'Failed!',
				message: 'Error in Updating Notification Preferences.',
				status: NotificationStatus.ERROR
			});
			setLoading(false);
		}
	};

	const verifyEmail = async () => {
		try {
			const userAddress = localStorage.getItem('address');
			const signature = localStorage.getItem('signature');

			if (!userAddress || !signature) {
				console.log('ERROR');
				return;
			} else {
				setVerificationLoading(true);

				const verifyTokenRes = await fetch(`${FIREBASE_FUNCTIONS_URL}/notify`, {
					body: JSON.stringify({
						args: {
							address,
							email
						},
						trigger: 'verifyEmail'
					}),

					method: 'POST'
				});

				const { data: verifyEmailUpdate, error: verifyTokenError } = (await verifyTokenRes.json()) as { data: string; error: string };

				if (verifyTokenError) {
					queueNotification({
						header: 'Failed!',
						message: verifyTokenError,
						status: NotificationStatus.ERROR
					});
					setVerificationLoading(false);
					return;
				}

				if (verifyEmailUpdate) {
					queueNotification({
						header: 'Success!',
						message: 'Verification Email Sent.',
						status: NotificationStatus.SUCCESS
					});
					setResendEmail(false);
					setTimeout(() => setResendEmail(true), 60000);
					setUserDetailsContextState((prev: any) => ({
						...prev,
						notification_preferences: {
							...prev.notification_preferences,
							channelPreferences: {
								...prev.notification_preferences.channelPreferences,
								[CHANNEL.EMAIL]: {
									enabled: false,
									handle: email,
									name: CHANNEL.EMAIL,
									verified: false
								}
							}
						}
					}));
					setVerificationLoading(false);
				}
			}
		} catch (error) {
			console.log('ERROR', error);
			queueNotification({
				header: 'Failed!',
				message: 'Error in Sending Verification Email.',
				status: NotificationStatus.ERROR
			});
			setVerificationLoading(false);
		}
	};

	const getVerifyToken = async (channel: CHANNEL) => {
		try {
			const userAddress = localStorage.getItem('address');
			const signature = localStorage.getItem('signature');

			if (!userAddress || !signature) {
				console.log('ERROR');
				return;
			} else {
				const verifyTokenRes = await fetch(`${FIREBASE_FUNCTIONS_URL}/getChannelVerifyToken`, {
					body: JSON.stringify({
						channel
					}),

					method: 'POST'
				});

				const { data: verifyToken, error: verifyTokenError } = (await verifyTokenRes.json()) as { data: string; error: string };

				if (verifyTokenError) {
					queueNotification({
						header: 'Failed!',
						message: verifyTokenError,
						status: NotificationStatus.ERROR
					});
					return;
				}

				if (verifyToken) {
					return verifyToken;
				}
			}
		} catch (error) {
			console.log('ERROR', error);
			queueNotification({
				header: 'Failed!',
				message: 'Error in generating token.',
				status: NotificationStatus.ERROR
			});
		}
	};

	const TelegramModal: FC = () => {
		return (
			<>
				<Button
					onClick={() => setOpenTelegramModal(true)}
					icon={<PlusCircleOutlined className='text-primary' />}
					className='flex items-center outline-none border-none bg-transparant text-primary'
				>
					ADD THE POLKASAFE BOT
				</Button>
				<Modal
					centered
					footer={false}
					closeIcon={
						<button
							className='outline-none border-none bg-highlight w-6 h-6 rounded-full flex items-center justify-center'
							onClick={() => setOpenTelegramModal(false)}
						>
							<OutlineCloseIcon className='text-primary w-2 h-2' />
						</button>
					}
					title={
						<h3 className='text-white mb-8 text-lg font-semibold flex items-center gap-x-2'>
							<TelegramIcon className='text-text_secondary' /> How to add Telegram Bot
						</h3>
					}
					open={openTelegramModal}
					className={' w-auto md:min-w-[500px] max-w-[600px] scale-90'}
				>
					<TelegramInfoModal getVerifyToken={getVerifyToken} />
				</Modal>
			</>
		);
	};

	const DiscordModal: FC = () => {
		return (
			<>
				<Button
					onClick={() => setOpenDiscordModal(true)}
					icon={<PlusCircleOutlined className='text-primary' />}
					className='flex items-center outline-none border-none bg-transparant text-primary'
				>
					ADD THE POLKASAFE BOT
				</Button>
				<Modal
					centered
					footer={false}
					closeIcon={
						<button
							className='outline-none border-none bg-highlight w-6 h-6 rounded-full flex items-center justify-center'
							onClick={() => setOpenDiscordModal(false)}
						>
							<OutlineCloseIcon className='text-primary w-2 h-2' />
						</button>
					}
					title={
						<h3 className='text-white mb-8 text-lg font-semibold flex items-center gap-x-2'>
							<DiscordIcon className='text-text_secondary' /> How to add Discord Bot
						</h3>
					}
					open={openDiscordModal}
					className={' w-auto md:min-w-[500px] max-w-[600px] scale-90'}
				>
					<DiscordInfoModal getVerifyToken={getVerifyToken} />
				</Modal>
			</>
		);
	};

	const SlackModal: FC = () => {
		return (
			<>
				<Button
					onClick={() => setOpenSlackModal(true)}
					icon={<PlusCircleOutlined className='text-primary' />}
					className='flex items-center outline-none border-none bg-transparant text-primary'
				>
					ADD THE POLKASAFE BOT
				</Button>
				<Modal
					centered
					footer={false}
					closeIcon={
						<button
							className='outline-none border-none bg-highlight w-6 h-6 rounded-full flex items-center justify-center'
							onClick={() => setOpenSlackModal(false)}
						>
							<OutlineCloseIcon className='text-primary w-2 h-2' />
						</button>
					}
					title={
						<h3 className='text-white mb-8 text-lg font-semibold flex items-center gap-x-2'>
							<SlackIcon className='text-text_secondary' /> How to add Slack Bot
						</h3>
					}
					open={openSlackModal}
					className={' w-auto md:min-w-[500px] max-w-[600px] scale-90'}
				>
					<SlackInfoModal getVerifyToken={getVerifyToken} />
				</Modal>
			</>
		);
	};

	return (
		<div className={`flex flex-col gap-y-4 ${pathname === '/notification-settings' && 'scale-[80%] h-[125%] w-[125%] origin-top-left'}`}>
			<div className='grid grid-cols-10 bg-bg-main rounded-lg p-4 text-text_secondary'>
				<div className='col-span-3'>
					<span className='flex items-center gap-x-2'>
						<BellIcon /> General
					</span>
				</div>
				<div className='col-span-7'>
					<p className='mb-4'>Configure the notifications you want Polkasafe to send in your linked channels</p>
					<div className='flex flex-col gap-y-3'>
						<div className='flex'>
							<Checkbox
								disabled={loading}
								className='text-white m-0 [&>span>span]:border-primary'
								checked={newTxn}
								onChange={(e) => setNewTxn(e.target.checked)}
							>
								New Transaction needs to be signed
							</Checkbox>
						</div>
						<div className='flex'>
							<Checkbox
								disabled={loading}
								className='text-white m-0 [&>span>span]:border-primary'
								checked={txnExecuted}
								onChange={(e) => setTxnExecuted(e.target.checked)}
							>
								Transaction has been signed and executed
							</Checkbox>
						</div>
						<div className='flex'>
							<Checkbox
								disabled={loading}
								className='text-white m-0 [&>span>span]:border-primary'
								checked={cancelledTxn}
								onChange={(e) => setCancelledTxn(e.target.checked)}
							>
								Transaction has been cancelled
							</Checkbox>
						</div>
						<div className='flex'>
							<Checkbox
								disabled={loading}
								className='text-white m-0 [&>span>span]:border-primary'
								checked={remindersFromOthers}
								onChange={(e) => setReminderFromOthers(e.target.checked)}
							>
								Get reminders from other signatories
							</Checkbox>
						</div>
						<div className='flex items-center gap-x-3'>
							<Checkbox
								disabled={loading}
								className='text-white m-0 [&>span>span]:border-primary'
								checked={scheduleTxn}
								onChange={(e) => setScheduleTxn(e.target.checked)}
							>
								For Pending Transactions remind signers every:
							</Checkbox>
							<Dropdown
								disabled={!scheduleTxn || loading}
								className='text-white'
								trigger={['click']}
								menu={{ items: notifyAfterHours, onClick: onNotifyHoursChange }}
							>
								<button
									className={`'flex items-center gap-x-2 border ${
										!scheduleTxn || loading ? 'border-text_secondary' : 'border-primary'
									} rounded-md px-3 py-1 text-sm leading-[15px] text-text_secondary`}
								>
									{`${notifyAfter} ${notifyAfter === 1 ? 'hr' : 'hrs'}`}{' '}
									<CircleArrowDownIcon className={`hidden md:inline-flex text-base ${!scheduleTxn || loading ? 'text-text_secondary' : 'text-primary'}`} />
								</button>
							</Dropdown>
						</div>
					</div>
					<div className='mt-4'>
						<Button
							loading={loading}
							disabled={!enabledUpdate}
							onClick={updateNotificationPreferences}
							className={`text-white bg-primary rounded-lg cursor-pointer ${!enabledUpdate && 'opacity-50 cursor-default'}`}
						>
							Save
						</Button>
					</div>
				</div>
			</div>
			<div className='grid grid-cols-10 bg-bg-main rounded-lg p-4'>
				<div className='col-span-3'>
					<span className='flex items-center gap-x-2 text-text_secondary'>
						<MailIcon /> Email Notifications
					</span>
				</div>
				<Form className='col-span-5 flex items-start gap-x-3'>
					<Form.Item
						name='email'
						rules={[{ required: true }]}
						help={!emailValid && 'Please enter a valid email'}
						className='border-0 outline-0 my-0 p-0 w-full'
						validateStatus={!emailValid ? 'error' : 'success'}
					>
						<Input
							id='email'
							defaultValue={emailPreference?.handle || ''}
							onChange={(a) => setEmail(a.target.value)}
							placeholder={'Enter email'}
							className='w-full text-sm font-normal leading-[15px] border-0 outline-0 p-2 placeholder:text-[#505050] bg-bg-secondary rounded-lg text-white'
						/>
					</Form.Item>
					<PrimaryButton
						loading={verificationLoading}
						className={`text-white ${!email || !emailValid || emailPreference?.handle === email ? 'bg-highlight' : 'bg-primary'}`}
						onClick={verifyEmail}
						disabled={!email || !emailValid || emailPreference?.handle === email}
					>
						<p className='font-normal text-sm'>Verify</p>
					</PrimaryButton>
				</Form>
				{emailPreference?.verified && emailPreference?.handle === email && (
					<div className='flex items-center col-span-2 ml-5 gap-x-2'>
						<CheckOutlined className='text-success' />
						<div className='text-white'>Email Verified!</div>
					</div>
				)}
				<div className='col-span-3'></div>
				{emailPreference?.handle === email && !emailPreference?.verified && (
					<section className='mt-2 col-span-5 text-[13px] w-full text-waiting bg-waiting bg-opacity-10 p-2.5 rounded-lg font-normal flex items-center gap-x-2'>
						<WarningCircleIcon />
						<p>An email has been sent to your email address. Click on the sent link to Verify your email address</p>
					</section>
				)}
			</div>
			<div className='grid grid-cols-10 bg-bg-main rounded-lg p-4 text-white'>
				<div className='col-span-3'>
					<span className='flex items-center gap-x-2 text-text_secondary'>
						<TelegramIcon /> Telegram Notifications
					</span>
				</div>
				<div className='col-span-5 flex items-center'>
					<TelegramModal />
					<span>to a Telegram chat to get Telegram notifications</span>
				</div>
			</div>
			<div className='grid grid-cols-10 bg-bg-main rounded-lg p-4 text-white'>
				<div className='col-span-3'>
					<span className='flex items-center gap-x-2 text-text_secondary'>
						<DiscordIcon /> Discord Notifications
					</span>
				</div>
				<div className='col-span-5 flex items-center'>
					<DiscordModal />
					<span>to a Discord channel to get Discord notifications</span>
				</div>
			</div>
			<div className='grid grid-cols-10 bg-bg-main rounded-lg p-4 text-white'>
				<div className='col-span-3'>
					<span className='flex items-center gap-x-2 text-text_secondary'>
						<SlackIcon /> Slack Notifications
					</span>
				</div>
				<div className='col-span-5 flex items-center'>
					<SlackModal />
					<span>to a Slack channel to get Slack notifications</span>
				</div>
			</div>
			<div className='grid grid-cols-10 bg-bg-main rounded-lg p-4 text-white'>
				<div className='col-span-3'>
					<span className='flex items-center gap-x-2 text-text_secondary'>
						<ElementIcon /> Element Notifications
					</span>
				</div>
				<div className='col-span-5 text-primary'>COMING SOON...</div>
			</div>
		</div>
	);
};

export default Notifications;
