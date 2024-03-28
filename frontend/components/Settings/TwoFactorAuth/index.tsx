// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React, { useEffect, useState } from "react";
import { useGlobalUserDetailsContext } from "@frontend/context/UserDetailsContext";

import Disable2FA from "./Disable2FA";
import Enable2FA from "./Enable2FA";

const TwoFactorAuth = () => {
  const { tfa_token } = useGlobalUserDetailsContext();

  return <div>{tfa_token.enabled ? <Disable2FA /> : <Enable2FA />}</div>;
};

export default TwoFactorAuth;
