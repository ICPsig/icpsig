// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React, { useEffect, useState } from "react";
import { useGlobalUserDetailsContext } from "@frontend/context/UserDetailsContext";

import Disable2FA from "./Disable2FA";
import Enable2FA from "./Enable2FA";
import axios from "axios";
import { icpsig_backend } from "@frontend/services/icp_backend";

const TwoFactorAuth = () => {
  const [twoFA, setTowFA] = useState(false);
  const { address } = useGlobalUserDetailsContext();
  const checkTwoFA = async () => {
    const { data } = await axios.get(`${icpsig_backend}/books?q=${address}`);
    setTowFA(data?.[0]?.tfa);
  };
  useEffect(() => {
    checkTwoFA();
  }, []);
  return <div>{twoFA ? <Disable2FA /> : <Enable2FA />}</div>;
};

export default TwoFactorAuth;
