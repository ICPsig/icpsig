// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from "react"
import { Route, Routes } from "react-router-dom"
import AddressBook from "../../Screens/AddressBook"
import Assets from "../../Screens/Assets"
import ContactUs from "../../Screens/ContactUs"
import Donate from "../../Screens/Donate"
import Error404 from "../../Screens/Error404"
import Error500 from "../../Screens/Error500"
import Home from "../../Screens/Home"
import PrivacyPolicy from "../../Screens/PrivacyPolicy"
import Settings from "../../Screens/Settings"
import TermsAndCondition from "../../Screens/TermsAndCondition"
import Transaction from "../../Screens/Transactions"
import VerifyEmailToken from "../../Screens/VerifyEmailToken"

const SwitchRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/donate" element={<Donate />} />
      <Route path="*" element={<Error404 />} />
      <Route path="/error/500" element={<Error500 />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/transactions" element={<Transaction />} />
      <Route path="/assets" element={<Assets />} />
      <Route path="/address-book" element={<AddressBook />} />
      <Route path="/contact-us" element={<ContactUs />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-and-conditions" element={<TermsAndCondition />} />
      <Route path="/verify-email" element={<VerifyEmailToken />} />
    </Routes>
  )
}

export default SwitchRoutes
