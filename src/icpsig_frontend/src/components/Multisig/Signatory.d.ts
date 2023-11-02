import React from 'react';
interface ISignatoryProps {
    setSignatories: React.Dispatch<React.SetStateAction<string[]>>;
    signatories: string[];
    filterAddress?: string;
    homepage: boolean;
}
declare const Signatory: ({ filterAddress, setSignatories, signatories, homepage }: ISignatoryProps) => React.JSX.Element;
export default Signatory;
