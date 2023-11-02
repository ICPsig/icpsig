import React from 'react';
import { ISharedAddressBooks } from '../types';
export interface IActiveMultisigContext extends ISharedAddressBooks {
    setActiveMultisigContextState: React.Dispatch<React.SetStateAction<IActiveMultisigContext>>;
}
export declare const initialActiveMultisigContext: IActiveMultisigContext;
export declare const ActiveMultisigContext: React.Context<IActiveMultisigContext>;
export declare function useActiveMultisigContext(): IActiveMultisigContext;
export declare const ActiveMultisigProvider: ({ children }: React.PropsWithChildren<{}>) => React.JSX.Element;
