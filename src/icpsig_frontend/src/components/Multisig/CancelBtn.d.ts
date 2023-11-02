import { FC } from 'react';
interface ICancelBtnProps {
    onClick?: () => void;
    className?: string;
    title?: string;
}
declare const CancelBtn: FC<ICancelBtnProps>;
export default CancelBtn;
