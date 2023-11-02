import React from 'react';
import { IAddress } from './AddressTable';
declare const DragDrop: ({ setAddresses }: {
    setAddresses: React.Dispatch<React.SetStateAction<IAddress[]>>;
}) => React.JSX.Element;
export default DragDrop;
