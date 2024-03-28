import React, { createContext, useEffect, useState } from "react";
import { useGlobalIdentityContext } from "./IdentityProviderContext";
import { createActor } from "src/declarations/icp_vault";
import { HttpAgent } from "@dfinity/agent";
import { icp_vault } from "../../src/declarations/icp_vault/index";

export const localCanisterId = "be2us-64aaa-aaaaa-qaabq-cai";
export const playgroundCanisterId = "z7chj-7qaaa-aaaab-qacbq-cai";
export const mainCanisterId = "q7xou-7iaaa-aaaak-afoeq-cai";

export const VaultAgentContext = createContext({
  icpVaultBackend: icp_vault,
});

export default function IcpVaultAgentProvider({ children }) {
  const { agent } = useGlobalIdentityContext();
  const [icpVaultBackend, setIcpVaultBackend] = useState(null);

  useEffect(() => {
    if (!agent) {
      return;
    }

    const actor = createActor(mainCanisterId, { agent });
    // const actor = createActor(localCanisterId);
    actor.getCanisterPrincipal().then((res) => console.log(res.toText()));
    setIcpVaultBackend(actor);
  }, [agent]);

  return (
    <VaultAgentContext.Provider value={{ icpVaultBackend }}>
      {children}
    </VaultAgentContext.Provider>
  );
}
