// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { Collapse, Divider, Spin, Timeline } from "antd"
import classNames from "classnames"
// import { ethers } from 'ethers';
import React, { FC } from "react"
import { useGlobalUserDetailsContext } from "@frontend/context/UserDetailsContext"
import { chainProperties } from "@frontend/global/networkConstants"
import AddressComponent from "@frontend/ui-components/AddressComponent"
import {
  CircleCheckIcon,
  CirclePlusIcon,
  CircleWatchIcon,
  CopyIcon,
} from "@frontend/ui-components/CustomIcons"
import copyText from "@frontend/utils/copyText"
import shortenAddress from "@frontend/utils/shortenAddress"
import styled from "styled-components"

interface ISentInfoProps {
  amount: string | string[]
  amountType: string
  approvals: string[]
  addressAddOrRemove?: string
  date: string
  // time: string;
  className?: string
  recipientAddress: string | string[]
  callHash: string
  note?: string
  loading?: boolean
  amount_usd: number
  from: string
  txType?: string
  transactionFields?: {
    category: string
    subfields: { [subfield: string]: { name: string; value: string } }
  }
}

const SentInfo: FC<ISentInfoProps> = ({
  approvals,
  amount,
  from,
  className,
  date,
  recipientAddress,
  callHash,
  note,
  loading,
  txType,
  addressAddOrRemove,
  transactionFields,
}) => {
  const { activeMultisig, multisigAddresses } = useGlobalUserDetailsContext()
  const threshold =
    multisigAddresses?.find(
      (item: any) =>
        item.address === activeMultisig || item.proxy === activeMultisig,
    )?.threshold || 0

  return (
    <div className={classNames("flex gap-x-4", className)}>
      <article className="p-4 rounded-lg bg-bg-main flex-1">
        {!(txType === "addOwnerWithThreshold" || txType === "removeOwner") &&
          recipientAddress &&
          amount && (
            <>
              {typeof recipientAddress === "string" ? (
                <>
                  <p className="flex items-center gap-x-1 text-white font-medium text-sm leading-[15px]">
                    <span>Sent</span>
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
                          <span>Sent</span>
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
        <div className="flex items-center gap-x-7 mb-3">
          <span className="text-text_secondary font-normal text-sm leading-[15px]">
            From:
          </span>
          <AddressComponent address={from} />
        </div>
        <div className="flex items-center gap-x-5">
          <span className="text-text_secondary font-normal text-sm leading-[15px]">
            Txn Hash:
          </span>
          <p className="flex items-center gap-x-3 font-normal text-xs leading-[13px] text-text_secondary">
            <span className="text-white font-normal text-sm leading-[15px]">
              {shortenAddress(callHash, 10)}
            </span>
            <span className="flex items-center gap-x-2 text-sm">
              <button onClick={() => copyText(callHash)}>
                <CopyIcon />
              </button>
              {/* <ExternalLinkIcon /> */}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-x-5 mt-3">
          <span className="text-text_secondary font-normal text-sm leading-[15px]">
            Executed:
          </span>
          <p className="flex items-center gap-x-3 font-normal text-xs leading-[13px] text-text_secondary">
            <span className="text-white font-normal text-sm leading-[15px]">
              {date}
            </span>
          </p>
        </div>
        {addressAddOrRemove && (
          <div className="flex items-center gap-x-5 mt-3">
            <span className="text-text_secondary font-normal text-sm leading-[15px]">
              {txType === "addOwnerWithThreshold"
                ? "Added Owner"
                : "Removed Owner"}
              :
            </span>
            <p className="flex items-center gap-x-3 font-normal text-xs leading-[13px] text-text_secondary">
              <AddressComponent address={addressAddOrRemove} />
            </p>
          </div>
        )}
        {loading ? (
          <Spin className="mt-3" />
        ) : (
          <>
            {!!transactionFields &&
              Object.keys(transactionFields).length !== 0 &&
              transactionFields.category !== "none" && (
                <>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-text_secondary font-normal text-sm leading-[15px]">
                      Category:
                    </span>
                    <span className="text-primary border border-solid border-primary rounded-xl px-[6px] py-1">
                      {transactionFields?.category}
                    </span>
                  </div>
                  {transactionFields &&
                    transactionFields?.subfields &&
                    Object.keys(transactionFields?.subfields).map((key) => {
                      const subfield = transactionFields?.subfields[key]
                      return (
                        <div
                          key={key}
                          className="flex items-center justify-between mt-3"
                        >
                          <span className="text-text_secondary font-normal text-sm leading-[15px]">
                            {subfield?.name}:
                          </span>
                          <span className="text-waiting bg-waiting bg-opacity-5 border border-solid border-waiting rounded-lg px-[6px] py-[3px]">
                            {subfield?.value}
                          </span>
                        </div>
                      )
                    })}
                </>
              )}
            {note && (
              <div className="flex items-center gap-x-5 mt-3">
                <span className="text-text_secondary font-normal text-sm leading-[15px]">
                  Note:
                </span>
                <p className="flex items-center gap-x-3 font-normal text-xs leading-[13px] text-text_secondary">
                  <span className="text-white font-normal text-sm leading-[15px] whitespace-pre">
                    {note}
                  </span>
                </p>
              </div>
            )}
          </>
        )}
      </article>
      <article className="p-8 rounded-lg bg-bg-main max-w-[328px] w-full">
        <div className="h-full">
          <Timeline className="h-full flex flex-col">
            <Timeline.Item
              dot={
                <span className="bg-success bg-opacity-10 flex items-center justify-center p-1 rounded-md h-6 w-6">
                  <CirclePlusIcon className="text-success text-sm" />
                </span>
              }
              className="success flex-1"
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
              className="success flex-1"
            >
              <div className="text-white font-normal text-sm leading-[15px]">
                Confirmations{" "}
                <span className="text-text_secondary">
                  {threshold} of {threshold}
                </span>
              </div>
            </Timeline.Item>
            {!!approvals?.length && (
              <Timeline.Item
                dot={
                  <span className="bg-success bg-opacity-10 flex items-center justify-center p-1 rounded-md h-6 w-6">
                    <CircleCheckIcon className="text-success text-sm" />
                  </span>
                }
                className="success"
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
                    </Timeline>
                  </Collapse.Panel>
                </Collapse>
              </Timeline.Item>
            )}
            <Timeline.Item
              dot={
                <span className="bg-success bg-opacity-10 flex items-center justify-center p-1 rounded-md h-6 w-6">
                  <CircleWatchIcon className="text-success text-sm" />
                </span>
              }
              className="success flex-1"
            >
              <div className="text-white font-normal text-sm leading-[15px]">
                <p>Executed</p>
              </div>
            </Timeline.Item>
          </Timeline>
        </div>
      </article>
    </div>
  )
}

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
`
