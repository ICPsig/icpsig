import React from 'react';
interface Props {
    className?: string;
    label?: string;
    fromBalance?: string;
    onChange: (balance: string) => void;
    placeholder?: string;
    defaultValue?: string;
}
declare const BalanceInput: ({ className, label, onChange, placeholder, defaultValue }: Props) => React.JSX.Element;
export default BalanceInput;
