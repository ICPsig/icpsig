// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useEffect, useState } from "react";

import Loader from "./Loader";
import useIcpVault from "@frontend/hooks/useIcpVault";
import convertE8sToNumber from "@frontend/utils/convertE8sToNumber";

interface Props {
  className?: string;
  address: string;
  onChange?: (balance: string) => void;
  isCkbtc?: boolean;
}

const Balance = ({ address, className, onChange, isCkbtc }: Props) => {
  const [balance, setBalance] = useState<string>("0");
  const [loading, setLoading] = useState<boolean>(false);
  const { get_multisig_balance } = useIcpVault();

  const fetchEthBalance = async (address: string) => {
    try {
      setLoading(true);
      const { data, error } = await get_multisig_balance(address);
      if (data && !error) {
        setBalance(convertE8sToNumber(isCkbtc ? data.ckbtc : data?.icp?.e8s));
        onChange(convertE8sToNumber(isCkbtc ? data.ckbtc : data?.icp?.e8s));
      }
      setLoading(false);
      // if (balance) setBalance(balance);
    } catch (err) {
      console.log("Err from fetchEthBalance", err);
    }
  };

  useEffect(() => {
    if (address) fetchEthBalance(address);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  return (
    <div
      className={`bg-highlight rounded-lg px-[10px] py-[6px] ml-auto font-normal text-xs leading-[13px] flex items-center justify-center ${className}`}
    >
      <span className="text-primary mr-2">Balance: </span>
      {loading ? <Loader /> : <span className="text-white">{balance}</span>}
    </div>
  );
};

export default Balance;
