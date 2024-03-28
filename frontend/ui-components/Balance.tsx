// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useEffect, useState } from "react";

import Loader from "./Loader";
import useIcpVault from "@frontend/hooks/useIcpVault";
import convertE8sToNumber from "@frontend/utils/convertE8sToNumber";
import { useGlobalUserDetailsContext } from "@frontend/context/UserDetailsContext";
import { ReloadOutlined } from "@ant-design/icons";

interface Props {
  className?: string;
  address: string;
  onChange?: (balance: string) => void;
  selectedToken?: "ICP" | "ckBTC" | "ckETH";
}

const Balance = ({ address, className, onChange, selectedToken }: Props) => {
  const {
    activeMultisig,
    multisigAddresses,
    balanceLoading,
    handleMultisigBalance,
  } = useGlobalUserDetailsContext();

  const currentMultisig = multisigAddresses?.find(
    (item) => item.address === activeMultisig,
  );

  return (
    <div
      className={`bg-highlight rounded-lg px-[10px] py-[6px] ml-auto font-normal text-xs leading-[13px] flex items-center justify-center ${className} flex justify-between gap-1`}
    >
      <span className="text-primary mr-2">Balance: </span>
      {balanceLoading ? (
        <Loader />
      ) : (
        <span className="text-white">
          {currentMultisig.balance?.[selectedToken] || 0.0}
        </span>
      )}
      {!balanceLoading && (
        <span onClick={handleMultisigBalance}>
          <ReloadOutlined className="text-primary" />
        </span>
      )}
    </div>
  );
};

export default Balance;
