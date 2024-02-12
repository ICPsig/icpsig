// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { firebaseFunctionsHeader } from "@frontend/global/firebaseFunctionsHeader"
import { FIREBASE_FUNCTIONS_URL } from "@frontend/global/firebaseFunctionsUrl"
import { ITransaction } from "@frontend/types"

type Args = Omit<
  ITransaction,
  | "created_at"
  | "amount_usd"
  | "amount_token"
  | "id"
  | "token"
  | "block_number"
  | "from"
> & {
  amount?: string
  safeAddress?: string
  executed?: boolean
  type?: "sent" | "received"
  transactionFields?: {
    category: string
    subfields: { [subfield: string]: { name: string; value: string } }
  }
}

export async function addNewTransaction({
  amount,
  executed,
  transactionFields,
  type,
  network,
  callData,
  callHash,
  to,
  note,
  safeAddress,
}: Args): Promise<{ data?: ITransaction; error: string } | any> {
  const newTransactionData: Omit<Args, "amount"> & { amount_token: string } = {
    amount_token: amount?.toString() || "",
    callData,
    callHash,
    executed,
    network,
    note,
    safeAddress,
    to,
    transactionFields,
    type,
  }

  const setTransactionResponse = await fetch(
    `${FIREBASE_FUNCTIONS_URL}/addTransactionEth`,
    {
      body: JSON.stringify(newTransactionData),
      headers: firebaseFunctionsHeader(network),
      method: "POST",
    },
  )

  return await setTransactionResponse.json()
}
