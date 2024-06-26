// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { Button, Modal } from "antd";
import React, { useState } from "react";
import { useGlobalUserDetailsContext } from "@frontend/context/UserDetailsContext";
import { NotificationStatus } from "@frontend/types";
import {
  OutlineCloseIcon,
  PasswordOutlinedIcon,
} from "@frontend/ui-components/CustomIcons";
import queueNotification from "@frontend/ui-components/QueueNotification";

import CancelBtn from "../CancelBtn";
import RemoveBtn from "../RemoveBtn";
import axios from "axios";
import { icpsig_backend } from "@frontend/services/icp_backend";
import useIcpVault from "@frontend/hooks/useIcpVault";

const Disable2FA = ({ className }: { className?: string }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { save_2FA_data } = useIcpVault();

  const { setUserDetailsContextState } = useGlobalUserDetailsContext();
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleDisable2FA = async () => {
    setLoading(true);
    try {
      const { data, error } = await save_2FA_data("", "", false, false);
      if (error) {
        setLoading(false);
        queueNotification({
          header: "Failed",
          message: error,
          status: NotificationStatus.ERROR,
        });
        return;
      }
      setTimeout(() => {
        setUserDetailsContextState((prevState) => {
          return {
            ...prevState,
            two_factor_auth: data,
          };
        });
        queueNotification({
          header: "Success",
          message: "Two factor authentication disabled!",
          status: NotificationStatus.SUCCESS,
        });
        setLoading(false);
      }, 2000);

      setShowModal(false);
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
            Disable Two Factor Authentication
          </h3>
        }
        open={showModal}
        className={`${className} w-auto md:min-w-[500px] scale-90`}
      >
        <section className="flex flex-col text-white">
          <h2 className="text-base mb-3">
            Are you sure you want to disable two factor authentication?
          </h2>
          <p>
            Note: Please remember to remove the auth account from your
            authenticator app too
          </p>
          <div className="flex items-center justify-between gap-x-5 mt-[30px]">
            <RemoveBtn
              loading={loading}
              title="Disable"
              onClick={handleDisable2FA}
            />
            <CancelBtn onClick={() => setShowModal(false)} />
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
            Disabling two-factor authentication may compromise the security of
            your account.
          </p>
          <Button
            onClick={() => setShowModal(true)}
            className="flex items-center p-0 outline-none border-none bg-transparant text-primary"
          >
            Disable Two-Factor Authentication
          </Button>
        </div>
      </div>
    </>
  );
};

export default Disable2FA;
