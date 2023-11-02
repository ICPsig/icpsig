import React from 'react';
type Props = {
    address: string;
    onClick: (address: string) => Promise<void>;
    canNotificationSend: boolean;
};
export default function NotifyButton({ address, onClick, canNotificationSend }: Props): React.JSX.Element;
export {};
