import { FC } from 'react';
interface IAccountSelectionFormProps {
    accounts: Array<any>;
    address: string;
    onAccountChange: (address: string) => void;
    title: string;
    disabled?: boolean;
}
declare const AccountSelectionForm: FC<IAccountSelectionFormProps>;
export default AccountSelectionForm;
