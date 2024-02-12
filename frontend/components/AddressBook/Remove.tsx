// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Form } from "antd"
import React, { useState } from "react"
import CancelBtn from "@frontend/components/Settings/CancelBtn"
import RemoveBtn from "@frontend/components/Settings/RemoveBtn"
import { useActiveMultisigContext } from "@frontend/context/ActiveMultisigContext"
import { useModalContext } from "@frontend/context/ModalContext"
import { useGlobalUserDetailsContext } from "@frontend/context/UserDetailsContext"
import { firebaseFunctionsHeader } from "@frontend/global/firebaseFunctionsHeader"
import { FIREBASE_FUNCTIONS_URL } from "@frontend/global/firebaseFunctionsUrl"
import { ISharedAddressBooks, NotificationStatus } from "@frontend/types"
import queueNotification from "@frontend/ui-components/QueueNotification"

const RemoveAddress = ({
  addressToRemove,
  name,
  shared,
}: {
  addressToRemove: string
  name: string
  shared?: boolean
}) => {
  const { address, activeMultisig, addressBook, setUserDetailsContextState } =
    useGlobalUserDetailsContext()
  const { setActiveMultisigContextState } = useActiveMultisigContext()
  const { toggleVisibility } = useModalContext()
  const [loading, setLoading] = useState<boolean>(false)

  const handleRemoveFromPersonalAddressBook = async () => {
    try {
      setLoading(true)
      const userAddress = localStorage.getItem("address")
      const signature = localStorage.getItem("signature")

      if (!userAddress || !signature) {
        console.log("ERROR")
        setLoading(false)
        return
      } else {
        if (addressToRemove === address) {
          setLoading(false)
          return
        }

        const removeAddressRes = await fetch(
          `${FIREBASE_FUNCTIONS_URL}/removeFromAddressBookEth`,
          {
            body: JSON.stringify({
              address: addressToRemove,
            }),
            method: "POST",
          },
        )

        const { data: removeAddressData, error: removeAddressError } =
          (await removeAddressRes.json()) as { data: any; error: string }

        if (removeAddressError) {
          queueNotification({
            header: "Error!",
            message: removeAddressError,
            status: NotificationStatus.ERROR,
          })
          setLoading(false)
          return
        }

        if (removeAddressData) {
          const filteredAddresses = [...addressBook].filter(
            (item) => item.address !== addressToRemove,
          )
          setUserDetailsContextState((prev) => {
            return {
              ...prev,
              addressBook: filteredAddresses,
            }
          })

          queueNotification({
            header: "Success!",
            message: "Your address has been removed successfully!",
            status: NotificationStatus.SUCCESS,
          })
          setLoading(false)
          toggleVisibility()
        }
      }
    } catch (error) {
      console.log("ERROR", error)
      setLoading(false)
    }
  }

  const handleRemoveFromSharedAddressBook = async () => {
    try {
      setLoading(true)
      const userAddress = localStorage.getItem("address")
      const signature = localStorage.getItem("signature")

      if (!userAddress || !signature) {
        console.log("ERROR")
        setLoading(false)
        return
      } else {
        if (addressToRemove === address) {
          setLoading(false)
          return
        }

        const removeAddressRes = await fetch(
          `${FIREBASE_FUNCTIONS_URL}/removeFromSharedAddressBookEth`,
          {
            body: JSON.stringify({
              address: addressToRemove,
              multisigAddress: activeMultisig,
            }),
            method: "POST",
          },
        )

        const { data: removeAddressData, error: removeAddressError } =
          (await removeAddressRes.json()) as {
            data: ISharedAddressBooks
            error: string
          }

        if (removeAddressError) {
          queueNotification({
            header: "Error!",
            message: removeAddressError,
            status: NotificationStatus.ERROR,
          })
          setLoading(false)
          return
        }

        if (removeAddressData) {
          setActiveMultisigContextState(removeAddressData as any)

          const filteredAddresses = [...addressBook].filter(
            (item) => item.address !== addressToRemove,
          )
          setUserDetailsContextState((prev) => {
            return {
              ...prev,
              addressBook: filteredAddresses,
            }
          })

          queueNotification({
            header: "Success!",
            message: "Your address has been removed successfully!",
            status: NotificationStatus.SUCCESS,
          })
          setLoading(false)
          toggleVisibility()
        }
      }
    } catch (error) {
      console.log("ERROR", error)
      setLoading(false)
    }
  }

  return (
    <Form className="my-0 w-[560px]">
      {shared ? (
        <p className="text-white font-medium text-sm leading-[15px]">
          This will delete the address for everyone. Are you sure you want to
          permanently delete
          <span className="text-primary mx-1.5">{name}</span>
          from your Multisig&apos;s Address Book?
        </p>
      ) : (
        <p className="text-white font-medium text-sm leading-[15px]">
          Are you sure you want to permanently delete
          <span className="text-primary mx-1.5">{name}</span>
          from your Personal Address Book?
        </p>
      )}
      <div className="flex items-center justify-between gap-x-5 mt-[30px]">
        <CancelBtn loading={loading} onClick={toggleVisibility} />
        <RemoveBtn
          loading={loading}
          onClick={
            shared
              ? handleRemoveFromSharedAddressBook
              : handleRemoveFromPersonalAddressBook
          }
        />
      </div>
    </Form>
  )
}

export default RemoveAddress
