import React from 'react';
import { ISharedAddressBookRecord } from '../../types';
declare const ExportAdress: ({ records }: {
    records: {
        [address: string]: ISharedAddressBookRecord;
    };
}) => React.JSX.Element;
export default ExportAdress;
