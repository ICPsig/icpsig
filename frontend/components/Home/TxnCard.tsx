// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ArrowRightOutlined } from "@ant-design/icons";
import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import noTransactionsHistory from "@frontend/assets/icons/no-transaction.svg";
import noTransactionsQueued from "@frontend/assets/icons/no-transactions-queued.svg";
import { useGlobalUserDetailsContext } from "@frontend/context/UserDetailsContext";
import {
  ArrowUpRightIcon,
  RightArrowOutlined,
} from "@frontend/ui-components/CustomIcons";
import Loader from "@frontend/ui-components/Loader";
import {
  convertSafeHistoryData,
  IHistoryTransactions,
} from "@frontend/utils/convertSafeData/convertSafeHistory";
import { convertSafePendingData } from "@frontend/utils/convertSafeData/convertSafePending";
import formatBnBalance from "@frontend/utils/formatBnBalance";
import shortenAddress from "@frontend/utils/shortenAddress";
import updateDB, { UpdateDB } from "@frontend/utils/updateDB";

import BottomLeftArrow from "@frontend/assets/icons/bottom-left-arrow.svg";
import TopRightArrow from "@frontend/assets/icons/top-right-arrow.svg";

const DEFAULT_TXN_CARD_LIMIT = 8;

const TxnCard = () => {
  const { activeMultisig, address, identityBackend, addressBook } =
    useGlobalUserDetailsContext();
  const [queuedTransactions, setQueuedTransactions] = useState<any>([]);
  const [completedTransactions, setCompletedTransactions] = useState<
    IHistoryTransactions[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const handleTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const identityCompletedData = (
        await identityBackend.getTransactionHistory(activeMultisig)
      ).data;
      const identityData = (await identityBackend.getPendingTx(activeMultisig))
        .data;
      setQueuedTransactions(identityData);
      setCompletedTransactions(identityCompletedData);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }, [activeMultisig, address, identityBackend]);

  useEffect(() => {
    if (!activeMultisig || !identityBackend) {
      return;
    }
    handleTransactions();
  }, [activeMultisig, handleTransactions, identityBackend]);

  return (
    <div>
      <div className="grid grid-cols-12 gap-4 grid-row-2 lg:grid-row-1">
        {/* Txn Queue */}
        <div className="col-start-1 col-end-13 md:col-end-7">
          <div className="flex justify-between flex-row w-full mb-2">
            <h2 className="text-base font-bold text-white">
              Transaction Queue
            </h2>
            <Link
              to="/transactions?tab=Queue"
              className="flex items-center justify-center text-primary cursor-pointer"
            >
              <p className="mx-2 text-primary text-sm">View All</p>
              <RightArrowOutlined />
            </Link>
          </div>

          <div className="flex flex-col bg-bg-main px-5 py-3 shadow-lg rounded-lg h-60 overflow-auto scale-90 w-[111%] origin-top-left">
            <h1 className="text-primary text-sm mb-4">Pending Transactions</h1>
            {loading ? (
              <Loader size="large" />
            ) : queuedTransactions && queuedTransactions.length > 0 ? (
              queuedTransactions.map((transaction: any, i: any) => {
                const tx = transaction as any;
                return (
                  <Link
                    to={`/transactions?tab=Queue#${transaction.txHash}`}
                    key={i}
                    className="flex items-center pb-2 mb-2"
                  >
                    <div className="flex flex-1 items-center">
                      <div className="bg-[#FF79F2] text-[#FF79F2] bg-opacity-10 rounded-lg h-[38px] w-[38px] flex items-center justify-center">
                        <ArrowUpRightIcon />
                      </div>
                      <div className="ml-3">
                        <h1 className="text-md text-white">
                          <span>Txn: {shortenAddress(tx.txHash)}</span>
                        </h1>
                        <p className="text-text_secondary text-xs">
                          In Process...
                        </p>
                      </div>
                    </div>

                    <div>
                      <h1 className="text-md text-white">{tx.amount_token}</h1>
                    </div>

                    <div className="flex justify-center items-center h-full px-2 text-text_secondary">
                      <ArrowRightOutlined />
                    </div>
                  </Link>
                );
              })
            ) : (
              <div
                className={"flex flex-col gap-y-5 items-center justify-center"}
              >
                <img
                  className={"block w-[250px] h-[140px]"}
                  src={noTransactionsQueued}
                  alt="Zero transaction icon"
                />
                <p className="font-normal text-sm leading-[15px] text-text_secondary">
                  No past transactions
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Txn History */}
        <div className="md:col-start-7 col-start-1 col-end-13">
          <div className="flex justify-between flex-row w-full mb-2">
            <h2 className="text-base font-bold text-white">
              Transaction History
            </h2>
            <Link
              to="/transactions?tab=History"
              className="flex items-center justify-center text-primary cursor-pointer"
            >
              <p className="mx-2 text-primary text-sm">View All</p>
              <RightArrowOutlined />
            </Link>
          </div>
          <div className="flex flex-col bg-bg-main px-5 py-3 shadow-lg rounded-lg h-60 scale-90 w-[111%] origin-top-left overflow-auto">
            <h1 className="text-primary text-sm mb-4">
              Completed Transactions
            </h1>

            {loading ? (
              <Loader size="large" />
            ) : completedTransactions && completedTransactions.length > 0 ? (
              completedTransactions
                .filter((_: any, i: number) => i < 10)
                .map((transaction, i) => {
                  // const from = transaction?.receipt?.options?.from;
                  const sent =
                    transaction.type === "sent" ||
                    transaction.type === "MULTISIG_TRANSACTION" ||
                    transaction.type === "removeOwner" ||
                    transaction.type === "multiSend";

                  let toText = "";
                  if (transaction.to) {
                    toText =
                      addressBook.find((a) => a.address === transaction.to)
                        ?.name || shortenAddress(transaction.to || "");
                  }
                  let batchCallRecipients: string[] = [];
                  let totalAmount: string = "";
                  if (transaction.type === "multiSend") {
                    batchCallRecipients =
                      transaction?.decodedData?.parameters?.[0]?.valueDecoded?.map(
                        (item: any) => {
                          const dest = item.to;
                          return (
                            addressBook.find((a) => a.address === dest)?.name ||
                            shortenAddress(dest || "")
                          );
                        },
                      );
                    totalAmount =
                      transaction?.decodedData?.parameters?.[0]?.valueDecoded?.reduce(
                        (total: string, item: any) => {
                          return Number(total) + Number(item.value);
                        },
                        "",
                      );
                  }
                  return (
                    <Link
                      to={`/transactions?tab=History#${
                        transaction?.txHash || ""
                      }`}
                      key={i}
                      className="flex items-center pb-2 mb-2"
                    >
                      <div className="flex flex-1 items-center">
                        <div
                          className={`${
                            sent ? "bg-failure" : "bg-success"
                          } bg-opacity-10 rounded-lg p-2 mr-3 h-[38px] w-[38px] flex items-center justify-center`}
                        >
                          <img
                            src={sent ? TopRightArrow : BottomLeftArrow}
                            alt="send"
                          />
                        </div>
                        <div>
                          <h1 className="text-md text-white">
                            <span>
                              {transaction.category === "addOwner" ? (
                                "Added Owner"
                              ) : transaction.category === "removeOwner" ? (
                                "Removed Owner"
                              ) : transaction.category === "transfer" ? (
                                <>
                                  To:{" "}
                                  {batchCallRecipients.map(
                                    (a, i) =>
                                      `${a}${
                                        i !== batchCallRecipients?.length - 1
                                          ? ", "
                                          : ""
                                      }`,
                                  )}
                                </>
                              ) : transaction.to ? (
                                <>To: {toText}</>
                              ) : (
                                `Txn: ${shortenAddress(transaction?.txHash)}`
                              )}
                            </span>
                          </h1>

                          {/* <p className='text-text_secondary text-xs'>{dayjs(transaction.created_at).format('D-MM-YY [at] HH:mm')}</p> */}
                        </div>
                      </div>
                      <div>
                        {transaction.type === "addOwner" ||
                        transaction.type === "removeOwner" ? (
                          <span className="text-md text-white">-?</span>
                        ) : sent ? (
                          <h1 className="text-md text-failure">
                            -{(transaction?.value?.[0] || 0)?.toString()}
                          </h1>
                        ) : (
                          <h1 className="text-md text-success">
                            +{(transaction?.value?.[0] || 0)?.toString()}
                          </h1>
                        )}
                      </div>
                      <div className="flex justify-center items-center h-full px-2 text-text_secondary">
                        <ArrowRightOutlined />
                      </div>
                    </Link>
                  );
                })
            ) : (
              <div
                className={"flex flex-col gap-y-5 items-center justify-center"}
              >
                <img
                  className={"block w-[250px] h-[140px]"}
                  src={noTransactionsHistory}
                  alt="Zero transaction icon"
                />
                <p className="font-normal text-sm leading-[15px] text-text_secondary">
                  No past transactions
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TxnCard;
