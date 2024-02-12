// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { ArrowLeftOutlined } from "@ant-design/icons"
import { Button, Form, Input } from "antd"
import React, { useCallback, useEffect, useState } from "react"
import ConnectWalletImg from "@frontend/assets/connect-wallet.svg"
import { useGlobalIdentityContext } from "@frontend/context/IdentityProviderContext"
import { useGlobalUserDetailsContext } from "@frontend/context/UserDetailsContext"
import { firebaseFunctionsHeader } from "@frontend/global/firebaseFunctionsHeader"
import { FIREBASE_FUNCTIONS_URL } from "@frontend/global/firebaseFunctionsUrl"
import { IUser } from "@frontend/types"
import { WarningCircleIcon } from "@frontend/ui-components/CustomIcons"

const ConnectWallet = () => {
  const { identity, login, setAccounts, account, setPrinciple } =
    useGlobalIdentityContext()
  const [loading, setLoading] = useState<boolean>(false)
  const { connectAddress } = useGlobalUserDetailsContext()
  const [tfaToken, setTfaToken] = useState<string>("")
  const [authCode, setAuthCode] = useState<number>()
  const [tokenExpired, setTokenExpired] = useState<boolean>(false)

  const handlePolkasafeLogin = async () => {
    const res = await fetch(`${FIREBASE_FUNCTIONS_URL}/login`, {
      body: JSON.stringify({ account }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    })
    const { token } = await res.json()
  }

  const handleLogin = useCallback(async () => {
    try {
      setLoading(true)
      if (!identity) {
        login()
        setLoading(false)
        return
      }
      handlePlugLogin()
    } catch (err) {
      console.log(err)
    }
    setLoading(false)
  }, [])

  const handlePlugLogin = async () => {
    //@ts-ignore
    const icWidnowObject = window.ic.plug
    if (icWidnowObject?.sessionManager?.sessionData) {
      return
    }
    const whitelist = identity.whitelist
    const host = "https://mainnet.dfinity.network"
    //@ts-ignore
    const onConnectionUpdate = async () => {}

    try {
      await icWidnowObject.requestConnect({
        whitelist,
        host,
        onConnectionUpdate,
        timeout: 100000,
      })
      const principal = icWidnowObject.sessionManager.sessionData.principalId
      const account = icWidnowObject.sessionManager.sessionData.accountId

      setPrinciple(principal)
      setAccounts(account)
      // backend call for checking if identity has 2fa enabled (if yes -> call handleSubmitAuthCode)
      localStorage.setItem("address", account)
      connectAddress()
    } catch (e) {
      console.log(e)
    }
  }

  const handleSubmitAuthCode = async () => {
    if (!tfaToken) return

    setLoading(true)
    try {
      // api call for validate 2fa auth code from authenticator app
      const { data: token, error: validate2FAError } = await (
        await fetch(`api/2fa/validate2FA`, {
          headers: {
            authCode: JSON.stringify(authCode),
            tfa_token: tfaToken,
          },
          body: JSON.stringify({ address: "" }),
        })
      ).json()

      if (validate2FAError) {
        if (validate2FAError === "2FA token expired.") {
          setTokenExpired(true)
        }
        setLoading(false)
      }

      if (!validate2FAError && token) {
        handlePlugLogin()
      }
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

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
                setTfaToken("")
                setTokenExpired(false)
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
            {identity ? (
              <div className="mt-[20px]">
                <Button
                  loading={loading}
                  onClick={handlePlugLogin}
                  className={`mt-[25px] text-sm border-none outline-none flex items-center justify-center bg-primary text-white
              max-w-[320px] w-full`}
                >
                  Sign In
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleLogin}
                loading={loading}
                className={
                  "mt-[25px] text-sm border-none outline-none flex items-center justify-center bg-primary text-white"
                }
              >
                Connect
              </Button>
            )}
          </>
        )}
      </>
    </div>
  )
}

export default ConnectWallet
