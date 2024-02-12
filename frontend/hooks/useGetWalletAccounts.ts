// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { useEffect, useState } from "react"

const useGetWalletAccounts = () => {
  const [walletAccounts, setWalletAccounts] = useState<string[]>([])

  const getWalletAccounts = async (): Promise<string[] | undefined> => {
    if (!window) return
    // const provider = new ethers.providers.Web3Provider(window.ethereum);
    // const accounts = await provider.listAccounts();
    setWalletAccounts([])
    return
  }

  useEffect(() => {
    getWalletAccounts()
  }, [])

  return walletAccounts
}

export default useGetWalletAccounts
