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

interface IHistory {
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: boolean;
}

const History: FC<IHistory> = ({ loading, setLoading, refetch }) => {
  const location = useLocation();
  const { currentPage, setPage, totalDocs } = usePagination();
  const [transactions, setTransactions] = useState<any[]>([]);
  const { activeMultisig, identityBackend } = useGlobalUserDetailsContext();
  const { address } = useGlobalUserDetailsContext();

  useEffect(() => {
    const hash = location.hash.slice(1);
    const elem = document.getElementById(hash);
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [location.hash, transactions]);

  useEffect(() => {
    if (!identityBackend) {
      return;
    }
    (async () => {
      setLoading(true);
      try {
        const identityData = (
          await identityBackend.getTransactionHistory(activeMultisig)
        ).data;
        console.log(identityData);
        const convertedData = identityData.data;
        setTransactions(convertedData);
        // updateDB(
        //   UpdateDB.Update_History_Transaction,
        //   { transactions: convertedData },
        //   address,
        //   network
        // );
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeMultisig, address, refetch, identityBackend]);

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
            .map((transaction, index) => {
              return (
                <section id={transaction.callHash} key={index}>
                  <Transaction
                    approvals={
                      transaction.signatures
                        ? transaction.signatures.map(
                            (item: any) => item.address,
                          )
                        : []
                    }
                    {...transaction}
                  />
                </section>
              );
            })}
        </div>
      ) : (
        <NoTransactionsHistory />
      )}
      {totalDocs && totalDocs > 10 && (
        <div className="flex justify-center">
          <Pagination
            className="self-end"
            currentPage={currentPage}
            defaultPageSize={2}
            setPage={setPage}
            totalDocs={totalDocs || 1}
          />
        </div>
      )}
    </>
  );
};

export default History;
