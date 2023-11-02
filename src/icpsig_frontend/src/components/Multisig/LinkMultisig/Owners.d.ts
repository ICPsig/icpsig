import React from 'react';
interface ISignatory {
    name: string;
    address: string;
}
interface Props {
    signatories: ISignatory[];
    setSignatoriesWithName: React.Dispatch<React.SetStateAction<ISignatory[]>>;
    signatoriesArray: ISignatory[];
    setSignatoriesArray: React.Dispatch<React.SetStateAction<ISignatory[]>>;
    threshold: number;
    setThreshold: React.Dispatch<React.SetStateAction<number>>;
    multisigThreshold?: number;
}
declare const Owners: ({ signatories, multisigThreshold, threshold, setThreshold, setSignatoriesWithName, signatoriesArray, setSignatoriesArray }: Props) => React.JSX.Element;
export default Owners;
