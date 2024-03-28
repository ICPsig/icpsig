import { Identity } from "@dfinity/agent";
import { LedgerCanister } from "@dfinity/ledger-icp";
import { IcrcLedgerCanister } from "@dfinity/ledger-icrc";
import { useGlobalIdentityContext } from "@frontend/context/IdentityProviderContext";
import { ICP_LEDGER_CANISTER_ID } from "./icp.constants";
import { Principal } from "@dfinity/principal";
import {
  CKBTC_LEDGER_CANISTER_ID,
  CKETH_LEDGER_CANISTER_ID,
} from "./icrc.constants";

export const useICPCanister = () => {
  const { agent } = useGlobalIdentityContext();

  return LedgerCanister.create({
    agent,
    canisterId: Principal.fromText(ICP_LEDGER_CANISTER_ID),
  });
};

export const useCKBTCCanister = () => {
  const { agent } = useGlobalIdentityContext();

  return IcrcLedgerCanister.create({
    agent,
    canisterId: Principal.fromText(CKBTC_LEDGER_CANISTER_ID),
  });
};

export const useCKETHCanister = () => {
  const { agent } = useGlobalIdentityContext();

  return IcrcLedgerCanister.create({
    agent,
    canisterId: Principal.fromText(CKETH_LEDGER_CANISTER_ID),
  });
};
