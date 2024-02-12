// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { firebaseFunctionsHeader } from "@frontend/global/firebaseFunctionsHeader"
import { FIREBASE_FUNCTIONS_URL } from "@frontend/global/firebaseFunctionsUrl"
import { IAddressBookItem, NotificationStatus } from "@frontend/types"
import queueNotification from "@frontend/ui-components/QueueNotification"

export const addToAddressBook = async ({
  address,
  name,
  addressBook,
  network,
}: {
  address: string
  name?: string
  addressBook: IAddressBookItem[]
  network: string
}) => {
  if (!address) return

  if (!address) {
    return
  }

  try {
    const userAddress = localStorage.getItem("address")
    const signature = localStorage.getItem("signature")

    if (!userAddress || !signature) {
      console.log("ERROR")
      return
    } else {
      if (addressBook.some((item) => item.address === address)) {
        queueNotification({
          header: "Error!",
          message: "Address exists in Address book.",
          status: NotificationStatus.ERROR,
        })
        return
      }

      const addAddressRes = await fetch(
        `${FIREBASE_FUNCTIONS_URL}/addToAddressBookEth`,
        {
          body: JSON.stringify({
            address,
            name,
          }),
          headers: firebaseFunctionsHeader(network),
          method: "POST",
        },
      )

      const { data: addAddressData, error: addAddressError } =
        (await addAddressRes.json()) as {
          data: IAddressBookItem[]
          error: string
        }

      if (addAddressError) {
        return
      }

      if (addAddressData) {
        return addAddressData
      }
    }
  } catch (error) {
    console.log("ERROR", error)
  }
}
