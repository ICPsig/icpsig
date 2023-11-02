import React from 'react';
interface Props {
    onClick: React.MouseEventHandler<HTMLAnchorElement> & React.MouseEventHandler<HTMLButtonElement>;
    icon: string;
    name: string;
    disabled: boolean;
    className?: string;
}
declare const WalletButton: ({ disabled, onClick, icon, className }: Props) => React.JSX.Element;
export default WalletButton;
