import React from 'react';
interface Props {
    className?: string;
    address: string;
    onChange?: (balance: string) => void;
}
declare const Balance: ({ address, className }: Props) => React.JSX.Element;
export default Balance;
