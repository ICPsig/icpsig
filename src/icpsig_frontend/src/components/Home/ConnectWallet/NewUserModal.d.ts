import React from 'react';
interface INewUserModal {
    open: boolean;
    onCancel: () => void;
}
declare const NewUserModal: ({ open, onCancel }: INewUserModal) => React.JSX.Element;
export default NewUserModal;
