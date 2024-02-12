// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { Form, Spin } from "antd";
import React, { useState } from "react";
import FailedTransactionLottie from "@frontend/ui-components/lottie-graphics/FailedTransaction";
import LoadingLottie from "@frontend/ui-components/lottie-graphics/Loading";
import CancelBtn from "@frontend/components/Settings/CancelBtn";
import ModalBtn from "@frontend/components/Settings/ModalBtn";
import { useGlobalUserDetailsContext } from "@frontend/context/UserDetailsContext";
import { firebaseFunctionsHeader } from "@frontend/global/firebaseFunctionsHeader";
import { FIREBASE_FUNCTIONS_URL } from "@frontend/global/firebaseFunctionsUrl";
import { NotificationStatus } from "@frontend/types";
import AddressComponent from "@frontend/ui-components/AddressComponent";
import Balance from "@frontend/ui-components/Balance";
import BalanceInput from "@frontend/ui-components/BalanceInput";
import queueNotification from "@frontend/ui-components/QueueNotification";
import copyText from "@frontend/utils/copyText";
import shortenAddress from "@frontend/utils/shortenAddress";
import styled from "styled-components";

import TransactionSuccessScreen from "./TransactionSuccessScreen";
import Avatar from "../Avatar/Avatar";
import { generateBitcoinAddress } from "@frontend/utils/generateBitcoinAddress";
import { Loader } from "lucide-react";

const FundMultisig = ({
  className,
  onCancel,
  setNewTxn,
}: {
  className?: string;
  onCancel: () => void;
  setNewTxn?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { activeMultisig, addressBook, address } =
    useGlobalUserDetailsContext();

  const [selectedSender] = useState(addressBook[0].address);
  const [amount, setAmount] = useState("0");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [failure] = useState(false);
  const [loadingMessages] = useState<string>("");
  const [txnHash] = useState<string>("");
  const [selectedAccountBalance, setSelectedAccountBalance] =
    useState<string>("");
  const signer: any = "";
  const [tabState, setTabState] = useState("ICP");
  const [bitcoinAddress, setBitcoinAddress] = useState("");
  const [btcLoading, setBtcLoading] = useState(false);

  const generateBTC = () => {
    setBtcLoading(true);
    setTimeout(() => {
      if (localStorage.getItem(activeMultisig)) {
        setBitcoinAddress(localStorage.getItem(activeMultisig));
        setBtcLoading(false);
        return;
      }
      const btcA = generateBitcoinAddress();
      setBitcoinAddress(btcA);
      localStorage.setItem(activeMultisig, btcA);
      setBtcLoading(false);
    }, 3000);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const tx = await signer.sendTransaction({
        to: activeMultisig,
        value: amount.toString(),
      });
      // const { transactionHash, to } = await tx.wait();
      // fetch(`${FIREBASE_FUNCTIONS_URL}/addTransactionEth`, {
      // 	body: JSON.stringify({
      // 		amount_token: amount.toString(),
      // 		// eslint-disable-next-line sort-keys
      // 		from: selectedSender,
      // 		safeAddress: activeMultisig,
      // 		data: '',
      // 		txHash: transactionHash,
      // 		to,
      // 		note: '',
      // 		type: 'fund',
      // 		executed: true
      // 	}),
      // 	// headers: firebaseFunctionsHeader(
      // 	//   network,
      // 	//   localStorage.getItem("address")!,
      // 	//   localStorage.getItem("signature")!
      // 	// ),
      // 	method: 'POST'
      // }).then((res) => res.json());
      queueNotification({
        header: "Success!",
        message: "You have successfully completed the transaction. ",
        status: NotificationStatus.SUCCESS,
      });
      setSuccess(true);
    } catch (err) {
      console.log("error from handleSubmit sendNativeToken", err);
      setNewTxn?.((prev) => !prev);
      onCancel();
      queueNotification({
        header: "Error!",
        message: "Please try again",
        status: NotificationStatus.ERROR,
      });
    }

    setLoading(false);
  };

  return (
    <>
      {success ? (
        <TransactionSuccessScreen
          successMessage="Transaction Successful!"
          amount={amount}
          sender={selectedSender}
          recipients={[activeMultisig]}
          created_at={new Date()}
          txnHash={txnHash}
          onDone={() => {
            setNewTxn?.((prev) => !prev);
          }}
        />
      ) : failure ? (
        <FailedTransactionLottie message="Failed!" />
      ) : (
        <Spin
          spinning={loading}
          indicator={<LoadingLottie width={300} message={loadingMessages} />}
        >
          <div className="flex gap-10 mb-3">
            <button
              onClick={() => setTabState("ICP")}
              className={`text-lg text-white text-bold ${
                tabState === "ICP"
                  ? "border-2 border-primary px-3 py-2 rounded-lg"
                  : ""
              }`}
            >
              ICP
            </button>
            <button
              onClick={() => {
                setTabState("BTC");
                generateBTC();
              }}
              className={`text-lg text-white text-bold ${
                tabState !== "ICP"
                  ? "border-2 border-primary px-3 py-2 rounded-lg"
                  : ""
              }`}
            >
              BTC
            </button>
          </div>

          <div className={className}>
            <p className="text-primary font-normal text-xs leading-[13px] mb-2">
              Recipient
            </p>
            {/* TODO: Make into reusable component */}
            {tabState === "ICP" ? (
              <div className=" p-[10px] border-2 border-dashed border-bg-secondary rounded-lg flex items-center justify-between">
                <AddressComponent withBadge={false} address={activeMultisig} />
                <Balance address={activeMultisig} />
              </div>
            ) : (
              <Spin spinning={btcLoading} indicator={<Loader />} tip={""}>
                <AddressComponent withBadge={false} address={bitcoinAddress} />
              </Spin>
            )}
          </div>
        </Spin>
      )}
    </>
  );
};

export default styled(FundMultisig)`
  .ant-select input {
    font-size: 14px !important;
    font-style: normal !important;
    line-height: 15px !important;
    border: 0 !important;
    outline: 0 !important;
    background-color: #24272e !important;
    border-radius: 8px !important;
    color: white !important;
    padding: 12px !important;
    display: block !important;
    height: auto !important;
  }
  .ant-select-selector {
    border: none !important;
    height: 40px !important;
    box-shadow: none !important;
  }

  .ant-select {
    height: 40px !important;
  }
  .ant-select-selection-search {
    inset: 0 !important;
  }
  .ant-select-selection-placeholder {
    color: #505050 !important;
    z-index: 100;
    display: flex !important;
    align-items: center !important;
  }
`;
