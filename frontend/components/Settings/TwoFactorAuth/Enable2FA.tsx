// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { Button, Form, Input, Modal, QRCode } from "antd";
import React, { useState } from "react";
import { useGlobalUserDetailsContext } from "@frontend/context/UserDetailsContext";
import {
  IGenerate2FAResponse,
  IUser,
  NotificationStatus,
} from "@frontend/types";
import {
  CopyIcon,
  OutlineCloseIcon,
  PasswordFilledIcon,
  PasswordOutlinedIcon,
} from "@frontend/ui-components/CustomIcons";
import Loader from "@frontend/ui-components/Loader";
import queueNotification from "@frontend/ui-components/QueueNotification";
import copyText from "@frontend/utils/copyText";

import CancelBtn from "../CancelBtn";
import ModalBtn from "../ModalBtn";
import { FIREBASE_FUNCTIONS_URL } from "@frontend/global/firebaseFunctionsUrl";
import { generateBitcoinAddress } from "@frontend/utils/generateBitcoinAddress";
import { icp_vault } from "src/declarations/icp_vault";
import { icpsig_backend } from "@frontend/services/icp_backend";
import axios from "axios";

const Enable2FA = ({ className }: { className?: string }) => {
  const [loading, setLoading] = useState<boolean>(false);

  const [qrCodeLoading, setQrCodeLoading] = useState<boolean>(false);

  const { two_factor_auth, address, setUserDetailsContextState } =
    useGlobalUserDetailsContext();
  const [showModal, setShowModal] = useState<boolean>(false);

  const [tFaSecret, setTFaSecret] = useState<IGenerate2FAResponse>();

  const [authCode, setAuthCode] = useState<number>();

  const fetch2FASecret = async () => {
    // don't submit if loading or if user is already 2FA enabled
    if (loading || !address || two_factor_auth?.enabled) return;
    setQrCodeLoading(true);
    setTimeout(() => {
      const { data: generate2FaData, error: generate2FaError } = {
        data: {
          base32_secret: "QJJLNSRRBZUPLEGJI4J7Q6T3",
          url: "otpauth://totp/Polkassembly:13316?issuer=Polkassembly&secret=QJJLNSRRBZUPLEGJI4J7Q6T3&algorithm=SHA1&digits=6&period=30",
        },
        error: null,
      };
      // const { data: generate2FaData, error: generate2FaError } = await (
      //   await fetch(`${FIREBASE_FUNCTIONS_URL}/api/2fa/generate2FASecret`)
      // ).json()

      console.log(generate2FaData);
      if (
        generate2FaError ||
        !generate2FaData ||
        !generate2FaData.base32_secret ||
        !generate2FaData.url
      ) {
        queueNotification({
          header: "Failed!",
          message: generate2FaError,
          status: NotificationStatus.ERROR,
        });
        console.error("2FA error : ", generate2FaError);
        return;
      }

      setTFaSecret(generate2FaData);
      setQrCodeLoading(false);
    }, 2500);
  };

  const handleModalOpen = async () => {
    setShowModal(true);
    await fetch2FASecret();
  };

  const handleVerifyTFA = async () => {
    // don't submit if loading or if user is already 2FA enabled
    if (loading || !address || two_factor_auth?.enabled) return;

    setLoading(true);
    try {
      if (!authCode || Number.isNaN(authCode))
        throw new Error("Please input a valid auth code");

      setTimeout(() => {
        const { data: verify2FAData, error: verify2FAError } = {
          data: {
            two_factor_auth:
              "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZGRyZXNzZXMiOlsiNUZxQjllVjNDNFRGMmo0NmJhb2VxbXo5OHJXQ3pFY3E0dGQxMURBMlpRSjFiN04zIl0sImRlZmF1bHRfYWRkcmVzcyI6IjVGcUI5ZVYzQzRURjJqNDZiYW9lcW16OThyV0N6RWNxNHRkMTFEQTJaUUoxYjdOMyIsImVtYWlsIjoiIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJpYXQiOjE3MDc5NTU0NTYsImlkIjoxMzMxNiwicm9sZXMiOnsiYWxsb3dlZFJvbGVzIjpbInVzZXIiXSwiY3VycmVudFJvbGUiOiJ1c2VyIn0sInN1YiI6IjEzMzE2IiwidXNlcm5hbWUiOiJBbGVlbV9BbGFtIiwid2ViM3NpZ251cCI6dHJ1ZSwiaXMyRkFFbmFibGVkIjp0cnVlLCJleHAiOjE3MTY1OTU0NTZ9.d8jBR_3UIO6AbeshcZ2caF0afUN9z3Geov46BjYIePqFQdfqXe54CUO3n7V1_sQT-KGep3aq2JpNpnt_8OICS8upAh5YJPDpZF_ZZuaCE7w007UI0StMgK8GJGH8KJ8IJl0q-6W1v4U3QliwlYR9UGw-QGKSnE53JPEuafL6s4SvyVaTPXJX5A7wF4n2AzXyEL8XthCsGhF0eUOCjlyPotquwgxZGkjcybUlwD60Gx725fOoiC4yJq9JHIC7ZHoQ6UK9YFjNlhugBGCaLU1cPH81oxIfvCxvS2AMLEE0Bc9e2-l4R1Ow6zOSX_XwW7DHGhmwZYewQvirQa1OHK4PKA",
          },
          error: null,
        };

        if (verify2FAError || !verify2FAData) {
          setLoading(false);
          queueNotification({
            header: "Failed",
            message: verify2FAError,
            status: NotificationStatus.ERROR,
          });
          return;
        }

        setUserDetailsContextState((prevState: any) => {
          return {
            ...prevState,
            two_factor_auth: verify2FAData.two_factor_auth,
          };
        });

        queueNotification({
          header: "Success",
          message: "Two factor authentication enabled successfully!",
          status: NotificationStatus.SUCCESS,
        });

        setShowModal(false);
      }, 2000);

      axios.put(`${icpsig_backend}/books/1`, { address, tfa: true });

      // send as string just in case it starts with 0
      // const { data: verify2FAData, error: verify2FAError } = await (
      //   await fetch(`api/2fa/verify2FA`)
      // ).json();
    } catch (error) {
      setLoading(false);
      queueNotification({
        header: "Failed",
        message: error,
        status: NotificationStatus.ERROR,
      });
    }
  };

  return (
    <>
      <Modal
        centered
        footer={false}
        closeIcon={
          <button
            className="outline-none border-none bg-highlight w-6 h-6 rounded-full flex items-center justify-center"
            onClick={() => setShowModal(false)}
          >
            <OutlineCloseIcon className="text-primary w-2 h-2" />
          </button>
        }
        title={
          <h3 className="text-white mb-8 text-lg font-semibold md:font-bold md:text-xl capitalize">
            Two Factor Authentication
          </h3>
        }
        open={showModal}
        className={`${className} w-auto md:min-w-[500px] scale-90`}
      >
        <section className="flex flex-col">
          {/* Instructions for Google Auth */}
          <article>
            <h2 className="text-base text-white mb-2">
              Configuring Google Authenticator
            </h2>

            <ol className="ml-4 text-white">
              <li className="mb-1">
                Install Google Authenticator (iOS/Android).
              </li>
              <li className="mb-1">
                In the authenticator app, select the &quot;+&quot; icon.
              </li>
              <li className="mb-1">
                Select &quot;Scan a QR code&quot; and use the phone&apos;s
                camera to scan this QR code.
              </li>
            </ol>
          </article>

          {qrCodeLoading ? (
            <div className="mt-2">
              <Loader />
            </div>
          ) : (
            <>
              {/* QR Code */}
              <div className="mt-3">
                <h2 className="text-base text-white">Scan the QR Code</h2>

                {tFaSecret?.url && (
                  <QRCode
                    size={200}
                    className="mx-auto"
                    errorLevel="H"
                    value={tFaSecret.url}
                    bgColor="white"
                  />
                )}
              </div>

              {/* Secret Key code */}
              <article className="mt-4">
                <h2 className="text-base text-white mb-2">
                  Or Enter the Code to Your App (base32 encoded) :
                </h2>
                {tFaSecret?.base32_secret && (
                  // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
                  <span
                    onClick={() => copyText(tFaSecret?.base32_secret)}
                    className="p-2 cursor-pointer rounded-md bg-bg-secondary text-primary border border-solid border-text_secondary"
                  >
                    <CopyIcon /> {tFaSecret.base32_secret}
                  </span>
                )}
              </article>
            </>
          )}

          {/* Code Input */}
          <div className="mt-6 mb-4">
            <h2 className="text-base text-white mb-2">Verify Code</h2>
            <p className="text-white mb-1">
              Please input the authentication code :
            </p>

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
                placeholder="Auth Code"
                className="text-sm font-normal m-0 leading-[15px] border-0 outline-0 p-3 placeholder:text-[#505050] bg-bg-secondary rounded-lg text-white"
                id="authcode"
                onChange={(e) => setAuthCode(Number(e.target.value))}
                value={authCode}
                disabled={loading || qrCodeLoading}
              />
            </Form.Item>
            <div className="flex items-center justify-between gap-x-5 mt-[30px]">
              <CancelBtn onClick={() => setShowModal(false)} />
              <ModalBtn
                loading={loading}
                disabled={!authCode || Number.isNaN(authCode) || qrCodeLoading}
                title="Enable"
                onClick={handleVerifyTFA}
              />
            </div>
          </div>
        </section>
      </Modal>
      <div className="grid grid-cols-10 bg-bg-main rounded-lg p-5 text-white">
        <div className="col-span-3 flex gap-x-2">
          <div>
            <span className="flex items-center gap-x-2 text-text_secondary">
              <PasswordOutlinedIcon />
              Two-Factor Authentication
            </span>
          </div>
        </div>
        <div className="col-span-5">
          <p className="text-text_secondary">
            Enhance account security with two factor authentication. Verify your
            identity with an extra step for added protection.
          </p>
          <Button
            onClick={handleModalOpen}
            icon={<PasswordFilledIcon />}
            className="flex items-center p-0 outline-none border-none bg-transparant text-primary"
          >
            {!two_factor_auth ? "Enable" : "Disable"} Two-Factor Authentication
          </Button>
        </div>
      </div>
    </>
  );
};

export default Enable2FA;
