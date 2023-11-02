import { SizeType } from 'antd/es/config-provider/SizeContext';
import React, { ReactNode } from 'react';
interface Props {
    className?: string;
    children: ReactNode;
    onClick?: () => void;
    size?: SizeType;
    loading?: boolean;
    disabled?: boolean;
    icon?: ReactNode;
    secondary?: boolean;
}
declare const PrimaryButton: ({ className, children, onClick, size, loading, disabled, icon, secondary }: Props) => React.JSX.Element;
export default PrimaryButton;
