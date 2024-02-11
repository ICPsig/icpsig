import { useCanister, useConnect, useWallet } from "@connect2ic/react"
import React, { useEffect } from "react"

export default function Multisig({
  userDetails,
  setUserDetails,
}: {
  userDetails: any
  setUserDetails: any
}) {
  const [icpBackend] = useCanister("icp_vault")
  const { isConnected, principal } = useConnect()

  const fetchAllVaults = async () => {
    try {
      console.log(icpBackend)
      console.log(principal)
      const vaults = (await icpBackend.get_all_vault_by_principle(
        principal,
      )) as Array<any>
      ;(await icpBackend.check_principal(principal)) as Array<any>
      console.log(vaults, "new vault")
      if (vaults) {
        setUserDetails((prev) => ({ ...prev, vaults }))
        if (vaults[0]) {
          const balance = await icpBackend.get_multisig_balance(
            vaults.flat()?.[0],
          )
          console.log(balance)
        }
      }
    } catch (e) {
      console.log(e)
    }
  }
  useEffect(() => {
    fetchAllVaults()
  }, [])

  return (
    <div>
      <p>Multisig</p>
      {userDetails?.vaults && userDetails?.vaults.map((a) => <div>{a}</div>)}
    </div>
  )
}
