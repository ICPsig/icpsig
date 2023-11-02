import React from 'react';
export declare const OLD_MAINNET_IDENTITY_SERVICE_URL = "https://identity.ic0.app";
export interface IdentityContextType {
    login: any;
    principle: any;
    account: any;
    setAccounts: any;
    setPrinciple: any;
    identity: any;
}
export declare const IdentityContext: React.Context<IdentityContextType>;
export interface IdentityContextProviderProps {
    children?: React.ReactElement;
}
export declare function IdentityContextProvider({ children }: IdentityContextProviderProps): React.ReactElement;
export declare function useGlobalIdentityContext(): IdentityContextType;
