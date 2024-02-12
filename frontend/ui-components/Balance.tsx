// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useEffect, useState } from "react";

import Loader from "./Loader";

interface Props {
  className?: string;
  address: string;
  onChange?: (balance: string) => void;
  isCkbtc?: boolean;
}

export const mainBalance = {
  nxye5n3j1j05iu2da1a5s6c7qrau662be99l65v6tu43fq5fnpdcv9q5lqyqv4ab: 3.5,
};

const Balance = ({ address, className, isCkbtc }: Props) => {
  const [balance, setBalance] = useState<string>("0");
  const [loading, setLoading] = useState<boolean>(false);

  const fetchEthBalance = async (address: string) => {
    try {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
      //@ts-ignore
      // const allTokens = await window.ic.plug.requestBalance();
      // const balance = allTokens.find(
      //   (token: any) => token.symbol === "ICP",
      // ).amount;
      // console.log(balance);
      if (balance) setBalance(balance);
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
      {loading ? (
        <Loader />
      ) : (
        <span className="text-white">
          {parseFloat(isCkbtc ? 0 : mainBalance?.[address] || 0).toFixed(3)}
        </span>
      )}
    </div>
  );
};

export default Balance;
