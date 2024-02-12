// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { Form, Spin } from "antd"
import React, { useState } from "react"
import FailedTransactionLottie from "@frontend/ui-components/lottie-graphics/FailedTransaction"
import LoadingLottie from "@frontend/ui-components/lottie-graphics/Loading"
import CancelBtn from "@frontend/components/Settings/CancelBtn"
import ModalBtn from "@frontend/components/Settings/ModalBtn"
import { useGlobalUserDetailsContext } from "@frontend/context/UserDetailsContext"
import { firebaseFunctionsHeader } from "@frontend/global/firebaseFunctionsHeader"
import { FIREBASE_FUNCTIONS_URL } from "@frontend/global/firebaseFunctionsUrl"
import { NotificationStatus } from "@frontend/types"
import AddressComponent from "@frontend/ui-components/AddressComponent"
import Balance from "@frontend/ui-components/Balance"
import BalanceInput from "@frontend/ui-components/BalanceInput"
import queueNotification from "@frontend/ui-components/QueueNotification"
import copyText from "@frontend/utils/copyText"
import shortenAddress from "@frontend/utils/shortenAddress"
import styled from "styled-components"

import TransactionSuccessScreen from "./TransactionSuccessScreen"
import Avatar from "../Avatar/Avatar"

const FundMultisig = ({
  className,
  onCancel,
  setNewTxn,
}: {
  className?: string
  onCancel: () => void
  setNewTxn?: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const { activeMultisig, addressBook, address } = useGlobalUserDetailsContext()

  const [selectedSender] = useState(addressBook[0].address)
  const [amount, setAmount] = useState("0")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [failure] = useState(false)
  const [loadingMessages] = useState<string>("")
  const [txnHash] = useState<string>("")
  const [selectedAccountBalance, setSelectedAccountBalance] =
    useState<string>("")
  const signer: any = ""

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const tx = await signer.sendTransaction({
        to: activeMultisig,
        value: amount.toString(),
      })
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
      })
      setSuccess(true)
    } catch (err) {
      console.log("error from handleSubmit sendNativeToken", err)
      setNewTxn?.((prev) => !prev)
      onCancel()
      queueNotification({
        header: "Error!",
        message: "Please try again",
        status: NotificationStatus.ERROR,
      })
    }

    setLoading(false)
  }

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
            setNewTxn?.((prev) => !prev)
          }}
        />
      ) : failure ? (
        <FailedTransactionLottie message="Failed!" />
      ) : (
        <Spin
          spinning={loading}
          indicator={<LoadingLottie width={300} message={loadingMessages} />}
        >
          <div className={className}>
            <p className="text-primary font-normal text-xs leading-[13px] mb-2">
              Recipient
            </p>
            {/* TODO: Make into reusable component */}
            <div className=" p-[10px] border-2 border-dashed border-bg-secondary rounded-lg flex items-center justify-between">
              <AddressComponent withBadge={false} address={activeMultisig} />
              <Balance address={activeMultisig} />
            </div>

            <Form disabled={loading}>
              <section className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-primary font-normal text-xs leading-[13px] block">
                    Sending from
                  </label>
                  <Balance
                    address={selectedSender}
                    onChange={setSelectedAccountBalance}
                  />
                </div>
                <div className="flex items-center gap-x-[10px]">
                  <div className="w-full">
                    <div className="flex gap-x-3 items-center">
                      <div className="relative">
                        <Avatar account={address || ""} size={20} />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-x-2">
                          My Address
                        </div>
                        <div className="flex text-xs">
                          <div
                            title={address || ""}
                            className=" font-normal text-text_secondary"
                          >
                            {address && shortenAddress(address || "")}
                          </div>
                          <button
                            className="ml-2 mr-1"
                            onClick={() => copyText(address)}
                          ></button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <BalanceInput
                fromBalance={selectedAccountBalance}
                className="mt-6"
                placeholder={"5"}
                onChange={(balance) => setAmount(balance)}
              />

              <section className="flex items-center gap-x-5 justify-center mt-10">
                <CancelBtn
                  loading={loading}
                  className="w-[250px]"
                  onClick={onCancel}
                />
                <ModalBtn
                  disabled={amount == "0"}
                  loading={loading}
                  onClick={handleSubmit}
                  className="w-[250px]"
                  title="Make Transaction"
                />
              </section>
            </Form>
          </div>
        </Spin>
      )}
    </>
  )
}

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
`
