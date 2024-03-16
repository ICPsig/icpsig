// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { PlusCircleOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import { Spin } from "antd";
import React, { FC, useEffect, useState } from "react";
import astarLogo from "@frontend/assets/icp-logo.png";
import { useModalContext } from "@frontend/context/ModalContext";
import { useGlobalUserDetailsContext } from "@frontend/context/UserDetailsContext";
// import AddressQr from "@frontend/ui-components/AddressQr";
import {
  CopyIcon,
  OutlineCloseIcon,
  QRIcon,
} from "@frontend/ui-components/CustomIcons";
import PrimaryButton from "@frontend/ui-components/PrimaryButton";
import copyText from "@frontend/utils/copyText";
import shortenAddress from "@frontend/utils/shortenAddress";
import styled from "styled-components";

import FundMultisig from "../SendFunds/FundMultisig";
import SendFundsForm from "../SendFunds/SendFundsForm";
import Avatar from "../Avatar/Avatar";
import useIcpVault from "@frontend/hooks/useIcpVault";
import convertE8sToNumber from "@frontend/utils/convertE8sToNumber";
import Loader from "@frontend/ui-components/Loader";
import { encodePrincipalToEthAddress } from '@dfinity/cketh';
import { useGlobalIdentityContext } from "@frontend/context/IdentityProviderContext";

interface IDashboardCard {
  className?: string;
  hasProxy: boolean;
  setNewTxn: React.Dispatch<React.SetStateAction<boolean>>;
  transactionLoading: boolean;
  openTransactionModal: boolean;
  setOpenTransactionModal: React.Dispatch<React.SetStateAction<boolean>>;
  isOnchain: boolean;
}

const DashboardCard = ({
  className,
  setNewTxn,
  transactionLoading,
  openTransactionModal,
  setOpenTransactionModal,
}: IDashboardCard) => {
  const { activeMultisig, multisigAddresses } = useGlobalUserDetailsContext();
  const {principal} = useGlobalIdentityContext()
  const [openFundMultisigModal, setOpenFundMultisigModal] = useState(false);
  const { get_multisig_balance } = useIcpVault();
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState<{ icp: string; ckbtc: string }>({
    icp: "0",
    ckbtc: "0",
  });

  const currentMultisig = multisigAddresses?.find(
    (item) => item.address === activeMultisig,
  );

  const fetchEthBalance = async (address: string) => {
    try {
      setLoading(true);
      const { data, error } = await get_multisig_balance(activeMultisig);
      if (data && !error) {
        setBalance({
          icp: convertE8sToNumber(data.icp || 0),
          ckbtc: convertE8sToNumber(data.ckbtc || 0),
        });
      }
      setLoading(false);
    } catch (err) {
      console.log("Err from fetchEthBalance", err);
    }
  };

  const generateEthAddress = ()=>{
    console.log(encodePrincipalToEthAddress(principal))
  }

  useEffect(() => {
    if (activeMultisig) fetchEthBalance(activeMultisig);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeMultisig]);

  const TransactionModal: FC = () => {
    return (
      <>
        <PrimaryButton
          icon={<PlusCircleOutlined />}
          onClick={() => setOpenTransactionModal(true)}
          loading={transactionLoading}
          className="w-[45%] flex items-center justify-center py-4 2xl:py-5 bg-primary text-white"
        >
          New Transaction
        </PrimaryButton>
        <Modal
          centered
          footer={false}
          closeIcon={
            <button
              className="outline-none border-none bg-highlight w-6 h-6 rounded-full flex items-center justify-center z-100"
              onClick={() => {
                setOpenTransactionModal(false);
                setNewTxn((prev) => !prev);
              }}
            >
              <OutlineCloseIcon className="text-primary w-2 h-2" />
            </button>
          }
          title={
            <h3 className="text-white mb-8 text-lg font-semibold">
              Send Funds
            </h3>
          }
          open={openTransactionModal}
          className={`${className} w-auto md:min-w-[500px] scale-90`}
        >
          <SendFundsForm
            setNewTxn={setNewTxn}
            onCancel={() => setOpenTransactionModal(false)}
          />
        </Modal>
      </>
    );
  };

  const FundMultisigModal: FC = () => {
    return (
      <>
        <PrimaryButton
          secondary
          onClick={() => setOpenFundMultisigModal(true)}
          className="w-[45%] flex items-center justify-center py-4 2xl:py-5 "
        >
          {" "}
          Fund Multisig
        </PrimaryButton>
        <Modal
          centered
          footer={false}
          closeIcon={
            <button
              className="outline-none border-none bg-highlight w-6 h-6 rounded-full flex items-center justify-center"
              onClick={() => setOpenFundMultisigModal(false)}
            >
              <OutlineCloseIcon className="text-primary w-2 h-2" />
            </button>
          }
          title={
            <h3 className="text-white mb-2 text-lg font-semibold">
              Fund Multisig
            </h3>
          }
          open={openFundMultisigModal}
          className={`${className} w-auto md:min-w-[500px] scale-90`}
        >
          <FundMultisig
            setNewTxn={setNewTxn}
            onCancel={() => setOpenFundMultisigModal(false)}
          />
        </Modal>
      </>
    );
  };

  return (
    <>
      <h2 className="text-base font-bold text-white mb-2">Overview</h2>
      <div
        className={`${className} relative bg-bg-main flex flex-col justify-between rounded-lg p-5 shadow-lg h-[17rem] scale-90 w-[111%] origin-top-left`}
      >
        <div className="absolute right-5 top-5">
          <div className="flex gap-x-4 items-center">
            <div className="w-5" rel="noreferrer">
              <img className="w-5" src={astarLogo} alt="icon" />
            </div>
          </div>
        </div>
        <div className="w-full">
          <div className="flex gap-x-3 items-center">
            <div className="relative">
              <div className="border-2 border-primary p-1.5 rounded-full flex justify-center items-center">
                <Avatar address={currentMultisig?.address || ""} size={50} />
              </div>
              <div
                className={
                  " bg-primary text-white text-sm rounded-lg absolute -bottom-1 left-[16px] px-2"
                }
              >
                {currentMultisig?.threshold}/
                {currentMultisig?.signatories.length}
              </div>
            </div>
            <div>
              <div className="text-base font-bold text-white flex items-center gap-x-2">
                {currentMultisig?.name}
              </div>
              <div className="flex text-xs">
                <div
                  title={(activeMultisig && activeMultisig) || ""}
                  className=" font-normal text-text_secondary"
                >
                  {activeMultisig && shortenAddress(activeMultisig || "")}
                </div>
                <button
                  className="ml-2 mr-1"
                  onClick={() => copyText(activeMultisig)}
                >
                  <CopyIcon className="text-primary" />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-x-5 flex-wrap text-xs">
          <div>
            <div className="text-white">Signatories</div>
            <div className="font-bold text-lg text-primary">
              {currentMultisig?.signatories.length || 0}
            </div>
          </div>
          <div>
            <div className="text-white">ICP</div>
            <div className="font-bold text-lg text-primary">
              {loading ? (
                <Loader />
              ) : (
                <span className="text-white">{balance.icp}</span>
              )}
            </div>
          </div>
          <div>
            <div className="text-white">CKBTC</div>
            <div className="font-bold text-lg text-primary">
              {loading ? (
                <Loader />
              ) : (
                <span className="text-white">{balance.ckbtc}</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-around w-full mt-5">
          <TransactionModal />
          <FundMultisigModal />
        </div>
      </div>
    </>
  );
};

export default styled(DashboardCard)`
  .ant-spin-nested-loading .ant-spin-blur {
    opacity: 0 !important;
  }
  .ant-spin-nested-loading .ant-spin-blur::after {
    opacity: 1 !important;
  }
`;
