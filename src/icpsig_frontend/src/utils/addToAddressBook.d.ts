import { IAddressBookItem } from 'src/types';
export declare const addToAddressBook: ({ address, name, addressBook, network }: {
    address: string;
    name?: string | undefined;
    addressBook: IAddressBookItem[];
    network: string;
}) => Promise<IAddressBookItem[] | undefined>;
