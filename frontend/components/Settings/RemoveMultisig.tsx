// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Form } from "antd"
import React, { useState } from "react"
import CancelBtn from "@frontend/components/Settings/CancelBtn"
import RemoveBtn from "@frontend/components/Settings/RemoveBtn"
import { useGlobalUserDetailsContext } from "@frontend/context/UserDetailsContext"
import { DEFAULT_MULTISIG_NAME } from "@frontend/global/default"
import { FIREBASE_FUNCTIONS_URL } from "@frontend/global/firebaseFunctionsUrl"
import { NotificationStatus } from "@frontend/types"
import queueNotification from "@frontend/ui-components/QueueNotification"

const RemoveMultisigAddress = ({ onCancel }: { onCancel: () => void }) => {
  const { activeMultisig, multisigAddresses, setUserDetailsContextState } =
    useGlobalUserDetailsContext()
  const [loading, setLoading] = useState<boolean>(false)

  const multisig = multisigAddresses.find(
    (item: any) =>
      item.address === activeMultisig || item.proxy === activeMultisig,
  )

  const handleRemoveSafe = async () => {
    try {
      setLoading(true)
      const userAddress = localStorage.getItem("address")
      const signature = localStorage.getItem("signature")

      if (!userAddress || !signature || !multisig?.address) {
        console.log("ERROR")
        setLoading(false)
        return
      }

      const removeSafeRes = await fetch(
        `${FIREBASE_FUNCTIONS_URL}/deleteMultisigEth`,
        {
          body: JSON.stringify({
            multisigAddress: multisig.address,
          }),
          method: "POST",
        },
      )

      const { data: removeSafeData, error: removeSafeError } =
        (await removeSafeRes.json()) as { data: string; error: string }

      if (removeSafeError) {
        queueNotification({
          header: "Error!",
          message: removeSafeError,
          status: NotificationStatus.ERROR,
        })
        setLoading(false)
        return
      }

      if (removeSafeData) {
        if (removeSafeData === "Success") {
          setLoading(false)
          const copy = [...multisigAddresses]
          setUserDetailsContextState((prevState: any) => {
            const newMutlisigArray = copy.filter(
              (item) =>
                item.address !== activeMultisig ||
                item.proxy === activeMultisig,
            )
            if (newMutlisigArray && newMutlisigArray[0]?.address) {
              localStorage.setItem(
                "active_multisig",
                newMutlisigArray[0].address,
              )
            } else {
              localStorage.removeItem("active_multisig")
            }
            return {
              ...prevState,
              activeMultisig: localStorage.getItem("active_multisig") || "",
              multisigAddresses: newMutlisigArray,
              multisigSettings: {
                ...prevState.multisigSettings,
                [multisig.address]: {
                  ...prevState.multisigSettings[multisig.address],
                  deleted: true,
                },
              },
            }
          })
          onCancel()
        }
      }
    } catch (error) {
      console.log("ERROR", error)
      setLoading(false)
    }
  }

  return (
    <Form className="my-0 w-[560px]">
      <p className="text-white font-medium text-sm leading-[15px]">
        Are you sure you want to permanently delete
        <span className="text-primary mx-1.5">
          {multisigAddresses?.find(
            (item: any) =>
              item.address === activeMultisig || item.proxy === activeMultisig,
          )?.name || DEFAULT_MULTISIG_NAME}
        </span>
        ?
      </p>
      <div className="flex items-center justify-between gap-x-5 mt-[30px]">
        <CancelBtn onClick={onCancel} />
        <RemoveBtn loading={loading} onClick={handleRemoveSafe} />
      </div>
    </Form>
  )
}

export default RemoveMultisigAddress
