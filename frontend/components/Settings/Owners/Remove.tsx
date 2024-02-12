// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { Button, Form, Spin, Tooltip } from "antd"
import React, { useState } from "react"
import AddMultisigSVG from "@frontend/assets/add-multisig.svg"
import FailedTransactionLottie from "@frontend/ui-components/lottie-graphics/FailedTransaction"
import LoadingLottie from "@frontend/ui-components/lottie-graphics/Loading"
import RemoveMultisigSVG from "@frontend/assets/remove-multisig.svg"
import CancelBtn from "@frontend/components/Settings/CancelBtn"
import RemoveBtn from "@frontend/components/Settings/RemoveBtn"
import Loader from "@frontend/components/UserFlow/Loader"
import { useGlobalUserDetailsContext } from "@frontend/context/UserDetailsContext"
import { NotificationStatus } from "@frontend/types"
import { WarningCircleIcon } from "@frontend/ui-components/CustomIcons"
import queueNotification from "@frontend/ui-components/QueueNotification"
import { addNewTransaction } from "@frontend/utils/addNewTransaction"
import Avatar from "@frontend/components/Avatar/Avatar"

const RemoveOwner = ({
  addressToRemove,
  oldThreshold,
  oldSignatoriesLength,
  onCancel,
}: {
  addressToRemove: string
  oldThreshold: number
  oldSignatoriesLength: number
  onCancel: () => void
}) => {
  const [newThreshold, setNewThreshold] = useState(
    oldThreshold === oldSignatoriesLength ? oldThreshold - 1 : oldThreshold,
  )
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<boolean>(false)
  const [failure, setFailure] = useState<boolean>(false)
  const { multisigAddresses, activeMultisig, address, identityBackend } =
    useGlobalUserDetailsContext()
  const [txnHash] = useState<string>("")

  const multisig = multisigAddresses.find(
    (item: any) =>
      item.address === activeMultisig || item.proxy === activeMultisig,
  )
  const handleRemoveOwner = async () => {
    setLoading(true)
    try {
      const safeTxHash = (
        await identityBackend.createRemoveOwnerTx(
          activeMultisig,
          addressToRemove,
          newThreshold,
        )
      ).data
      if (safeTxHash) {
        onCancel?.()
        setLoading(false)
        queueNotification({
          header: "Success",
          message: "New Transaction Created.",
          status: NotificationStatus.SUCCESS,
        })
      } else {
        setLoading(false)
        setFailure(true)
        queueNotification({
          header: "Error.",
          message: "Please try again.",
          status: NotificationStatus.ERROR,
        })
      }
    } catch (err) {
      onCancel?.()
      setLoading(false)
      setFailure(true)
      queueNotification({
        header: "Error.",
        message: "Please try again.",
        status: NotificationStatus.ERROR,
      })
    }
  }

  return (
    <>
      {failure ? (
        <FailedTransactionLottie message="Failed!" />
      ) : (
        <Spin spinning={loading} indicator={<LoadingLottie />}>
          <Form className="my-0">
            <div className="flex justify-center gap-x-4 items-center mb-6 w-full">
              <div className="flex flex-col text-white items-center justify-center">
                <img src={AddMultisigSVG} />
                <p className="text-text_secondary">Add New Multisig</p>
              </div>
              <Loader className="bg-primary h-[2px] w-[80px]" />
              <div className="flex flex-col text-white items-center justify-center">
                <img src={RemoveMultisigSVG} />
                <p className="text-text_secondary">Remove Old Multisig</p>
              </div>
            </div>
            <section className="mb-4 w-full text-waiting bg-waiting bg-opacity-10 p-3 rounded-lg font-normal text-xs leading-[16px] flex items-center gap-x-[11px]">
              <span>
                <WarningCircleIcon className="text-base" />
              </span>
              <p>
                Removing a signatory would require you to sign two transactions
                and approval from other signatories.
              </p>
            </section>
            <div className="text-primary text-sm mb-2">Remove Signatory*</div>
            <div className="flex items-center p-3 mb-4 text-text_secondary border-dashed border-2 border-bg-secondary rounded-lg gap-x-5">
              <Avatar account={addressToRemove} size={4} />
              {addressToRemove}
            </div>
            <div className="text-primary text-sm mb-2">New Threshold</div>
            <div className="flex items-center gap-x-3">
              <p className="flex items-center justify-center gap-x-[16.83px] p-[12.83px] bg-bg-secondary rounded-lg">
                <Tooltip
                  title={newThreshold === 2 && "Minimum Threshold must be 2"}
                >
                  <Button
                    onClick={() => {
                      if (newThreshold !== 2) {
                        setNewThreshold((prev) => prev - 1)
                      }
                    }}
                    className={`p-0 outline-none border rounded-full flex items-center justify-center ${
                      newThreshold === 2
                        ? "border-text_secondary text-text_secondary"
                        : "text-primary border-primary"
                    } w-[14.5px] h-[14.5px]`}
                  >
                    -
                  </Button>
                </Tooltip>
                <span className="text-white text-sm">{newThreshold}</span>
                <Tooltip
                  title={
                    newThreshold === oldSignatoriesLength - 1 &&
                    "Threshold must be Less than or Equal to Signatories"
                  }
                >
                  <Button
                    onClick={() => {
                      if (newThreshold < oldSignatoriesLength - 1) {
                        setNewThreshold((prev) => prev + 1)
                      }
                    }}
                    className={`p-0 outline-none border rounded-full flex items-center justify-center ${
                      newThreshold === oldSignatoriesLength - 1
                        ? "border-text_secondary text-text_secondary"
                        : "text-primary border-primary"
                    } w-[14.5px] h-[14.5px]`}
                  >
                    +
                  </Button>
                </Tooltip>
              </p>
              <p className="text-text_secondary font-normal text-sm leading-[15px]">
                out of{" "}
                <span className="text-white font-medium">
                  {oldSignatoriesLength - 1}
                </span>{" "}
                owners
              </p>
            </div>
            <div className="flex items-center justify-between gap-x-4 mt-[30px]">
              <CancelBtn onClick={onCancel} />
              <RemoveBtn loading={loading} onClick={handleRemoveOwner} />
            </div>
          </Form>
        </Spin>
      )}
    </>
  )
}

export default RemoveOwner
