// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React from "react"
import DonateInfo from "../../components/Donate/DonateInfo"
import ContentHeader from "@frontend/ui-components/ContentHeader"
import ContentWrapper from "@frontend/ui-components/ContentWrapper"
import RemoveSafeBtn from "@frontend/ui-components/RemoveSafeBtn"

const Donate = () => {
  return (
    <div>
      <ContentHeader title={"Donate"} rightElm={<RemoveSafeBtn />} />
      <ContentWrapper>
        <DonateInfo />
      </ContentWrapper>
    </div>
  )
}

export default Donate
