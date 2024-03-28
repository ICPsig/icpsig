// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Divider, Form, Input, Spin } from "antd";
import classNames from "classnames";
import React, { useState } from "react";
import LoadingLottie from "@frontend/ui-components/lottie-graphics/Loading";
import CancelBtn from "@frontend/components/Settings/CancelBtn";
import ModalBtn from "@frontend/components/Settings/ModalBtn";

import { useGlobalUserDetailsContext } from "@frontend/context/UserDetailsContext";

import AddressComponent from "@frontend/ui-components/AddressComponent";
import {
  LineIcon,
  SquareDownArrowIcon,
} from "@frontend/ui-components/CustomIcons";
import styled from "styled-components";

import TransactionFailedScreen from "./TransactionFailedScreen";
import TransactionSuccessScreen from "./TransactionSuccessScreen";
import useIcpVault from "@frontend/hooks/useIcpVault";
import { getEthFeeData, send } from "@frontend/utils/networkConstant/service";
import { FeeData } from "@ethersproject/providers";

export interface IRecipientAndAmount {
  recipient: string;
  amount: string;
}

import { BigNumber } from "@ethersproject/bignumber";
import {
  ERC20_FALLBACK_FEE,
  ETH_BASE_FEE,
} from "@frontend/utils/networkConstant/networkConstant";
import { getFeeData } from "@frontend/utils/eth/providers";
import { ETHEREUM_NETWORK_ID } from "@frontend/utils/eth/servcieTypes";
import { parseUnits } from "ethers/lib/utils";

interface ISendFundsFormProps {
  onCancel?: () => void;
  className?: string;
  setNewTxn?: React.Dispatch<React.SetStateAction<boolean>>;
  defaultSelectedAddress?: string;
  ethAddress?: string;
  tokenData?: any;
  handleClose?: () => void;
}

const SendERC20Token = ({
  className,
  onCancel,
  ethAddress,
  setNewTxn,
  tokenData,
  handleClose,
}: ISendFundsFormProps) => {
  const { activeMultisig } = useGlobalUserDetailsContext();
  const [{ loading, message }, setLoadingState] = useState({
    loading: false,
    message: null,
  });
  const [form] = Form.useForm();
  const [transactionData, setTransactionData] = useState(null);
  const [transactionState, setTransactionState] = useState<
    "start" | "success" | "not_start" | "failed"
  >("not_start");

  const { sign_eth_transaction } = useIcpVault();

  console.log({ tokenData });

  const handleSubmit = async () => {
    const ethFee = () => {
      return BigNumber.from(ETH_BASE_FEE);
    };
    const erc20Fee = () => {
      return BigNumber.from(ERC20_FALLBACK_FEE);
    };

    console.log(
      "Update Data",
      parseUnits(transactionData.amount, tokenData.decimals || 18),
    );
    console.log({
      ...tokenData,
      from: ethAddress,
      to: transactionData.to,
      token: { id: ETHEREUM_NETWORK_ID },
      contract: { address: tokenData.address },
      amount: transactionData.amount,
      signTransaction: sign_eth_transaction,
    });
    const feeData: FeeData = await getFeeData();
    console.log(feeData);
    try {
      setLoadingState({ loading: true, message: "Initializing Transaction" });
      let { hash } = await send({
        ...feeData,
        ...tokenData,
        from: ethAddress,
        to: transactionData.to,
        token: {
          id: tokenData.id,
          contract: { address: tokenData.address || null },
        },
        amount: BigNumber.from(
          parseUnits(transactionData.amount, tokenData.decimals || 18),
        ),
        signTransaction: sign_eth_transaction,
        vault: activeMultisig,
        gas: tokenData.address ? erc20Fee() : ethFee(),
      });
      setTransactionState("success");
      setLoadingState({ loading: false, message: "" });
      setTransactionData((prev) => ({ ...prev, callHash: hash }));
    } catch (error) {
      console.log(error);
      setTransactionState("failed");
      setLoadingState({ loading: false, message: "" });
    }
  };
  console.log({ transactionData });

  return (
    <>
      {transactionState === "success" ? (
        <TransactionSuccessScreen
          successMessage="Transaction in Progress!"
          waitMessage="All Threshold Signatories need to Approve the Transaction."
          amount={transactionData?.amount || ""}
          txnHash={transactionData?.callHash}
          created_at={transactionData?.created_at || new Date()}
          sender={ethAddress}
          recipients={[transactionData?.to || ""]}
          onDone={handleClose}
        />
      ) : transactionState === "failed" ? (
        <TransactionFailedScreen
          onDone={handleClose}
          txnHash={transactionData?.callHash || ""}
          sender={ethAddress}
          failedMessage="Oh no! Something went wrong."
          waitMessage="Your transaction has failed due to some technical error. Please try again...Details of the transaction are included below"
          created_at={new Date()}
        />
      ) : (
        <Spin
          wrapperClassName={className}
          spinning={loading}
          indicator={<LoadingLottie message={message} />}
        >
          <Form
            className={classNames("max-h-[68vh] overflow-y-auto px-2")}
            form={form}
            validateMessages={{ required: "Please add the '${name}'" }}
          >
            <section>
              <p className="text-primary font-normal text-xs leading-[13px]">
                Sending ERC20 from
              </p>
              <div className="flex items-center gap-x-[10px] mt-[14px]">
                <article className="w-[500px] p-[10px] border-2 border-dashed border-bg-secondary rounded-lg flex items-center justify-between">
                  <AddressComponent withBadge={false} address={ethAddress} />
                  <span className="text-white">
                    {tokenData.balance || 0.0} {tokenData.symbol}
                  </span>
                </article>
                <article className="w-[412px] flex items-center">
                  <span className="-mr-1.5 z-0">
                    <LineIcon className="text-5xl" />
                  </span>
                  <p className="p-3 bg-bg-secondary rounded-xl font-normal text-sm text-text_secondary leading-[15.23px]">
                    The transferred balance will be subtracted (along with fees)
                    from the sender account.
                  </p>
                </article>
              </div>
              <div className="w-[500px]">
                <Divider className="border-[#505050]">
                  <SquareDownArrowIcon />
                </Divider>
              </div>
            </section>

            <section className="">
              <div className="flex items-start gap-x-[10px]">
                <div>
                  <div className="flex flex-col gap-y-3 mb-2">
                    <article className="w-[500px] flex items-start gap-x-2">
                      <div className="w-[65%]">
                        <label className="text-primary font-normal text-xs leading-[13px] block mb-[5px]">
                          Recipient*
                          <Form.Item
                            name="recipient"
                            rules={[{ required: true }]}
                            help={"Recipient Address is Required"}
                            className="border-0 outline-0 my-0 p-0"
                          >
                            <div className="h-[50px]">
                              <Input
                                placeholder={
                                  "Enter ERC20 Address (starts with 0x)"
                                }
                                className="w-full text-sm font-normal leading-[15px] border-0 outline-0 p-3 placeholder:text-[#505050] bg-bg-secondary rounded-lg text-white pr-24 resize-none"
                                value={transactionData?.to || ""}
                                onChange={(e) =>
                                  setTransactionData((prev) => ({
                                    ...prev,
                                    to: e.target.value,
                                  }))
                                }
                              />
                            </div>
                          </Form.Item>
                        </label>
                      </div>
                      <div className={`flex items-center gap-x-2 w-[35%]`}>
                        <label className="text-primary font-normal text-xs leading-[13px] block mb-[5px]">
                          Amount*
                          <Form.Item
                            name="Amount"
                            rules={[{ required: true }]}
                            help={"Amount Address is Required"}
                            className="border-0 outline-0 my-0 p-0"
                          >
                            <div className="h-[50px]">
                              <Input
                                placeholder={"Enter Principal ID"}
                                className="w-full text-sm font-normal leading-[15px] border-0 outline-0 p-3 placeholder:text-[#505050] bg-bg-secondary rounded-lg text-white pr-24 resize-none"
                                value={transactionData?.amount || ""}
                                onChange={(e) =>
                                  setTransactionData((prev) => ({
                                    ...prev,
                                    amount: e.target.value,
                                  }))
                                }
                              />
                            </div>
                          </Form.Item>
                        </label>
                      </div>
                    </article>
                  </div>
                </div>
                <div className="flex flex-col gap-y-4">
                  <article className="w-[412px] flex items-center">
                    <span className="-mr-1.5 z-0">
                      <LineIcon className="text-5xl" />
                    </span>
                    <p className="p-3 bg-bg-secondary rounded-xl font-normal text-sm text-text_secondary leading-[15.23px]">
                      The beneficiary will have access to the transferred fees
                      (Standard gas) when the transaction is included in a
                      block.
                    </p>
                  </article>
                </div>
              </div>
            </section>
          </Form>
          <section className="flex items-center gap-x-5 justify-center mt-10">
            <CancelBtn className="w-[250px]" onClick={onCancel} />
            <ModalBtn
              disabled={
                !Number(transactionData?.amount) ||
                !transactionData?.to ||
                transactionData?.to === "" ||
                !transactionData?.amount ||
                Number(transactionData?.amount) <= 0 ||
                Number(transactionData?.amount) >= Number(tokenData.balance)
              }
              loading={loading}
              onClick={handleSubmit}
              className="w-[250px]"
              title="Make Transaction"
            />
          </section>
        </Spin>
      )}
    </>
  );
};

export default styled(SendERC20Token)`
  .ant-select input {
    font-size: 14px !important;
    font-style: normal !important;
    line-height: 15px !important;
    border: 0 !important;
    outline: 0 !important;
    background-color: #24272e !important;
    border-radius: 8px !important;
    color: white !important;
    padding: 12px !important;
    display: block !important;
    height: 100% !important;
  }
  .ant-select-selector {
    border: none !important;
    height: 50px !important;
    box-shadow: none !important;
  }

  .ant-select {
    height: 50px !important;
  }
  .ant-select-selection-search {
    inset: 0 !important;
  }
  .ant-select-selection-placeholder {
    color: #505050 !important;
    z-index: 100;
    display: flex !important;
    align-items: center !important;
  }

  .ant-skeleton
    .ant-skeleton-content
    .ant-skeleton-title
    + .ant-skeleton-paragraph {
    margin-block-start: 8px !important;
  }

  .ant-dropdown {
    transform: scale(0.9) !important;
    transform-origin: center !important;
  }
`;
