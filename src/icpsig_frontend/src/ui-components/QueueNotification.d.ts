import type { NotificationPlacement } from 'antd/es/notification/interface';
import { ReactNode } from 'react';
import { NotificationStatus } from 'src/types';
interface Props {
    header: ReactNode;
    message?: ReactNode;
    durationInSeconds?: number;
    status: NotificationStatus;
    placement?: NotificationPlacement;
    className?: string;
    closeIcon?: ReactNode;
}
declare const queueNotification: ({ header, closeIcon, className, message, durationInSeconds, status, placement }: Props) => void;
export default queueNotification;
