import { useConnect, useWallet } from "@connect2ic/react";
import React from "react";
import { icpsig_backend } from "../../../../../declarations/icpsig_backend";

export const initialUserDetailsContext = {
  activeMultisig: localStorage.getItem("active_multisig") || "",
  address: localStorage.getItem("address") || "",
  addressBook: [],
  createdAt: new Date(),
  multisigAddresses: [],
};

export const UserDetailsContext = React.createContext(
  initialUserDetailsContext
);

export const UserDetailsProvider = ({
  children,
}: React.PropsWithChildren<{}>) => {
  const [userDetailsContextState, setUserDetailsContextState] = React.useState(
    initialUserDetailsContext
  );
  const [loading, setLoading] = React.useState(false);
  const [wallet] = useWallet();

  const { isConnected, principal, activeProvider } = useConnect({
    onConnect: () => {
      handleUserDetail();
    },
    onDisconnect: () => {
      setUserDetailsContextState(initialUserDetailsContext);
    },
  });

  const handleUserDetail = async () => {
    const allMultisig: any = await icpsig_backend.get_all_vault_by_principle();
    console.log(allMultisig);
    setUserDetailsContextState({
      activeMultisig:
        localStorage.getItem("active_multisig") || allMultisig?.[0],
      address: wallet || "",
      addressBook: [],
      createdAt: new Date(),
      multisigAddresses: allMultisig || [],
    });
  };

  return (
    <UserDetailsContext.Provider
      value={{ ...userDetailsContextState, setUserDetailsContextState }}
    >
      {children}
    </UserDetailsContext.Provider>
  );
};
