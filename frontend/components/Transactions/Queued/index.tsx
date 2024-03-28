// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import dayjs from "dayjs";
import React, { FC, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useGlobalUserDetailsContext } from "@frontend/context/UserDetailsContext";
import Loader from "@frontend/ui-components/Loader";
import { convertSafePendingData } from "@frontend/utils/convertSafeData/convertSafePending";
import updateDB, { UpdateDB } from "@frontend/utils/updateDB";

import NoTransactionsQueued from "./NoTransactionsQueued";
import Transaction from "./Transaction";
import useIcpVault from "@frontend/hooks/useIcpVault";
import convertE8sToNumber from "@frontend/utils/convertE8sToNumber";

// const LocalizedFormat = require("dayjs/plugin/localizedFormat")
// dayjs.extend(LocalizedFormat)

interface IQueued {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: boolean;
  setRefetch: React.Dispatch<React.SetStateAction<boolean>>;
}
const Queued: FC<IQueued> = ({ loading, setLoading, refetch, setRefetch }) => {
  const { address, activeMultisig, multisigAddresses } =
    useGlobalUserDetailsContext();
  const [queuedTransactions, setQueuedTransactions] = useState<any[]>([]);
  const location = useLocation();
  const { get_transactions } = useIcpVault();
  const currentMultisig = multisigAddresses?.find(
    (item) => item.address === activeMultisig,
  );
  const handleAfterApprove = (id: string) => {
    const payload = queuedTransactions
      .map((queue) => {
        return queue.id === id
          ? { ...queue, approvals: [...(queue.approvals || []), { address }] }
          : queue;
      })
      .filter((a) => {
        return !(a.id === id && a.approvals.length === a.threshold);
      });
    setQueuedTransactions(payload);
  };

  const handleAfterExecute = (callHash?: string) => {
    console.log(callHash);
  };

  useEffect(() => {
    const hash = location.hash.slice(1);
    const elem = document.getElementById(hash);
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [location.hash, queuedTransactions]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data: getTransactionData } = await get_transactions(
          activeMultisig,
        );
        const queuedTxn = [];
        getTransactionData.forEach((txn) => {
          const formatData = {
            id: txn.id,
            from_vault: txn.from_vault,
            transaction_owner: txn.transaction_owner.toText(),
            to: txn.to,
            threshold: Number(txn.threshold),
            approvals: txn.approvals.map((a) => {
              return a?.[0].toText();
            }),
            amount: convertE8sToNumber(txn.amount),
            created_at: Number(txn.created_at),
            completed: txn.completed,
          };
          !txn.completed && queuedTxn.push(formatData);
        });
        setQueuedTransactions(queuedTxn);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    })();
  }, [activeMultisig]);

  if (loading) {
    return (
      <div className="h-full">
        <Loader size="large" />
      </div>
    );
  }

  return (
    <>
      {queuedTransactions && queuedTransactions.length > 0 ? (
        <div className="flex flex-col gap-y-[10px]">
          {queuedTransactions
            .sort((a, b) =>
              dayjs(a.created_at).isBefore(dayjs(b.created_at)) ? 1 : -1,
            )
            .map((transaction) => {
              console.log(transaction);
              const milliseconds = transaction?.created_at / 1e6;
              const date = dayjs(milliseconds).format("YYYY-MM-DD HH:mm:ss");
              return (
                <section id={transaction.id} key={transaction.id}>
                  <Transaction
                    value={transaction.amount}
                    setQueuedTransactions={setQueuedTransactions}
                    date={milliseconds}
                    status={transaction.completed ? "Executed" : "Approval"}
                    approvals={transaction.approvals || []}
                    threshold={currentMultisig?.threshold || 0}
                    callData={transaction.id}
                    callHash={transaction.id}
                    note={transaction.note || ""}
                    refetch={() => setRefetch((prev) => !prev)}
                    onAfterApprove={handleAfterApprove}
                    onAfterExecute={handleAfterExecute}
                    numberOfTransactions={queuedTransactions.length || 0}
                    notifications={transaction?.notifications || {}}
                    txType={transaction.category}
                    recipientAddress={transaction.to}
                    owner={transaction.transaction_owner}
                  />
                </section>
              );
            })}
        </div>
      ) : (
        <NoTransactionsQueued />
      )}
    </>
  );
};

export default Queued;
