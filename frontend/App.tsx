import React, { useState } from "react"
/*
 * Connect2ic provides essential utilities for IC app development
 */
import { createClient } from "@connect2ic/core"
import { defaultProviders } from "@connect2ic/core/providers"
import { ConnectDialog, Connect2ICProvider, useWallet } from "@connect2ic/react"
import "@connect2ic/core/style.css"
/*
 * Import canister definitions like this:
 */
/*
 * Some examples to get you started

 */
import * as icp_vault from "../.dfx/local/canisters/icp_vault"
import ConnectWallet from "./components/ConnectWallet"
import Multisig from "./components/Multisig"
import CreateMultisig from "./components/CreateMultisig"
import AddressBook from "./components/AddressBook"
import Transactions from "./components/Transactions"
import SendMoney from "./components/SendMoney"

const initState = {
  vaults: null,
  trnsactions: null,
  addressBook: null,
  assets: null,
}

function App() {
  const [wallet] = useWallet()
  const [userDetails, setUserDetails] = useState(initState)
  console.log(wallet)
  return (
    <div className="App">
        <>
            
            <div className="examples">
              <Multisig userDetails={userDetails} setUserDetails={setUserDetails}/>
              <CreateMultisig />
              <AddressBook />
              <Transactions />
              <SendMoney />
            <>
            <ConnectWallet/>
            <ConnectDialog />
            </>
            </div>
            
        </>
    </div>
  )
}

const client = createClient({
  canisters:{
    icp_vault
  },
  providers: defaultProviders,
  globalProviderConfig: {
    dev: import.meta.env.DEV,
  },
})

export default () => (
  <Connect2ICProvider client={client}>
    <App />
  </Connect2ICProvider>
)
