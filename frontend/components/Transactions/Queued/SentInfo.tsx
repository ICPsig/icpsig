// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { Button, Collapse, Divider, Modal, Spin, Timeline } from "antd";
import classNames from "classnames";
import dayjs from "dayjs";
import React, { FC, useEffect, useState } from "react";
import CancelBtn from "@frontend/components/Multisig/CancelBtn";
import RemoveBtn from "@frontend/components/Settings/RemoveBtn";
import { useModalContext } from "@frontend/context/ModalContext";
import { useGlobalUserDetailsContext } from "@frontend/context/UserDetailsContext";
import { chainProperties } from "@frontend/global/networkConstants";
import { ITxNotification } from "@frontend/types";
import AddressComponent from "@frontend/ui-components/AddressComponent";
import {
  ArrowRightIcon,
  CircleCheckIcon,
  CirclePlusIcon,
  CircleWatchIcon,
  CopyIcon,
  EditIcon,
  OutlineCloseIcon,
} from "@frontend/ui-components/CustomIcons";
import copyText from "@frontend/utils/copyText";
import shortenAddress from "@frontend/utils/shortenAddress";
import styled from "styled-components";

interface ISentInfoProps {
  amount: string | string[];
  transactionFields?: {
    category: string;
    subfields: { [subfield: string]: { name: string; value: string } };
  };
  date: Date;
  // time: string;
  loading: boolean;
  addressAddOrRemove?: string;
  approvals: string[];
  threshold: number;
  className?: string;
  callHash: string;
  callData: string;
  callDataString: string;
  recipientAddress?: string | string[];
  setCallDataString: React.Dispatch<React.SetStateAction<string>>;
  handleApproveTransaction: () => Promise<void>;
  handleCancelTransaction: () => Promise<void>;
  note: string;
  isProxyApproval: boolean;
  isProxyAddApproval: boolean;
  delegate_id?: string;
  isProxyRemovalApproval?: boolean;
  notifications?: ITxNotification;
  getMultiDataLoading?: boolean;
  txType?: string;
  transactionDetailsLoading: boolean;
}

const SentInfo: FC<ISentInfoProps> = ({
  amount,
  addressAddOrRemove,
  transactionFields,
  className,
  callData,
  callDataString,
  callHash,
  recipientAddress,
  date,
  approvals,
  loading,
  threshold,
  handleApproveTransaction,
  handleCancelTransaction,
  txType,
  note,
  transactionDetailsLoading,
}) => {
  const {
    address: userAddress,
    multisigAddresses,
    activeMultisig,
  } = useGlobalUserDetailsContext();
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [openCancelModal, setOpenCancelModal] = useState<boolean>(false);
  const [updatedNote, setUpdatedNote] = useState(note);
  const { openModal } = useModalContext();

  useEffect(() => {
    setUpdatedNote(note);
  }, [note]);

  const depositor = approvals[0];

  const activeMultisigObject = multisigAddresses?.find(
    (item: any) => item.address === activeMultisig,
  );

  const CancelTransaction: FC = () => {
    return (
      <Modal
        centered
        footer={false}
        closeIcon={
          <button
            className="outline-none border-none bg-highlight w-6 h-6 rounded-full flex items-center justify-center"
            onClick={() => setOpenCancelModal(false)}
          >
            <OutlineCloseIcon className="text-primary w-2 h-2" />
          </button>
        }
        title={
          <h3 className="text-white mb-8 text-lg font-semibold md:font-bold md:text-xl">
            Cancel Transaction
          </h3>
        }
        open={openCancelModal}
        className={" w-auto md:min-w-[500px] scale-90"}
      >
        <div className="flex flex-col h-full">
          <div className="text-white">
            Are you sure you want to cancel the Transaction?
          </div>
          <div className="flex items-center justify-between mt-[40px]">
            <CancelBtn title="No" onClick={() => setOpenCancelModal(false)} />
            <RemoveBtn
              title="Yes, Cancel"
              loading={loading}
              onClick={() => {
                handleCancelTransaction();
                setOpenCancelModal(false);
              }}
            />
          </div>
        </div>
      </Modal>
    );
  };

  return (
    <div className={classNames("flex gap-x-4", className)}>
      <CancelTransaction />
      <article className="p-4 rounded-lg bg-bg-main flex-1">
        {!(txType === "addOwnerWithThreshold" || txType === "removeOwner") &&
          recipientAddress &&
          amount && (
            <>
              {typeof recipientAddress === "string" ? (
                <>
                  <p className="flex items-center gap-x-1 text-white font-medium text-sm leading-[15px]">
                    <span>Send</span>
                    <span className="text-failure">{amount} </span>
                    <span>To:</span>
                  </p>
                  <div className="mt-3">
                    <AddressComponent address={recipientAddress} />
                  </div>
                </>
              ) : (
                <div className="flex flex-col gap-y-1">
                  {Array.isArray(recipientAddress) &&
                    recipientAddress.map((item, i) => (
                      <>
                        <p className="flex items-center gap-x-1 text-white font-medium text-sm leading-[15px]">
                          <span>Send</span>
                          <span className="text-failure">{amount[i]} </span>
                          <span>To:</span>
                        </p>
                        <div className="mt-3">
                          <AddressComponent address={item} />
                        </div>
                        {recipientAddress.length - 1 !== i && (
                          <Divider className="bg-text_secondary mt-1" />
                        )}
                      </>
                    ))}
                </div>
              )}
            </>
          )}
        {/* {!callData &&
					<Input size='large' placeholder='Enter Call Data.' className='w-full my-2 text-sm font-normal leading-[15px] border-0 outline-0 placeholder:text-[#505050] bg-bg-secondary rounded-md text-white' onChange={(e) => setCallDataString(e.target.value)} />
				} */}
        {!(txType === "addOwnerWithThreshold" || txType === "removeOwner") && (
          <Divider className="bg-text_secondary my-5" />
        )}
        <div className="flex items-center gap-x-5 mt-3 justify-between">
          <span className="text-text_secondary font-normal text-sm leading-[15px]">
            Created at:
          </span>
          <p className="flex items-center gap-x-3 font-normal text-xs leading-[13px] text-text_secondary">
            <span className="text-white font-normal text-sm leading-[15px]">
              {dayjs(date).format("llll")}
            </span>
          </p>
        </div>
        {addressAddOrRemove && (
          <div className="flex items-center gap-x-5 mt-3 justify-between">
            <span className="text-text_secondary font-normal text-sm leading-[15px]">
              {txType === "addOwnerWithThreshold"
                ? "Adding Owner"
                : "Removing Owner"}
              :
            </span>
            <p className="flex items-center gap-x-3 font-normal text-xs leading-[13px] text-text_secondary">
              <AddressComponent address={addressAddOrRemove} />
            </p>
          </div>
        )}
        {showDetails && (
          <>
            {/* <div className='flex items-center gap-x-5 mt-3 justify-between'>
							<span className='text-text_secondary font-normal text-sm leading-[15px]'>
								Created By:
							</span>
							<p className='flex items-center gap-x-3 font-normal text-xs leading-[13px] text-text_secondary'>
								<span className='text-white font-normal text-sm leading-[15px]'>
									<div className='mt-3 flex items-center gap-x-4'>
										{recipientAddress && (
											<MetaMaskAvatar address={recipientAddress} size={30} />
										)}
										<div className='flex flex-col gap-y-[6px]'>
											<p className='font-medium text-sm leading-[15px] text-white'>
												{recipientAddress
													? addressBook?.find(
														(item: any) => item.address === recipientAddress
													)?.name || DEFAULT_ADDRESS_NAME
													: '?'}
											</p>
											{recipientAddress && (
												<p className='flex items-center gap-x-3 font-normal text-xs leading-[13px] text-text_secondary'>
													<span>{shortenAddress(recipientAddress)}</span>
													<span className='flex items-center gap-x-2 text-sm'>
														<button onClick={() => copyText(recipientAddress)}>
															<CopyIcon className='hover:text-primary' />
														</button>
														<a
															href={`https://${network}.subscan.io/account/${recipientAddress}`}
															target='_blank'
															rel='noreferrer'
														>
															<ExternalLinkIcon />
														</a>
													</span>
												</p>
											)}
										</div>
									</div>
								</span>
							</p>
						</div> */}
            <div className="flex items-center gap-x-5 mt-3 justify-between">
              <span className="text-text_secondary font-normal text-sm leading-[15px]">
                Txn Hash:
              </span>
              <p className="flex items-center gap-x-3 font-normal text-xs leading-[13px] text-text_secondary">
                <span className="text-white font-normal text-sm leading-[15px]">
                  {shortenAddress(callHash, 10)}
                </span>
                <span className="flex items-center gap-x-2 text-sm">
                  <button onClick={() => copyText(callHash)}>
                    <CopyIcon className="hover:text-primary" />
                  </button>
                  {/* <ExternalLinkIcon /> */}
                </span>
              </p>
            </div>
            {callData && (
              <div className="flex items-center gap-x-5 mt-3 justify-between">
                <span className="text-text_secondary font-normal text-sm leading-[15px]">
                  Call Data:
                </span>
                <p className="flex items-center gap-x-3 font-normal text-xs leading-[13px] text-text_secondary">
                  <span className="text-white font-normal text-sm leading-[15px]">
                    {shortenAddress(callData, 10)}
                  </span>
                  <span className="flex items-center gap-x-2 text-sm">
                    <button onClick={() => copyText(callData)}>
                      <CopyIcon className="hover:text-primary" />
                    </button>
                  </span>
                </p>
              </div>
            )}
          </>
        )}
        <p
          onClick={() => setShowDetails((prev) => !prev)}
          className="text-primary cursor-pointer font-medium text-sm leading-[15px] mt-5 flex items-center gap-x-3"
        >
          <span>{showDetails ? "Hide" : "Advanced"} Details</span>
          <ArrowRightIcon />
        </p>
      </article>
      <article className="p-8 rounded-lg bg-bg-main max-w-[328px] w-full">
        <div>
          <Timeline className="">
            <Timeline.Item
              dot={
                <span className="bg-success bg-opacity-10 flex items-center justify-center p-1 rounded-md h-6 w-6">
                  <CirclePlusIcon className="text-success text-sm" />
                </span>
              }
              className="success"
            >
              <div className="text-white font-normal text-sm leading-[15px]">
                Created
              </div>
            </Timeline.Item>
            <Timeline.Item
              dot={
                <span className="bg-success bg-opacity-10 flex items-center justify-center p-1 rounded-md h-6 w-6">
                  <CircleCheckIcon className="text-success text-sm" />
                </span>
              }
              className="success"
            >
              <div className="text-white font-normal text-sm leading-[15px]">
                Confirmations
                <span className="text-text_secondary">
                  {approvals.length} of {threshold}
                </span>
              </div>
            </Timeline.Item>
            <Timeline.Item
              dot={
                <span className="bg-waiting bg-opacity-10 flex items-center justify-center p-1 rounded-md h-6 w-6">
                  <CircleWatchIcon className="text-waiting text-sm" />
                </span>
              }
              className="warning"
            >
              <Collapse bordered={false}>
                <Collapse.Panel
                  showArrow={false}
                  key={1}
                  header={
                    <span className="text-primary font-normal text-sm leading-[15px] px-3 py-2 rounded-md bg-highlight">
                      Show All Confirmations
                    </span>
                  }
                >
                  <Timeline>
                    {approvals.map((address, i) => (
                      <Timeline.Item
                        key={i}
                        dot={
                          <span className="bg-success bg-opacity-10 flex items-center justify-center p-1 rounded-md h-6 w-6">
                            <CircleCheckIcon className="text-success text-sm" />
                          </span>
                        }
                        className={`${
                          i == 0 && "mt-4"
                        } success bg-transaparent`}
                      >
                        <div className="mb-3 flex items-center gap-x-4">
                          <AddressComponent address={address} />
                        </div>
                      </Timeline.Item>
                    ))}

                    {activeMultisigObject?.signatories
                      .filter((item: any) => !approvals.includes(item))
                      .map((address: any, i: any) => {
                        return (
                          <Timeline.Item
                            key={i}
                            dot={
                              <span className="bg-waiting bg-opacity-10 flex items-center justify-center p-1 rounded-md h-6 w-6">
                                <CircleWatchIcon className="text-waiting text-sm" />
                              </span>
                            }
                            className="warning bg-transaparent"
                          >
                            <div className="mb-3 flex items-center gap-x-4 relative">
                              <AddressComponent address={address} />
                            </div>
                          </Timeline.Item>
                        );
                      })}
                  </Timeline>
                </Collapse.Panel>
              </Collapse>
            </Timeline.Item>
            <Timeline.Item
              dot={
                <span className="bg-waiting bg-opacity-10 flex items-center justify-center p-1 rounded-md h-6 w-6">
                  <CircleWatchIcon className="text-waiting text-sm" />
                </span>
              }
              className="warning"
            >
              <div className="text-white font-normal text-sm leading-[15px]">
                <p>Executed</p>
                <div className="mt-2 text-text_secondary text-sm">
                  The transaction will be executed once the threshold is
                  reached.
                </div>
              </div>
            </Timeline.Item>
          </Timeline>
          <div className="w-full mt-3 flex flex-col gap-y-2 items-center">
            {/* {console.log(approvals)} */}
            {!approvals.includes(userAddress) && (
              <Button
                disabled={
                  approvals.includes(userAddress) ||
                  (approvals.length === threshold - 1 && !callDataString)
                }
                loading={loading}
                onClick={handleApproveTransaction}
                className={`w-full border-none text-sm font-normal ${
                  approvals.includes(userAddress) ||
                  (approvals.length === threshold - 1 && !callDataString)
                    ? "bg-highlight text-text_secondary"
                    : "bg-primary text-white"
                }`}
              >
                Approve Transaction
              </Button>
            )}
          </div>
        </div>
      </article>
    </div>
  );
};

export default styled(SentInfo)`
  .ant-collapse > .ant-collapse-item > .ant-collapse-header {
    padding: 4px 8px;
  }
  .ant-timeline-item-tail {
    border-inline-width: 0.5px !important;
  }
  .ant-timeline-item-last {
    padding: 0;
  }
  .ant-timeline-item:not(:first-child, :last-child) {
    margin-top: 5px;
    margin-bottom: 5px;
  }
  .ant-timeline-item-content {
    display: flex;
    min-height: 24px !important;
    height: auto !important;
    align-items: center;
  }
  .success .ant-timeline-item-tail {
    border-inline-color: #06d6a0;
  }
  .warning .ant-timeline-item-tail {
    border-inline-color: #ff9f1c;
  }
`;

// signin message hash
// linking via all address - no user input of safe address
