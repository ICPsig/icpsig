// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { HttpAgent, Identity } from "@dfinity/agent";
import { LocalStorage, AuthClient } from "@dfinity/auth-client";
import React, { useContext, useEffect, useState } from "react";

export const OLD_MAINNET_IDENTITY_SERVICE_URL = "https://identity.ic0.app";

const getIdentityProvider = () => {
  // If we are in mainnet in the old domain, we use the old identity provider.
  if (location.host.endsWith(".ic0.app")) {
    return OLD_MAINNET_IDENTITY_SERVICE_URL;
  }

  return OLD_MAINNET_IDENTITY_SERVICE_URL;
};

export type StoredKey = string | CryptoKeyPair;

export interface IdentityContextType {
  login: any;
  logout: any;
  principal: any;
  account: any;
  setAccounts: any;
  setPrincipal: any;
  setAuthClient: any;
  agent: HttpAgent;
  setAgent: any;
  authClient: AuthClient | null;
}

export const IdentityContext: React.Context<IdentityContextType> =
  React.createContext({} as IdentityContextType);

export interface IdentityContextProviderProps {
  children?: React.ReactElement;
}

const noStorageImpl = {
  get(key: string) {
    return Promise.resolve(null);
  },
  set(key: string, value: StoredKey) {
    return Promise.resolve();
  },
  remove(key: string) {
    return Promise.resolve();
  },
};

export function IdentityContextProvider({
  children,
}: IdentityContextProviderProps): React.ReactElement {
  const [principal, setPrincipal] = useState<string>("");
  const [account, setAccounts] = useState<string>("");
  const [authClient, setAuthClient] = useState<AuthClient>(null);
  const [agent, setAgent] = useState<HttpAgent>();

  const handleConnect = async () => {
    await authClient.login({
      identityProvider: getIdentityProvider(),
      maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000),
      onSuccess: () => {
        const identity = authClient.getIdentity();
        const agent = new HttpAgent({ identity: identity });
        setAgent(agent);
      },
    });
  };

  const handleDisconnect = async () => {
    if (!authClient) {
      return;
    }
    await authClient.logout();
    setPrincipal("");
    setAccounts("");
    setAgent(null);
  };

  useEffect(() => {
    const storage = new LocalStorage();
    AuthClient.create({ storage }).then(async (client) => {
      setAuthClient(client);
      const isAuthenticated = await client.isAuthenticated();
      if (isAuthenticated) {
        const identity = client.getIdentity();
        const agent = new HttpAgent({ identity: identity });
        setAgent(agent);
        const principal = identity.getPrincipal().toText();
        const account = identity.getPrincipal().toHex();
        setPrincipal(principal);
        setAccounts(account);
      }
    });
  }, []);

  return (
    <IdentityContext.Provider
      value={{
        authClient,
        login: handleConnect,
        logout: handleDisconnect,
        principal,
        account,
        setAccounts,
        setPrincipal,
        setAuthClient,
        agent,
        setAgent,
      }}
    >
      {children}
    </IdentityContext.Provider>
  );
}

export function useGlobalIdentityContext() {
  return useContext(IdentityContext);
}
