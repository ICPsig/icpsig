import { FC, PropsWithChildren, ReactNode } from 'react';
export interface IModal extends PropsWithChildren {
    isVisible: boolean;
    title: ReactNode;
    CloseBtnNode?: ReactNode;
    switch?: Boolean;
}
interface IModalProps extends IModal {
    toggleVisibility: () => void;
}
declare const Modal: FC<IModalProps>;
export default Modal;
