import { INotification } from 'src/types';
export default function sendNotificationToAddresses({ addresses, link, message, network, type }: Omit<INotification, 'created_at' | 'id'>): Promise<void>;
