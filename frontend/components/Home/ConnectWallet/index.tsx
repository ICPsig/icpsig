// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import ConnectWalletImg from "@frontend/assets/connect-wallet.svg";
import { useGlobalIdentityContext } from "@frontend/context/IdentityProviderContext";
import { useGlobalUserDetailsContext } from "@frontend/context/UserDetailsContext";
import { FIREBASE_FUNCTIONS_URL } from "@frontend/global/firebaseFunctionsUrl";
import { WarningCircleIcon } from "@frontend/ui-components/CustomIcons";
import useIcpVault from "@frontend/hooks/useIcpVault";
import { v4 as uuidv4 } from "uuid";
import { I2FAToken, NotificationStatus } from "@frontend/types";
import queueNotification from "@frontend/ui-components/QueueNotification";
import dayjs from "dayjs";
import { TOTP } from "otpauth";

const ConnectWallet = () => {
  const { login, setPrincipal, agent, authClient } = useGlobalIdentityContext();
  const [loading, setLoading] = useState<boolean>(false);
  const [tfaToken, setTfaToken] = useState<string>("");
  const [authCode, setAuthCode] = useState<number>();
  const [tokenExpired, setTokenExpired] = useState<boolean>(false);
  const { save_2FA_data, get_2FA_data } = useIcpVault();

  const checkTwoFA = async () => {
    if (!save_2FA_data || !get_2FA_data || tfaToken) {
      return;
    }
    setLoading(true);
    const { data: two_factor_auth, error } = await get_2FA_data();

    if (error) {
      queueNotification({
        header: "Failed",
        message: "Error in 2fa",
        status: NotificationStatus.ERROR,
      });
      setLoading(false);
    }

    if (two_factor_auth?.enabled) {
      const tfaToken = uuidv4();
      const { data: token, error: saveError } = await save_2FA_data(
        two_factor_auth?.base32_secret,
        two_factor_auth?.url,
        two_factor_auth?.enabled,
        two_factor_auth?.verified,
        tfaToken,
      );
      setTfaToken(token.tfaToken);
      setLoading(false);
      return;
    }
    const identity = authClient.getIdentity();
    const principal = identity.getPrincipal().toText();
    setPrincipal(principal);
    setLoading(false);
  };

  const handleLoginByInternetIdentity = async () => {
    try {
      setLoading(true);
      await login();
      console.log("Enter");
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  // const handleLoginByPlug = async () => {
  //   //@ts-ignore
  //   const icWidnowObject = window.ic.plug;
  //   const whitelist = [];
  //   const host = "https://mainnet.dfinity.network";

  //   //@ts-ignore
  //   const onConnectionUpdate = async () => {};

  //   try {
  //     await icWidnowObject.requestConnect({
  //       whitelist,
  //       host,
  //       onConnectionUpdate,
  //       timeout: 100000,
  //     });
  //     const account = icWidnowObject.sessionManager.sessionData.accountId;
  //     const agent = icWidnowObject.sessionManager.sessionData.agent;
  //     icWidnowObject.sessionManager.sessionData;
  //     console.log(icWidnowObject.sessionManager.sessionData);
  //     setPrincipal("2vxsx-fae");
  //     // backend call for checking if identity has 2fa enabled (if yes -> call handleSubmitAuthCode)
  //     localStorage.setItem("principal", "2vxsx-fae");
  //     localStorage.setItem("address", account);
  //     console.log(agent);
  //     setAgent(agent);
  //     connectAddress();
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  const handleSubmitAuthCode = async () => {
    if (!tfaToken) return;
    setLoading(true);
    try {
      if (!authClient) {
        return;
      }
      const identity = authClient.getIdentity();
      const principal = identity.getPrincipal().toText();
      const { data: two_factor_auth, error } = await get_2FA_data();
      const totp = new TOTP({
        algorithm: "SHA1",
        digits: 6,
        issuer: "ICPSig",
        label: principal,
        period: 30,
        secret: two_factor_auth.base32_secret,
      });

      const isValidToken =
        totp.validate({
          token: String(authCode).replaceAll(/\s/g, ""),
          window: 1,
        }) !== null;
      if (!isValidToken) {
        queueNotification({
          header: "Failed",
          message: "Error in validation",
          status: NotificationStatus.ERROR,
        });
        setLoading(false);
        return;
      }
      setPrincipal(principal);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!agent) {
      return;
    }
    checkTwoFA();
  }, [agent, save_2FA_data]);

  return (
    <div className="rounded-xl flex flex-col items-center justify-center min-h-[400px] bg-bg-main">
      <img
        src={ConnectWalletImg}
        alt="Wallet"
        height={120}
        width={120}
        className="mb-4 mt-1"
      />
      <>
        {tfaToken ? (
          <>
            <h2 className="text-lg text-white font-semibold">
              Two Factor Authentication
            </h2>
            <p className="text-sm text-white">
              Please open the two-step verification app or extension and input
              the authentication code for your Polkassembly account.
            </p>

            <div className="mt-5">
              <label
                htmlFor="authCode"
                className="text-primary font-normal text-xs leading-[13px] block mb-[5px]"
              >
                Auth Code
              </label>
              <Form.Item
                name="authcode"
                rules={[
                  {
                    message: "Required",
                    required: true,
                  },
                ]}
                className="border-0 outline-0 my-0 p-0"
              >
                <Input
                  placeholder="######"
                  className="text-sm font-normal m-0 leading-[15px] border-0 outline-0 p-3 placeholder:text-[#505050] bg-bg-secondary rounded-lg text-white"
                  id="authCode"
                  onChange={(e) => setAuthCode(Number(e.target.value))}
                  value={authCode}
                  disabled={loading}
                  maxLength={6}
                />
              </Form.Item>
              <Button
                disabled={!authCode || Number.isNaN(authCode)}
                loading={loading}
                onClick={handleSubmitAuthCode}
                className={`mt-[25px] text-sm border-none outline-none flex items-center justify-center bg-primary text-white max-w-[320px] w-full`}
              >
                Login
              </Button>
            </div>
            {tokenExpired && (
              <section className="mt-4 text-xs w-full text-waiting bg-waiting bg-opacity-10 p-2.5 rounded-lg font-normal flex items-center gap-x-2 max-w-[380px]">
                <WarningCircleIcon />
                <p>Request session expired, please go back and login again.</p>
              </section>
            )}
            <Button
              icon={<ArrowLeftOutlined />}
              disabled={loading}
              onClick={() => {
                setTfaToken("");
                setTokenExpired(false);
              }}
              className="mt-[25px] text-sm border-none outline-none flex items-center justify-center text-primary p-0"
            >
              Go Back
            </Button>
          </>
        ) : (
          <>
            <h2 className="font-bold text-lg text-white">Get Started</h2>
            <p className="mt-[10px]  text-normal text-sm text-white">
              Connect your wallet
            </p>
            <p className="text-text_secondary text-sm font-normal mt-[20px] mb-2">
              Your first step towards creating a safe & secure MultiSig
            </p>
            <div className="flex mt-10 gap-5">
              <Button
                loading={loading}
                onClick={handleLoginByInternetIdentity}
                className={`mt-[25px] text-sm border-none outline-none flex items-center justify-center bg-primary text-white
              max-w-[320px] w-full`}
              >
                Sign In by internet identity
              </Button>
              {/* <Button
                onClick={handleLoginByPlug}
                loading={loading}
                className={
                  "mt-[25px] text-sm border-none outline-none flex items-center justify-center bg-primary text-white"
                }
              >
                Sign In by plug wallet
              </Button> */}
            </div>
          </>
        )}
      </>
    </div>
  );
};

export default ConnectWallet;
