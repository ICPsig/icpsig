import { OutlineCloseIcon } from "@frontend/ui-components/CustomIcons";
import PrimaryButton from "@frontend/ui-components/PrimaryButton";
import { Divider, Modal } from "antd";
import React, { useState } from "react";
import NoAssets from "../Assets/NoAssets";
import SendERC20Token from "./SendERC20Token";
import { Erc20Contract, Erc20Metadata } from "@frontend/utils/eth/servcieTypes";

export default function Erc20Modal({
  open,
  setShowAddressModal,
  data,
  ethAddress,
}: {
  open: boolean;
  setShowAddressModal: any;
  data: [Erc20Contract & Erc20Metadata & { balance: string }];
  ethAddress: string;
}) {
  const [selectedTokenData, setSelectedTokenData] = useState(null);
  const handleSendModal = (data) => {
    console.log(data);
    setSelectedTokenData(data);
  };
  return (
    <>
      <Modal
        centered
        title={
          <h3 className="text-white mb-8 text-lg font-semibold">
            Eth Assets (Mainnet)
          </h3>
        }
        closeIcon={
          <button
            className="outline-none border-none bg-highlight w-6 h-6 rounded-full flex items-center justify-center"
            onClick={() => setShowAddressModal(false)}
          >
            <OutlineCloseIcon className="text-primary w-2 h-2" />
          </button>
        }
        footer={null}
        open={open}
        className="w-auto min-w-[500px] scale-90 origin-center"
      >
        {!selectedTokenData && (
          <div className="text-sm font-medium leading-[15px] scale-[80%] w-[125%] h-[125%] origin-top-left">
            <article className="grid grid-cols-4 gap-x-5 bg-bg-secondary text-text_secondary py-5 px-4 rounded-lg">
              <span className="col-span-1">Asset</span>
              <span className="col-span-1">Balance</span>
              <span className="col-span-1">Value</span>
              <span className="col-span-1">Action</span>
            </article>
            {data && data.length > 0 ? (
              data.map((tokenData, index) => {
                const { balance, icon, name, symbol } = tokenData;
                return (
                  <>
                    <article
                      className="grid grid-cols-4 gap-x-5 py-6 px-4 text-white"
                      key={index}
                    >
                      <div className="col-span-1 flex items-center">
                        <div className="flex items-center justify-center overflow-hidden rounded-full w-4 h-4">
                          <img src={icon} alt="profile img" />
                        </div>
                        <span
                          title={name}
                          className="hidden sm:block ml-[6px] max-w-md text-ellipsis overflow-hidden"
                        >
                          {name}
                        </span>
                      </div>
                      <p
                        title={balance}
                        className="max-w-[100px] sm:w-auto overflow-hidden text-ellipsis col-span-1 flex items-center text-xs sm:text-sm"
                      >
                        {balance} {symbol}
                      </p>
                      <p
                        title={balance}
                        className="max-w-[100px] sm:w-auto overflow-hidden text-ellipsis col-span-1 flex items-center text-xs sm:text-sm"
                      >
                        -
                      </p>
                      <div>
                        {symbol === "ETH" && (
                          <PrimaryButton
                            disabled
                            className="bg-[rgb(63, 90, 131)] text-white w-fit mb-1"
                          >
                            <p className="font-normal text-sm">
                              Convert to CKETH
                            </p>
                          </PrimaryButton>
                        )}
                        <PrimaryButton
                          className="bg-[rgb(63, 90, 131)] text-white w-fit"
                          disabled={Number(balance) <= 0}
                        >
                          <p
                            className="font-normal text-sm"
                            onClick={() => handleSendModal(tokenData)}
                          >
                            Send
                          </p>
                        </PrimaryButton>
                      </div>
                    </article>
                    {data.length - 1 !== index ? (
                      <Divider className="bg-text_secondary my-0" />
                    ) : null}
                  </>
                );
              })
            ) : (
              <NoAssets />
            )}
          </div>
        )}

        {selectedTokenData && (
          <SendERC20Token
            ethAddress={ethAddress}
            tokenData={selectedTokenData}
            handleClose={() => setSelectedTokenData(null)}
          />
        )}
      </Modal>
    </>
  );
}
