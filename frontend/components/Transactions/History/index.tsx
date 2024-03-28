// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { FC } from "react";
import { useLocation } from "react-router-dom";
import { useGlobalUserDetailsContext } from "@frontend/context/UserDetailsContext";
import { usePagination } from "@frontend/hooks/usePagination";
import Loader from "@frontend/ui-components/Loader";
import Pagination from "@frontend/ui-components/Pagination";
import { convertSafeHistoryData } from "@frontend/utils/convertSafeData/convertSafeHistory";
import updateDB, { UpdateDB } from "@frontend/utils/updateDB";

import NoTransactionsHistory from "./NoTransactionsHistory";
import Transaction from "./Transaction";
import useIcpVault from "@frontend/hooks/useIcpVault";
import convertE8sToNumber from "@frontend/utils/convertE8sToNumber";

interface IHistory {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: boolean;
}

const History: FC<IHistory> = ({ loading, setLoading, refetch }) => {
  const location = useLocation();
  const [transactions, setTransactions] = useState<any[]>([]);
  const { activeMultisig } = useGlobalUserDetailsContext();
  const { get_transactions } = useIcpVault();

  useEffect(() => {
    const hash = location.hash.slice(1);
    const elem = document.getElementById(hash);
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [location.hash, transactions]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data: getTransactionData } = await get_transactions(
          activeMultisig,
        );
        const completeTxn = [];
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
          txn.completed && completeTxn.push(formatData);
        });
        setTransactions(completeTxn);
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
      {transactions && transactions.length > 0 ? (
        <div className="flex flex-col gap-y-[10px] mb-2">
          {transactions
            .sort((a, b) =>
              dayjs(a.created_at).isBefore(dayjs(b.created_at)) ? 1 : -1,
            )
            .map((transaction, index) => (
              <section id={transaction.callHash} key={index}>
                <Transaction
                  approvals={transaction.signatures}
                  {...transaction}
                  data={transaction}
                />
              </section>
            ))}
        </div>
      ) : (
        <NoTransactionsHistory />
      )}
    </>
  );
};

export default History;
