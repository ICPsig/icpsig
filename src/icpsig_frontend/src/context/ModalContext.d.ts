import { FC, PropsWithChildren, ReactNode } from 'react';
interface IModalContext {
    toggleVisibility: () => void;
    toggleOnSwitch: () => void;
    openModal: (title: string, children: ReactNode, CloseBtnNode?: ReactNode) => void;
    toggleSwitch: boolean;
    closeModal: () => void;
}
export declare const useModalContext: () => IModalContext;
declare const ModalContextProvider: FC<PropsWithChildren>;
export default ModalContextProvider;
