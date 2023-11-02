import React, { ReactNode } from 'react';
interface Props {
    className?: string;
    children: ReactNode;
    onClick: () => void;
}
declare const SecondaryButton: ({ className, children, onClick }: Props) => React.JSX.Element;
export default SecondaryButton;
