import React from 'react';
import { IMultisigAddress } from 'src/types';
interface ISignatory {
    name: string;
    address: string;
}
interface Props {
    signatories: ISignatory[];
    multisigData?: IMultisigAddress;
    multisigName: string;
}
declare const Review: ({ multisigData, signatories, multisigName }: Props) => React.JSX.Element;
export default Review;
