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
  setActiveMultisigData: (): void => {
    throw new Error("setUserDetailsContextState function must be overridden");
  },
  setIdentityBackend: (): void => {},
  setUserDetailsContextState: (): void => {
    throw new Error("setUserDetailsContextState function must be overridden");
  },
  updateCurrentMultisigData: (): void => {
    throw new Error("updateCurrentMultisigData function must be overridden");
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
};

export const UserDetailsContext: React.Context<UserDetailsContextType> =
  createContext(initialUserDetailsContext);

export function useGlobalUserDetailsContext() {
  return useContext(UserDetailsContext);
}

export const UserDetailsProvider = ({
  children,
}: React.PropsWithChildren<{}>) => {
  const { account: address } = useGlobalIdentityContext();
  const [userDetailsContextState, setUserDetailsContextState] = useState(
    initialUserDetailsContext,
  );
  const [activeMultisigData, setActiveMultisigData] = useState<any>({});
  const navigate = useNavigate();
  const [identityBackend, setIdentityBackend] =
    useState<IdentityBackendService>({} as any);

  const [loading, setLoading] = useState(false);

  const connectAddress = useCallback(
    async (address?: string, signature?: string) => {
      setLoading(true);
      const identityService = new IdentityBackendService();
      setIdentityBackend(identityService);
      const { data: userData, error: connectAddressErr } =
        await identityService.getAllMultisigByOwner(address || "");
      const { data: addressBook } = await identityService.getAddressBookOwner(
        address || "",
      );
      if (!connectAddressErr && userData) {
        setUserDetailsContextState((prevState) => {
          return {
            ...prevState,
            activeMultisig:
              localStorage.getItem("active_multisig") ||
              userData?.[0]?.address ||
              "",
            addressBook: addressBook?.addressBook || [],
            createdAt: userData?.created_at,
            multisigAddresses: userData || [],
            multisigSettings: {},
            notification_preferences:
              userData?.notification_preferences ||
              initialUserDetailsContext.notification_preferences,
            transactionFields: initialUserDetailsContext.transactionFields,
          };
        });
      } else {
        localStorage.clear();
        setUserDetailsContextState(initialUserDetailsContext);
        navigate("/");
      }
      setLoading(false);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [],
  );

  const updateCurrentMultisigData = useCallback(async () => {
    if (
      !userDetailsContextState.activeMultisig ||
      !userDetailsContextState.multisigAddresses
    ) {
      return;
    }
    try {
      let activeData: any = {};
      const multisig = userDetailsContextState.multisigAddresses.find(
        (multi) => multi.address === userDetailsContextState.activeMultisig,
      );
      if (!multisig) {
        return;
      }
      if (!userDetailsContextState.activeMultisig) {
        return;
      }
      const { data: multiData } =
        await identityBackend.getMultisigInfoByAddress(
          userDetailsContextState.activeMultisig,
        );
      setActiveMultisigData(multiData?.[0]);
    } catch (err) {
      console.log("err from update current multisig data", err);
    }
  }, [
    identityBackend,
    userDetailsContextState.activeMultisig,
    userDetailsContextState.address,
    userDetailsContextState.multisigAddresses,
  ]);

  useEffect(() => {
    if (!address) {
      return;
    }
    if (localStorage.getItem("address") !== address) {
      localStorage.removeItem("signature");
      localStorage.removeItem("address");
      setUserDetailsContextState(initialUserDetailsContext);
      navigate("/", { replace: true });
      setLoading(false);
      return;
    }
    if (localStorage.getItem("signature")) {
      connectAddress();
    } else {
      localStorage.clear();
      setLoading(false);
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  useEffect(() => {
    if (!userDetailsContextState.activeMultisig) {
      return;
    }
    updateCurrentMultisigData();
  }, [updateCurrentMultisigData, userDetailsContextState.activeMultisig]);
  console.log(activeMultisigData);
  return (
    <UserDetailsContext.Provider
      value={{
        activeMultisigData,
        connectAddress,
        loading,
        ...userDetailsContextState,
        address,
        identityBackend,
        setActiveMultisigData,
        setIdentityBackend,
        setLoading,
        setUserDetailsContextState,
        updateCurrentMultisigData,
      }}
    >
      <>{children}</>
    </UserDetailsContext.Provider>
  );
};
