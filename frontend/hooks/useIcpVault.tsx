import { VaultAgentContext } from "@frontend/context/IcpVaultAgentProvider";
import React, { useContext } from "react";

export default function useIcpVault() {
  const { icpVaultBackend } = useContext(VaultAgentContext);
  
  if (!icpVaultBackend) {
    return {
      add_address_to_address_book: null,
      get_address_book: null,
      create_vault: null,
      get_multisig_balance: null,
      get_all_vault_by_principle: null,
      add_signatory: null,
      remove_signatory: null,
      approve_transaction: null,
      cancel_transaction: null,
      get_transactions: null,
      create_transactions: null,
      greet: null,
    };
  }

  const greet = async () => {
    try {
      const data = await icpVaultBackend.greet();
      return { data, error: null };
    } catch (error) {
      console.log("error from greet", error);
      return { data: null, error };
    }
  };

  const add_address_to_address_book = async (
    addressToAdd: string,
    name: string,
    telegram: string,
    email: string,
    discord: string,
    roles: string,
  ) => {
    try {
      console.log(addressToAdd, name, telegram, email, discord, roles);
      const data = await icpVaultBackend.add_address_to_address_book(
        addressToAdd,
        name,
        telegram || "",
        email || "",
        discord || "",
        roles || "",
      );
      return { data, error: null };
    } catch (error) {
      console.log("error from add_address_to_address_book", error);
      return { data: null, error };
    }
  };

  const get_address_book = async (address: string) => {
    try {
      const data = await icpVaultBackend.get_address_book(address);
      return { data, error: null };
    } catch (error) {
      console.log("error from get_address_book", error);
      return { data: null, error };
    }
  };

  const create_vault = async (
    name: string,
    signatories: [string],
    threshold: bigint,
  ) => {
    try {
      const data = await icpVaultBackend.create_vault(
        name,
        signatories,
        threshold,
      );
      return { data, error: null };
    } catch (error) {
      console.log("error from create_vault", error);
      return { data: null, error };
    }
  };

  const get_multisig_balance = async (vault: string) => {
    try {
      const data = await icpVaultBackend.get_multisig_balance(vault);
      return { data, error: null };
    } catch (error) {
      console.log("error from get_multisig_balance", error);
      return { data: null, error };
    }
  };

  const get_all_vault_by_principle = async () => {
    try {
      const data = await icpVaultBackend.get_all_vault_by_principle();
      return { data, error: null };
    } catch (error) {
      console.log("error from get_all_vault_by_principle", error);
      return { data: null, error };
    }
  };

  const add_signatory = async (
    vault: string,
    signatoryToAdd: string,
    threshold: bigint,
  ) => {
    try {
      const data = await icpVaultBackend.add_signatory(
        vault,
        signatoryToAdd,
        threshold,
      );
      return { data, error: null };
    } catch (error) {
      console.log("error from add_signatory", error);
      return { data: null, error };
    }
  };

  const remove_signatory = async (
    vault: string,
    signatoryToAdd: any,
    threshold: bigint,
  ) => {
    try {
      const data = await icpVaultBackend.remove_signatory(
        vault,
        signatoryToAdd,
        threshold,
      );
      return { data, error: null };
    } catch (error) {
      console.log("error from remove_signatory", error);
      return { data: null, error };
    }
  };

  const approve_transaction = async (vault: string, txId: string) => {
    try {
      const data = await icpVaultBackend.approve_transaction(vault, txId);
      return { data, error: null };
    } catch (error) {
      console.log("error from approve_transaction", error);
      return { data: null, error };
    }
  };

  const cancel_transaction = async (
    vault: string,
    txId: string,
    owner: string,
  ) => {
    try {
      const data = await icpVaultBackend.cancel_transaction(vault, txId);
      return { data, error: null };
    } catch (error) {
      console.log("error from cancel_transaction", error);
      return { data: null, error };
    }
  };

  const get_transactions = async (vault: string) => {
    try {
      const data = await icpVaultBackend.get_transactions(vault);
      return { data, error: null };
    } catch (error) {
      console.log("error from cancel_transaction", error);
      return { data: null, error };
    }
  };

  const create_transactions = async (
    vault: string,
    to: string,
    amount: bigint,
  ) => {
    try {
      const data = await icpVaultBackend.create_transactions(vault, to, amount);
      return { data, error: null };
    } catch (error) {
      console.log("error from create_transactions", error);
      return { data: null, error };
    }
  };

  return {
    add_address_to_address_book,
    get_address_book,
    create_vault,
    get_multisig_balance,
    get_all_vault_by_principle,
    add_signatory,
    remove_signatory,
    approve_transaction,
    cancel_transaction,
    get_transactions,
    create_transactions,
    greet,
  };
}
