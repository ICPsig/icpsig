// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ConfigProvider } from "antd"
import React from "react"
import { BrowserRouter } from "react-router-dom"
import AppLayout from "@frontend/components/AppLayout"

import { IdentityContextProvider } from "@frontend/context/IdentityProviderContext"
import ModalContextProvider from "@frontend/context/ModalContext"
import { UserDetailsProvider } from "@frontend/context/UserDetailsContext"
import { antdTheme } from "@frontend/themes/antdTheme"
import { GlobalStyle } from "@frontend/ui-components/GlobalStyle"
import { ActiveMultisigProvider } from "@frontend/context/ActiveMultisigContext"

function App() {
  return (
    <BrowserRouter>
      <ConfigProvider theme={antdTheme}>
        <IdentityContextProvider>
          <UserDetailsProvider>
            <ActiveMultisigProvider>
              <GlobalStyle />
              <ModalContextProvider>
                <AppLayout />
              </ModalContextProvider>
            </ActiveMultisigProvider>
          </UserDetailsProvider>
        </IdentityContextProvider>
      </ConfigProvider>
    </BrowserRouter>
  )
}

export default App
