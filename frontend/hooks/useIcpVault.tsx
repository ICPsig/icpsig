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
      get_all_vault_balance: null,
      add_signatory: null,
      remove_signatory: null,
      approve_transaction: null,
      cancel_transaction: null,
      get_transactions: null,
      create_transactions: null,
      save_2FA_data: null,
      get_2FA_data: null,
      greet: null,
      get_btc_address: null,
      get_eth_address: null,
      sign_eth_transaction: null,
      get_subAccount: null,
      update_btc_to_ckBtc: null,
      retrieve_btc_from_ckBtc: null,
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
      console.log(data);
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

  const get_all_vault_balance = async () => {
    try {
      const data = await icpVaultBackend.get_all_vault_balace();
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
      console.log("error from get_transaction", error);
      return { data: null, error };
    }
  };

  const create_transactions = async (
    vault: string,
    to: string,
    amount: bigint,
    currencyType = "ICP",
    receiverPrincipal?: string,
  ) => {
    try {
      const data = await icpVaultBackend.create_transactions(
        vault,
        to,
        amount,
        currencyType,
        receiverPrincipal || "2vxsx-fae",
      );
      return { data, error: null };
    } catch (error) {
      console.log("error from create_transactions", error);
      return { data: null, error };
    }
  };

  const save_2FA_data = async (
    base32_secret: string,
    url: string,
    enabled: boolean,
    verify: boolean,
    tfaToken: string = "",
  ) => {
    try {
      const data = await icpVaultBackend.save_2FA_data(
        base32_secret,
        url,
        enabled,
        verify,
        tfaToken,
      );
      return { data, error: null };
    } catch (error) {
      console.log("error from create_transactions", error);
      return { data: null, error };
    }
  };

  const get_2FA_data = async () => {
    try {
      const data = await icpVaultBackend.get_2FA_data();
      return { data, error: null };
    } catch (error) {
      console.log("error from create_transactions", error);
      return { data: null, error };
    }
  };

  const get_btc_address = async (vault: string) => {
    try {
      const data = await icpVaultBackend.get_btc_address(vault);
      return { data, error: null };
    } catch (error) {
      console.log("error from create_transactions", error);
      return { data: null, error };
    }
  };
  const get_eth_address = async (vault: string) => {
    try {
      const data: any = await icpVaultBackend.get_eth_address_from_vault(vault);
      return { data: data?.Ok?.address, error: null };
    } catch (error) {
      console.log("error from create_transactions", error);
      return { data: null, error };
    }
  };

  const update_btc_to_ckBtc = async (vault: string) => {
    try {
      const data: any = await icpVaultBackend.update_btc_to_ckBtc(vault);
      return { data: data, error: null };
    } catch (error) {
      console.log("error from create_transactions", error);
      return { data: null, error };
    }
  };

  const retrieve_btc_from_ckBtc = async (
    vault: string,
    address: string,
    amount: bigint,
  ) => {
    try {
      const data: any = await icpVaultBackend.retrive_btc_from_ckBtc(
        vault,
        address,
        amount,
      );
      return { data, error: null };
    } catch (error) {
      console.log("error from create_transactions", error);
      return { data: null, error };
    }
  };

  const get_subAccount = async (vault: string) => {
    try {
      const data: any = await icpVaultBackend.get_subaccount(vault);
      console.log(data);
      return { data, error: null };
    } catch (error) {
      console.log("error from create_transactions", error);
      return { data: null, error };
    }
  };

  const sign_eth_transaction = async (transaction: {
    to: string;
    gas: bigint;
    value: bigint;
    max_priority_fee_per_gas: bigint;
    data: [string];
    max_fee_per_gas: bigint;
    chain_id: bigint;
    nonce: bigint;
    vault: string;
  }) => {
    try {
      console.log("enter", transaction);
      const data = await icpVaultBackend.sign(
        { ...transaction, data: transaction.data || [""] },
        transaction.vault,
      );

      console.log(data);

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
    get_all_vault_balance,
    add_signatory,
    remove_signatory,
    approve_transaction,
    cancel_transaction,
    get_transactions,
    create_transactions,
    save_2FA_data,
    get_2FA_data,
    get_btc_address,
    get_eth_address,
    greet,
    sign_eth_transaction,
    get_subAccount,
    update_btc_to_ckBtc,
    retrieve_btc_from_ckBtc,
  };
}
