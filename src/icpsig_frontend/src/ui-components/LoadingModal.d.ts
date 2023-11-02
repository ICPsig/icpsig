import React from 'react';
interface ILoadingModal {
    loading: boolean;
    success?: boolean;
    failed?: boolean;
    open: boolean;
    onCancel: () => void;
    message?: string;
}
declare const LoadingModal: ({ loading, success, open, onCancel, message }: ILoadingModal) => React.JSX.Element;
export default LoadingModal;
