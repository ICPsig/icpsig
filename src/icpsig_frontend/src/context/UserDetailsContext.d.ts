import React from 'react';
import { UserDetailsContextType } from '../types';
export declare const UserDetailsContext: React.Context<UserDetailsContextType>;
export declare function useGlobalUserDetailsContext(): UserDetailsContextType;
export declare const UserDetailsProvider: ({ children }: React.PropsWithChildren<{}>) => React.JSX.Element;
