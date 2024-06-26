// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { Collapse, Divider, Skeleton } from "antd";
import classNames from "classnames";
import dayjs from "dayjs";
import React, { FC, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useGlobalUserDetailsContext } from "@frontend/context/UserDetailsContext";
import { firebaseFunctionsHeader } from "@frontend/global/firebaseFunctionsHeader";
import { FIREBASE_FUNCTIONS_URL } from "@frontend/global/firebaseFunctionsUrl";
import { chainProperties } from "@frontend/global/networkConstants";
import {
  IQueueItem,
  ITransaction,
  ITxNotification,
  NotificationStatus,
} from "@frontend/types";
import {
  ArrowUpRightIcon,
  CircleArrowDownIcon,
  CircleArrowUpIcon,
} from "@frontend/ui-components/CustomIcons";
import LoadingModal from "@frontend/ui-components/LoadingModal";
import queueNotification from "@frontend/ui-components/QueueNotification";

import SentInfo from "./SentInfo";
import useIcpVault from "@frontend/hooks/useIcpVault";

interface ITransactionProps {
  status: "Approval" | "Cancelled" | "Executed";
  date: number;
  approvals: string[];
  threshold: number;
  callData: string;
  callHash: string;
  note: string;
  refetch?: () => void;
  setQueuedTransactions?: React.Dispatch<React.SetStateAction<IQueueItem[]>>;
  numberOfTransactions: number;
  notifications?: ITxNotification;
  value: string;
  onAfterApprove?: any;
  onAfterExecute?: any;
  txType?: any;
  recipientAddress?: string;
  owner: string;
}

const Transaction: FC<ITransactionProps> = ({
  approvals,
  callData,
  callHash,
  date,
  threshold,
  notifications,
  value,
  onAfterApprove,
  onAfterExecute,
  txType,
  recipientAddress,
  owner,
}) => {
  const { activeMultisig, address, identityBackend } =
    useGlobalUserDetailsContext();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [failure, setFailure] = useState(false);
  const [getMultiDataLoading] = useState(false);
  const [loadingMessages, setLoadingMessage] = useState("");
  const [openLoadingModal, setOpenLoadingModal] = useState(false);

  const navigate = useNavigate();

  const [transactionInfoVisible, toggleTransactionVisible] = useState(false);
  const [callDataString, setCallDataString] = useState<string>(callData || "");
  const token = "ICP";
  const location = useLocation();
  const hash = location.hash.slice(1);
  const [transactionDetailsLoading, setTransactionDetailsLoading] =
    useState<boolean>(false);

  const { approve_transaction } = useIcpVault();

  const handleApproveTransaction = async () => {
    setLoading(true);
    try {
      console.log(activeMultisig, callHash);
      const { data, error } = await approve_transaction(
        activeMultisig,
        callHash,
      );
      if (data && !error) {
        console.log(data);
        setSuccess(true);
        onAfterApprove(callHash);
        setLoadingMessage("Transaction Signed Successfully.");
        queueNotification({
          header: "Success!",
          message: "Transaction Approved",
          status: NotificationStatus.SUCCESS,
        });
      }
      if (error) {
        queueNotification({
          header: "Error!",
          message: "Error in Approving the transaction",
          status: NotificationStatus.ERROR,
        });
      }
    } catch (error) {
      console.log(error);
      setFailure(true);
      setLoadingMessage("Something went wrong! Please try again.");
      queueNotification({
        header: "Error!",
        message: "Error in Approving the transaction",
        status: NotificationStatus.ERROR,
      });
    }
    setLoading(false);
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
          key={`${callHash}`}
          header={
            getMultiDataLoading ? (
              <Skeleton active paragraph={{ rows: 0 }} />
            ) : (
              <div
                onClick={() => {
                  toggleTransactionVisible(!transactionInfoVisible);
                }}
                className={classNames(
                  "grid items-center grid-cols-9 cursor-pointer text-white font-normal text-sm leading-[15px]",
                )}
              >
                <p className="col-span-3 flex items-center gap-x-3">
                  <span
                    className={`flex items-center justify-center w-9 h-9 ${
                      txType === "addOwner" || txType === "removeOwner"
                        ? "bg-[#FF79F2] text-[#FF79F2]"
                        : "bg-success text-red-500"
                    } bg-opacity-10 p-[10px] rounded-lg`}
                  >
                    <ArrowUpRightIcon />
                  </span>
                  <span>Sent</span>
                </p>
                {!(txType === "addOwner" || txType === "removeOwner") && (
                  <p className="col-span-2 flex items-center gap-x-[6px]">
                    {/* <ParachainIcon src={chainProperties[network].logo} /> */}
                    <span
                      className={
                        "font-normal text-xs leading-[13px] text-failure"
                      }
                    >
                      {value} {token}
                    </span>
                  </p>
                )}
                <p className="col-span-2">
                  {dayjs(date).format("YYYY-MM-DD HH:mm:ss")}
                </p>
                <p
                  className={`${
                    txType === "addOw" || txType === "removeOwner"
                      ? "col-span-4"
                      : "col-span-2"
                  } flex items-center justify-end gap-x-4`}
                >
                  <span className="text-waiting">
                    {!approvals.includes(address) &&
                      "Awaiting your Confirmation"}{" "}
                    ({approvals.length}/{threshold})
                  </span>
                  <span className="text-white text-sm">
                    {transactionInfoVisible ? (
                      <CircleArrowUpIcon />
                    ) : (
                      <CircleArrowDownIcon />
                    )}
                  </span>
                </p>
              </div>
            )
          }
        >
          <LoadingModal
            message={loadingMessages}
            loading={loading}
            success={success}
            failed={failure}
            open={openLoadingModal}
            onCancel={() => setOpenLoadingModal(false)}
          />

          <div>
            <Divider className="bg-text_secondary my-5" />
            <SentInfo
              amount={value}
              addressAddOrRemove={""}
              callHash={callHash}
              callDataString={callDataString}
              callData={callData}
              date={dayjs(date).format("YYYY-MM-DD HH:mm:ss")}
              approvals={approvals}
              threshold={threshold}
              loading={loading}
              getMultiDataLoading={getMultiDataLoading}
              recipientAddress={recipientAddress}
              setCallDataString={setCallDataString}
              handleApproveTransaction={handleApproveTransaction}
              handleExecuteTransaction={() => {}}
              handleCancelTransaction={async () => {}}
              note={""}
              isProxyApproval={false}
              isProxyAddApproval={false}
              delegate_id={""}
              isProxyRemovalApproval={false}
              notifications={notifications}
              txType={txType}
              transactionFields={null}
              transactionDetailsLoading={transactionDetailsLoading}
              owner={owner}
            />
          </div>
        </Collapse.Panel>
      </Collapse>
    </>
  );
};

export default Transaction;
