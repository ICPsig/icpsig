import { FC } from 'react';
interface IModalBtnProps {
    title: string;
    className?: string;
    onClick?: () => void;
    loading?: boolean;
    disabled?: boolean;
}
declare const ModalBtn: FC<IModalBtnProps>;
export default ModalBtn;
