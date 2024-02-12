// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
// create_vault
// transfer
// add_signatory
// remove_signatory
// approve_transaction
// reject_transaction
import { icpsig_backend } from "./icp_backend";
import axios from "axios";
import { icp_vault } from "../../src/declarations/icp_vault/index";
// get_address_book
// add_address_to_address_book
// create_vault
// get_multisig_balance
// get_all_vault_by_principle
// add_signatory
// remove_signatory
// approve_transaction
// cancel_transaction
// get_transactions
// create_transactions

function create_vault() {
  const characters = "0123456789abcdefghijklmnopqrstuvwxyz";
  let pattern = "";

  for (let i = 0; i < 64; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    pattern += characters[randomIndex];
  }

  return pattern;
}
export class IdentityBackendService {
  add_address_to_address_book = async (owner: string, addressToAdd: string) => {
    try {
      const data = await icp_vault.add_address_to_address_book(
        owner,
        addressToAdd,
      );
      return { data, error: null };
    } catch (error) {
      console.log("error from add_address_to_address_book", error);
      return { data: null, error };
    }
  };

  get_address_book = async (owner: string) => {
    try {
      const data = await icp_vault.get_address_book(owner);
      return { data, error: null };
    } catch (error) {
      console.log("error from get_address_book", error);
      return { data: null, error };
    }
  };

  create_vault = async (
    signatories: [string],
    threshold: bigint,
    owner: string,
  ) => {
    try {
      const data = await icp_vault.create_vault(signatories, threshold, owner);
      return { data, error: null };
    } catch (error) {
      console.log("error from create_vault", error);
      return { data: null, error };
    }
  };

  get_multisig_balance = async (vault: string) => {
    try {
      const data = await icp_vault.get_multisig_balance(vault);
      return { data, error: null };
    } catch (error) {
      console.log("error from get_multisig_balance", error);
      return { data: null, error };
    }
  };

  get_all_vault_by_principle = async (owner: string) => {
    try {
      const data = await icp_vault.get_all_vault_by_principle(owner);
      return { data, error: null };
    } catch (error) {
      console.log("error from get_all_vault_by_principle", error);
      return { data: null, error };
    }
  };

  add_signatory = async (
    vault: string,
    signatoryToAdd: string,
    threshold: bigint,
  ) => {
    try {
      const data = await icp_vault.add_signatory(
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

  remove_signatory = async (
    vault: string,
    signatoryToAdd: any,
    threshold: bigint,
  ) => {
    try {
      const data = await icp_vault.remove_signatory(
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

  approve_transaction = async (vault: string, txId: string, owner: string) => {
    try {
      const data = await icp_vault.approve_transaction(vault, txId, owner);
      return { data, error: null };
    } catch (error) {
      console.log("error from approve_transaction", error);
      return { data: null, error };
    }
  };

  cancel_transaction = async (vault: string, txId: string, owner: string) => {
    try {
      const data = await icp_vault.cancel_transaction(vault, txId, owner);
      return { data, error: null };
    } catch (error) {
      console.log("error from cancel_transaction", error);
      return { data: null, error };
    }
  };

  get_transactions = async (vault: string, owner: string) => {
    try {
      const data = await icp_vault.get_transactions(vault, owner);
      return { data, error: null };
    } catch (error) {
      console.log("error from cancel_transaction", error);
      return { data: null, error };
    }
  };

  create_transactions = async (
    vault: string,
    owner: string,
    to: string,
    amount: bigint,
  ) => {
    try {
      const data = await icp_vault.create_transactions(
        vault,
        owner,
        to,
        amount,
      );
      return { data, error: null };
    } catch (error) {
      console.log("error from create_transactions", error);
      return { data: null, error };
    }
  };

  createMultisig = async (
    owners: [string],
    threshold: number,
    name: string,
    owner: string,
  ) => {
    try {
      // console.log(owners, BigInt(threshold), owner);
      // const { data: address } = await this.create_vault(
      //   owners,
      //   BigInt(threshold),
      //   owner,
      // );
      const icpsigAccountConfig = {
        address: create_vault(),
        signatories: owners,
        name,
        threshold,
        balance: 0.0,
      };
      const { data } = await axios.post(
        `${icpsig_backend}/multisig`,
        icpsigAccountConfig,
      );
      return { data, error: null };
    } catch (error) {
      console.log("error from createMultisig", error);
      return { data: null, error };
    }
  };

  getAllMultisigByOwner = async (
    ownerAddress: string,
  ): Promise<{ data: any; error: string | null }> => {
    try {
      const { data } = await axios.get(
        `${icpsig_backend}/multisig?q=${ownerAddress}`,
      );
      return { data, error: null };
    } catch (error) {
      console.log("error from getAllMultisigByOwner", error);
      return { data: null, error };
    }
  };

  getAddressBookOwner = async (
    ownerAddress: string,
  ): Promise<{ data: any; error: string | null }> => {
    try {
      const { data } = await axios.get(
        `${icpsig_backend}/addressBook?q=${ownerAddress}`,
      );
      return { data: data?.[0] || [], error: null };
    } catch (error) {
      console.log("error from getAllMultisigByOwner", error);
      return { data: null, error };
    }
  };

  addAddressToAddressBook = async (
    ownerAddress: string,
    addressData: any,
  ): Promise<{ data: any; error: string | null }> => {
    try {
      const { data } = await axios.get(
        `${icpsig_backend}/addressBook?q=${ownerAddress}`,
      );
      console.log(data);
      if (data.length === 0) {
        const { data: updatedData } = await axios.post(
          `${icpsig_backend}/addressBook`,
          { address: ownerAddress, addressBook: [addressData] },
        );
        return { data: updatedData, error: null };
      }
      const payload = data?.[0];
      payload.addressBook.push(addressData);
      const { data: updatedData } = await axios.patch(
        `${icpsig_backend}/addressBook/${data?.[0].id}`,
        payload,
      );
      return { data: updatedData, error: null };
    } catch (error) {
      const { data: updatedData } = await axios.post(
        `${icpsig_backend}/addressBook`,
        { address: ownerAddress, addressBook: [addressData] },
      );
      return { data: updatedData, error: null };
    }
  };

  removeAddressToAddressBook = async (
    ownerAddress: string,
    removedAddress: string,
  ): Promise<{ data: any; error: string | null }> => {
    try {
      const { data } = await axios.get(
        `${icpsig_backend}/addressBook?q=${ownerAddress}`,
      );
      const payload = data.filter((a: string) => a !== removedAddress);
      const { data: updatedData } = await axios.patch(
        `${icpsig_backend}/addressBook/${data.id}`,
        payload,
      );
      return { data: updatedData, error: null };
    } catch (error) {
      console.log("error from getAllMultisigByOwner", error);
      return { data: null, error };
    }
  };

  getMultisigInfoByAddress = async (
    multisigAddress: string,
  ): Promise<{ data: any; error: string | null }> => {
    try {
      const { data } = await axios.get(
        `${icpsig_backend}/multisig?q=${multisigAddress}`,
      );
      return { data, error: null };
    } catch (error) {
      console.log("error from getMultisigInfoByAddress", error);
      return { data: null, error };
    }
  };

  approveTransaction = async (
    signatory: string,
    mutisig: string,
    transaction: any,
  ): Promise<{ data: any; error: string | null }> => {
    try {
      const { data } = await axios.get(
        `${icpsig_backend}/transaction?id=${transaction}`,
      );
      const { data: multiisgInfo } = await this.getMultisigInfoByAddress(
        mutisig,
      );
      if (data.approval && multiisgInfo.threshold - 1 > data.approval.length) {
        const payload = { ...data, approval: [...data.approval, signatory] };
        const { data: updatedData } = await axios.patch(
          `${icpsig_backend}/transaction?id=${transaction}`,
          payload,
        );
        return { data: updatedData, error: null };
      } else {
        const payload = {
          ...data,
          approval: [...data.approval, signatory],
          type: "complete",
        };
        const { data: updatedData } = await axios.patch(
          `${icpsig_backend}/transaction?id=${transaction}`,
          payload,
        );
        return { data: updatedData, error: null };
      }
    } catch (error) {
      console.log("error from confirmTxByHash", error);
      return { data: null, error };
    }
  };

  cancelTransaction = async (
    signatory: string,
    mutisig: string,
    transaction: any,
  ): Promise<{ data: any; error: string | null }> => {
    try {
      const { data } = await axios.get(
        `${icpsig_backend}/transaction?id=${transaction}`,
      );
      if (data.signatory === signatory) {
        const payload = { ...data, type: "canceled" };
        const { data: updatedData } = await axios.patch(
          `${icpsig_backend}/transaction?id=${transaction}`,
          payload,
        );
        return { data: updatedData, error: null };
      }
      return { data: null, error: "Not Authenticated" };
    } catch (error) {
      console.log("error from confirmTxByHash", error);
      return { data: null, error };
    }
  };

  createTransferTx = async (
    from: string,
    to: string[],
    value: string[],
    signatory: string,
  ): Promise<{ data: any; error: string | null }> => {
    try {
      const val = Number(value?.[0]) || 0;
      const { data: multisig } = await this.getMultisigInfoByAddress(from);
      const multi = multisig?.[0];
      axios.patch(`${icpsig_backend}/multisig/${multi?.id}`, {
        balance: Number(multi.balance) - val,
      });
    } catch (e) {
    } finally {
      try {
        const { data } = await axios.post(`${icpsig_backend}/transaction`, {
          from,
          to,
          value,
          signatory,
          category: "transfer",
          approval: [signatory],
          data: null,
          type: "pending",
        });
        return { data, error: null };
      } catch (error) {
        console.log(error);
        // console.log('error from createMultisigTx', error);
        return { data: null, error };
      }
    }
  };

  createAddOwnerTx = async (
    multisig: string,
    newSignatory: string,
    threshold: number,
    signatory: string,
  ): Promise<{ data: any; error: string | null }> => {
    try {
      const { data } = await axios.post(`${icpsig_backend}/transaction`, {
        from: multisig,
        to: null,
        value: null,
        signatory,
        category: "addOwner",
        data: {
          newSignatory,
          threshold,
        },
        approval: [signatory],
        type: "pending",
      });
      return { data, error: null };
    } catch (error) {
      console.log(error);
      return { data: null, error };
    }
  };

  createRemoveOwnerTx = async (
    multisig: string,
    oldSignatory: string,
    threshold: any,
    signatory: string,
  ): Promise<{ data: any; error: string | null }> => {
    try {
      const { data } = await axios.post(`${icpsig_backend}/transaction`, {
        from: multisig,
        to: null,
        value: null,
        signatory,
        category: "removeOwner",
        data: {
          oldSignatory,
          threshold,
        },
        approval: [signatory],
        type: "pending",
      });
      return { data, error: null };
    } catch (error) {
      console.log(error);
      return { data: null, error };
    }
  };

  getPendingTx = async (
    multisigAddress: string,
  ): Promise<{ data: any; error: string | null }> => {
    try {
      const { data } = await axios.get(
        `${icpsig_backend}/transaction?type=pending&from=${multisigAddress}`,
      );
      return { data, error: null };
    } catch (error) {
      console.log(error);
      return { data: null, error };
    }
  };

  getTransactionHistory = async (
    multisigAddress: string,
  ): Promise<{ data: any; error: string | null }> => {
    try {
      const { data } = await axios.get(
        `${icpsig_backend}/transaction?type=complete&from=${multisigAddress}`,
      );
      return { data, error: null };
    } catch (error) {
      console.log(error);
      return { data: null, error };
    }
  };
}
