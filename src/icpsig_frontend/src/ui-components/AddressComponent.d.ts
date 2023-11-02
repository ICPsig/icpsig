import React from 'react';
interface IAddressComponent {
    address: string;
    iconSize?: number;
    withBadge?: boolean;
    name?: string;
    onlyAddress?: boolean;
}
declare const AddressComponent: ({ address, name, withBadge, iconSize, onlyAddress }: IAddressComponent) => React.JSX.Element;
export default AddressComponent;
