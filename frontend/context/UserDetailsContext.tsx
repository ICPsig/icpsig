// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
/* eslint-disable sort-keys */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { DEFAULT_ADDRESS_NAME } from "@frontend/global/default";
import { firebaseFunctionsHeader } from "@frontend/global/firebaseFunctionsHeader";
import { FIREBASE_FUNCTIONS_URL } from "@frontend/global/firebaseFunctionsUrl";
import { IdentityBackendService } from "@frontend/services";
import { EFieldType, IUser, UserDetailsContextType } from "@frontend/types";
import { convertSafeMultisig } from "@frontend/utils/convertSafeData/convertSafeMultisig";

import { useGlobalIdentityContext } from "./IdentityProviderContext";
import useIcpVault from "@frontend/hooks/useIcpVault";
import { mainCanisterId, VaultAgentContext } from "./IcpVaultAgentProvider";
import convertE8sToNumber from "@frontend/utils/convertE8sToNumber";
import {
  useCKBTCCanister,
  useCKETHCanister,
  useICPCanister,
} from "@frontend/utils/ledgers";
import { Principal } from "@dfinity/principal";

const initialUserDetailsContext: UserDetailsContextType = {
  activeMultisig: localStorage.getItem("active_multisig") || "",
  address: localStorage.getItem("address") || "",
  addressBook: [],
  createdAt: new Date(),
  identityBackend: {} as any,
  loggedInWallet: localStorage.getItem("logged_in_wallet") || "",
  multisigAddresses: [],
  multisigSettings: {},
  notification_preferences: {},
  setIdentityBackend: (): void => {},
  setUserDetailsContextState: (): void => {
    throw new Error("setUserDetailsContextState function must be overridden");
  },
  transactionFields: {
    ["expense_reimbursement"]: {
      fieldDesc: "",
      fieldName: "Expense Reimbursement",
      subfields: {
        ["department"]: {
          subfieldName: "Department",
          subfieldType: EFieldType.SINGLE_SELECT,
          required: true,
          dropdownOptions: [
            {
              optionName: "Engineering",
            },
            {
              optionName: "Finance",
            },
            {
              optionName: "Marketing",
            },
            {
              optionName: "Operations",
            },
            {
              optionName: "Legal",
            },
            {
              optionName: "Content",
            },
            {
              optionName: "Other",
            },
          ],
        },
        ["project"]: {
          subfieldName: "Project",
          subfieldType: EFieldType.TEXT,
          required: true,
        },
        ["description"]: {
          subfieldName: "Description",
          subfieldType: EFieldType.TEXT,
          required: true,
        },
        ["expense_type"]: {
          subfieldName: "Expense Type",
          subfieldType: EFieldType.SINGLE_SELECT,
          required: true,
          dropdownOptions: [
            {
              optionName: "Legal",
            },
            {
              optionName: "Gas Fees",
            },
            {
              optionName: "Events",
            },
            {
              optionName: "Other",
            },
            {
              optionName: "Software",
            },
          ],
        },
        ["invoice"]: {
          subfieldName: "Invoice",
          subfieldType: EFieldType.TEXT,
          required: true,
        },
      },
    },
    ["contributor_compensation"]: {
      fieldName: "Contributor Compensation",
      fieldDesc: "",
      subfields: {
        ["department"]: {
          subfieldName: "Department",
          subfieldType: EFieldType.SINGLE_SELECT,
          required: true,
          dropdownOptions: [
            {
              optionName: "Engineering",
            },
            {
              optionName: "Finance",
            },
            {
              optionName: "Marketing",
            },
            {
              optionName: "Operations",
            },
            {
              optionName: "Legal",
            },
            {
              optionName: "Content",
            },
            {
              optionName: "Other",
            },
          ],
        },
        ["project"]: {
          subfieldName: "Project",
          subfieldType: EFieldType.TEXT,
          required: true,
        },
        ["description"]: {
          subfieldName: "Description",
          subfieldType: EFieldType.TEXT,
          required: true,
        },
        ["compensation_type"]: {
          subfieldName: "Compensation Type",
          subfieldType: EFieldType.SINGLE_SELECT,
          required: true,
          dropdownOptions: [
            {
              optionName: "Bounty",
            },
            {
              optionName: "Contractor",
            },
            {
              optionName: "Full-Time",
            },
            {
              optionName: "Part-Time",
            },
          ],
        },
        ["invoice"]: {
          subfieldName: "Invoice",
          subfieldType: EFieldType.TEXT,
          required: true,
        },
      },
    },
    ["grants"]: {
      fieldName: "Grants",
      fieldDesc: "",
      subfields: {
        ["department"]: {
          subfieldName: "Department",
          subfieldType: EFieldType.SINGLE_SELECT,
          required: true,
          dropdownOptions: [
            {
              optionName: "Engineering",
            },
            {
              optionName: "Finance",
            },
            {
              optionName: "Marketing",
            },
            {
              optionName: "Operations",
            },
            {
              optionName: "Legal",
            },
            {
              optionName: "Content",
            },
            {
              optionName: "Other",
            },
          ],
        },
        ["project"]: {
          subfieldName: "Project",
          subfieldType: EFieldType.TEXT,
          required: true,
        },
        ["description"]: {
          subfieldName: "Description",
          subfieldType: EFieldType.TEXT,
          required: true,
        },
      },
    },
    ["airdrop"]: {
      fieldName: "Airdrop",
      fieldDesc: "",
      subfields: {
        ["department"]: {
          subfieldName: "Department",
          subfieldType: EFieldType.SINGLE_SELECT,
          required: true,
          dropdownOptions: [
            {
              optionName: "Engineering",
            },
            {
              optionName: "Finance",
            },
            {
              optionName: "Marketing",
            },
            {
              optionName: "Operations",
            },
            {
              optionName: "Legal",
            },
            {
              optionName: "Content",
            },
            {
              optionName: "Other",
            },
          ],
        },
        ["project"]: {
          subfieldName: "Project",
          subfieldType: EFieldType.TEXT,
          required: true,
        },
        ["description"]: {
          subfieldName: "Description",
          subfieldType: EFieldType.TEXT,
          required: true,
        },
      },
    },
    ["none"]: {
      fieldDesc: "N/A",
      fieldName: "Other",
      subfields: {},
    },
  },
  balanceLoading: false,
};

export const UserDetailsContext: React.Context<UserDetailsContextType> =
  createContext(initialUserDetailsContext);

export function useGlobalUserDetailsContext() {
  return useContext(UserDetailsContext);
}

export const UserDetailsProvider = ({
  children,
}: React.PropsWithChildren<{}>) => {
  const { principal: address } = useGlobalIdentityContext();
  const [userDetailsContextState, setUserDetailsContextState] = useState(
    initialUserDetailsContext,
  );
  const navigate = useNavigate();
  const [identityBackend, setIdentityBackend] =
    useState<IdentityBackendService>({} as any);

  const icpLedger = useICPCanister();
  const ckBtcLedger = useCKBTCCanister();
  const ckEthLedger = useCKETHCanister();

  const { icpVaultBackend } = useContext(VaultAgentContext);
  const {
    get_all_vault_by_principle,
    get_address_book,
    get_2FA_data,
    get_multisig_balance,
    get_subAccount,
  } = useIcpVault();

  const [loading, setLoading] = useState(false);

  const [balanceLoading, setBalanceLoading] = useState(false);

  const connectAddress = async () => {
    if (!get_all_vault_by_principle || !get_address_book || !address) {
      return;
    }
    setLoading(true);
    const { data: userData, error: connectAddressErr } =
      await get_all_vault_by_principle();

    const { data: two_factor_auth, error } = await get_2FA_data();
    console.log(two_factor_auth);

    console.log("all vault", userData);
    const { data: addressBook } = await get_address_book(address);

    if (!connectAddressErr && userData) {
      const allMultisigData = userData?.map((a) => {
        const multisig = a.multisig?.[0];
        const data = {
          name: multisig?.name,
          threshold: Number(multisig?.threshold),
          signatories: multisig?.signers?.flat().map((a) => a.toText?.()),
        };
        return { address: a.address, ...data };
      });
      setUserDetailsContextState((prevState) => {
        return {
          ...prevState,
          activeMultisig: userData?.[0]?.address || "",
          addressBook: addressBook || [],
          createdAt: userData?.created_at,
          multisigAddresses: allMultisigData || [],
          multisigSettings: {},
          notification_preferences:
            userData?.notification_preferences ||
            initialUserDetailsContext.notification_preferences,
          transactionFields: initialUserDetailsContext.transactionFields,
          tfa_token: two_factor_auth,
        };
      });
    } else {
      localStorage.clear();
      setUserDetailsContextState(initialUserDetailsContext);
      navigate("/");
    }
    setLoading(false);
  };

  const handleMultisigBalance = async () => {
    if (!get_multisig_balance || !userDetailsContextState.activeMultisig) {
      return;
    }
    setBalanceLoading(true);
    const { data: subAccount, error } = await get_subAccount(
      userDetailsContextState.activeMultisig,
    );

    if (error) {
      console.log(error, "subaccount");
      setBalanceLoading(false);
      return;
    }
    const balance = [
      icpLedger.accountBalance({
        accountIdentifier: userDetailsContextState.activeMultisig,
      }),
      ckBtcLedger.balance({
        owner: Principal.fromText(mainCanisterId),
        subaccount: subAccount || null,
      }),
      ckEthLedger.balance({
        owner: Principal.fromText(mainCanisterId),
        subaccount: subAccount || null,
      }),
    ];
    console.log(new Date().toLocaleString());
    const [icp, ckbtc, cketh] = (await Promise.all(balance)).values();
    console.log({ icp, ckbtc, cketh });
    console.log(new Date().toLocaleString());
    // const icp = await icpLedger.accountBalance({
    //   accountIdentifier: userDetailsContextState.activeMultisig,
    // });
    // const ckbtc = await ckBtcLedger.balance({
    //   owner: Principal.fromText(mainCanisterId),
    //   subaccount: subAccount || null,
    // });
    // const cketh = await ckEthLedger.balance({
    //   owner: Principal.fromText(mainCanisterId),
    //   subaccount: subAccount || null,
    // });
    // const { data: balanceData, error: balanceErr } = await get_multisig_balance(
    //   userDetailsContextState.activeMultisig,
    // );

    const multisigPayload = userDetailsContextState.multisigAddresses.map(
      (multisig) =>
        multisig.address == userDetailsContextState.activeMultisig
          ? {
              ...multisig,
              balance: {
                ICP: (Number(icp || 0) / 100000000).toFixed(4),
                ckBTC: (Number(ckbtc || 0) / 100000000).toFixed(4),
                ckETH: (Number(cketh || 0) / 100000000).toFixed(4),
              },
            }
          : multisig,
    );
    console.log(multisigPayload);
    setUserDetailsContextState((prevState) => {
      return {
        ...prevState,
        multisigAddresses: multisigPayload || [],
      };
    });
    setBalanceLoading(false);
  };

  useEffect(() => {
    if (!address || !icpVaultBackend) {
      return;
    }
    connectAddress();
  }, [address, icpVaultBackend]);

  useEffect(() => {
    if (!address || !userDetailsContextState.activeMultisig) {
      return;
    }
    if (userDetailsContextState.multisigAddresses.length > 0) {
      handleMultisigBalance();
    }
  }, [userDetailsContextState.activeMultisig]);

  return (
    <UserDetailsContext.Provider
      value={{
        connectAddress,
        loading,
        ...userDetailsContextState,
        address,
        identityBackend,
        setIdentityBackend,
        setLoading,
        setUserDetailsContextState,
        balanceLoading,
        handleMultisigBalance,
      }}
    >
      <>{children}</>
    </UserDetailsContext.Provider>
  );
};
