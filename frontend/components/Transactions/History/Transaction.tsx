// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Collapse, Divider } from "antd";
import classNames from "classnames";
import dayjs from "dayjs";
import React, { FC, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useGlobalUserDetailsContext } from "@frontend/context/UserDetailsContext";
import { firebaseFunctionsHeader } from "@frontend/global/firebaseFunctionsHeader";
import { FIREBASE_FUNCTIONS_URL } from "@frontend/global/firebaseFunctionsUrl";
import { chainProperties } from "@frontend/global/networkConstants";
import { ITransaction } from "@frontend/types";
import {
  ArrowDownLeftIcon,
  ArrowUpRightIcon,
  CircleArrowDownIcon,
  CircleArrowUpIcon,
} from "@frontend/ui-components/CustomIcons";
import { IHistoryTransactions } from "@frontend/utils/convertSafeData/convertSafeHistory";

import ReceivedInfo from "./ReceivedInfo";
import SentInfo from "./SentInfo";

// const LocalizedFormat = require("dayjs/plugin/localizedFormat")
// dayjs.extend(LocalizedFormat)

const Transaction: FC<IHistoryTransactions> = ({
  approvals,
  amount_token,
  created_at,
  to,
  from,
  txHash,
  type,
  executor,
  decodedData,
  data: callData,
}) => {
  const [transactionInfoVisible, toggleTransactionVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const hash = location.hash.slice(1);
  const isSentType = type === "Sent" || type === "MULTISIG_TRANSACTION";
  const isFundType = type === "ETHEREUM_TRANSACTION";
  const milliseconds = callData?.created_at / 1e6;

  const [transactionDetails, setTransactionDetails] = useState<ITransaction>(
    {} as any,
  );

  const [totalAmount, setTotalAmount] = useState<number>(0);
  const handleGetHistoryNote = async () => {
    try {
      const userAddress = localStorage.getItem("address");
      const signature = localStorage.getItem("signature");

      if (!userAddress || !signature) {
        console.log("ERROR");
        return;
      } else {
        setLoading(true);
        const getTransactionDetailsRes = await fetch(
          `${FIREBASE_FUNCTIONS_URL}/getTransactionDetailsEth`,
          {
            body: JSON.stringify({ callHash: txHash }),
            method: "POST",
          },
        );

        const { data: getTransactionData, error: getTransactionErr } =
          (await getTransactionDetailsRes.json()) as {
            data: ITransaction;
            error: string;
          };

        if (getTransactionErr) {
          console.log("error", getTransactionErr);
          setLoading(false);
          return;
        } else {
          setLoading(false);
          setTransactionDetails(getTransactionData);
        }
      }
    } catch (error) {
      setLoading(false);
      console.log("ERROR", error);
    }
  };

  return (
    <>
      <Collapse
        className="bg-bg-secondary rounded-lg p-2.5 scale-90 h-[111%] w-[111%] origin-top-left"
        bordered={false}
        defaultActiveKey={[`${hash}`]}
      >
        <Collapse.Panel
          showArrow={false}
          key={`${txHash}`}
          header={
            <div
              onClick={() => {
                if (!transactionInfoVisible) {
                  handleGetHistoryNote();
                }
                toggleTransactionVisible(!transactionInfoVisible);
              }}
              className={classNames(
                "grid items-center grid-cols-9 cursor-pointer text-white font-normal text-sm leading-[15px]",
              )}
            >
              <p className="col-span-3 flex items-center gap-x-3">
                {type === "Sent" ||
                type === "removeOwner" ||
                type === "MULTISIG_TRANSACTION" ? (
                  <span className="flex items-center justify-center w-9 h-9 bg-success bg-opacity-10 p-[10px] rounded-lg text-red-500">
                    <ArrowUpRightIcon />
                  </span>
                ) : (
                  <span className="flex items-center justify-center w-9 h-9 bg-success bg-opacity-10 p-[10px] rounded-lg text-green-500">
                    <ArrowDownLeftIcon />
                  </span>
                )}
                <span>
                  {type === "ETHEREUM_TRANSACTION"
                    ? "Fund"
                    : type === "Sent" || type === "MULTISIG_TRANSACTION"
                    ? "Sent"
                    : type === "removeOwner"
                    ? "Removed Owner"
                    : type === "addOwnerWithThreshold"
                    ? "Added Owner"
                    : type}
                </span>
              </p>
              {isFundType || isSentType ? (
                <p className="col-span-2 flex items-center gap-x-[6px]">
                  {/* <ParachainIcon src={chainProperties[network].logo} /> */}
                  {/* TODO:ALEEM */}
                  <span
                    className={classNames(
                      "font-normal text-xs leading-[13px] text-failure",
                      {
                        "text-success": isFundType,
                      },
                    )}
                  >
                    {isSentType ? "-" : "+"} {callData?.amount}
                  </span>
                </p>
              ) : (
                <p className="col-span-2">-</p>
              )}
              {created_at && (
                <p className="col-span-2">
                  {dayjs(milliseconds).format("YYYY-MM-DD HH:mm:ss")}
                </p>
              )}
              <p className="col-span-2 flex items-center justify-end gap-x-4">
                <span className="text-success">Success</span>
                <span className="text-white text-sm">
                  {transactionInfoVisible ? (
                    <CircleArrowUpIcon />
                  ) : (
                    <CircleArrowDownIcon />
                  )}
                </span>
              </p>
            </div>
          }
        >
          <div>
            <Divider className="bg-text_secondary my-5" />
            <SentInfo
              amount={callData.amount}
              approvals={approvals}
              amountType={""}
              date={dayjs(milliseconds).format("YYYY-MM-DD HH:mm:ss")}
              recipientAddress={callData.to}
              callHash={txHash || ""}
              note={transactionDetails?.note || ""}
              from={executor || ""}
              loading={loading}
              amount_usd={0}
              txType={type}
              addressAddOrRemove={
                type === "addOwnerWithThreshold"
                  ? decodedData.parameters?.[0]?.value
                  : type === "removeOwner"
                  ? decodedData.parameters?.[1]?.value
                  : ""
              }
            />
          </div>
        </Collapse.Panel>
      </Collapse>
    </>
  );
};

export default Transaction;
