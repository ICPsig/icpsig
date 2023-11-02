import { FC } from 'react';
interface ICancelBtnProps {
    onClick?: () => void;
}
interface ICancelBtnProps {
    className?: string;
    onClick?: () => void;
    title?: string;
    loading?: boolean;
}
declare const CancelBtn: FC<ICancelBtnProps>;
export default CancelBtn;
