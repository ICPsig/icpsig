// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { IMultisigAddress } from "@frontend/types"

export default function getOtherSignatories(
  address: string,
  activeMultisig: string,
  multisigAddresses: IMultisigAddress[],
): string[] {
  const multisig = multisigAddresses.find(
    (item) => item.address === activeMultisig,
  )

  const otherSignatories =
    multisig?.signatories?.filter((item) => item !== address) || []

  return otherSignatories
}
