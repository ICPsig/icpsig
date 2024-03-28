// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { Button, Spin } from "antd";
import React, { useEffect, useState } from "react";
import FailedTransactionLottie from "@frontend/ui-components/lottie-graphics/FailedTransaction";
import LoadingLottie from "@frontend/ui-components/lottie-graphics/Loading";
import { useGlobalUserDetailsContext } from "@frontend/context/UserDetailsContext";
import AddressComponent from "@frontend/ui-components/AddressComponent";
import Balance from "@frontend/ui-components/Balance";
import styled from "styled-components";

import TransactionSuccessScreen from "./TransactionSuccessScreen";
import { Loader } from "lucide-react";
import useIcpVault from "@frontend/hooks/useIcpVault";
import {
  erc20Balance,
  ethAddressData,
  ethBalanceCovalent,
} from "@frontend/utils/networkConstant/service";
import { ERC20_CONTRACTS } from "@frontend/utils/networkConstant/networkConstant";
import Erc20Modal from "./Erc20Modal";
import {
  Erc20Contract,
  Erc20Metadata,
  ETHEREUM_NETWORK,
  ETHEREUM_NETWORK_ID,
  ETHEREUM_SYMBOL,
  mapErc20Token,
} from "@frontend/utils/eth/servcieTypes";
import { ethBalance } from "@frontend/utils/eth/providers";
import queueNotification from "@frontend/ui-components/QueueNotification";
import { NotificationStatus } from "@frontend/types";
import { formatUnits } from "ethers/lib/utils";

const FundMultisig = ({
  className,
  onCancel,
  setNewTxn,
}: {
  className?: string;
  onCancel: () => void;
  setNewTxn?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { activeMultisig, addressBook, address } =
    useGlobalUserDetailsContext();

  const [selectedSender] = useState(addressBook[0].address);
  const [amount, setAmount] = useState("0");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [failure] = useState(false);
  const [loadingMessages] = useState<string>("");
  const [txnHash] = useState<string>("");
  const [selectedAccountBalance, setSelectedAccountBalance] =
    useState<string>("");
  const signer: any = "";
  const [tabState, setTabState] = useState("ICP");
  const [bitcoinAddress, setBitcoinAddress] = useState("");
  const [btcLoading, setBtcLoading] = useState(false);
  const [ethAddress, setEthAddress] = useState("");
  const [ethLoading, setEthLoading] = useState(false);
  const [ethDataLoading, setEthDataLoading] = useState(false);
  const [ethAssetsData, setEthAssetsData] = useState(null);
  const [open, setOpen] = useState(false);

  const { get_btc_address, get_eth_address, update_btc_to_ckBtc } =
    useIcpVault();

  const generateBTC = async () => {
    if (!get_btc_address) {
      return;
    }
    setBtcLoading(true);

    if (localStorage.getItem(activeMultisig)) {
      setBitcoinAddress(localStorage.getItem(activeMultisig));
      setBtcLoading(false);
      return;
    }
    const { data, error } = await get_btc_address(activeMultisig);
    if (!data || error) {
      console.log("error in getting BTC address");
      setBtcLoading(false);
      return;
    }
    setBitcoinAddress(data);
    localStorage.setItem(activeMultisig, data);
    setBtcLoading(false);
  };
  const generateETH = async () => {
    if (!get_eth_address) {
      return;
    }
    setEthLoading(true);

    if (localStorage.getItem(`${activeMultisig}_eth`)) {
      setEthAddress(localStorage.getItem(`${activeMultisig}_eth`));
      setEthLoading(false);
      return;
    }
    const { data, error } = await get_eth_address(activeMultisig);
    if (!data || error) {
      console.log("error in getting BTC address");
      setEthLoading(false);
      return;
    }
    setEthAddress(data);
    localStorage.setItem(`${activeMultisig}_eth`, data);
    setEthLoading(false);
  };

  const handleEthAssets = async () => {
    type ContractData = Erc20Contract & Erc20Metadata;
    setEthDataLoading(true);
    const loadContracts = (): Promise<ContractData>[] =>
      ERC20_CONTRACTS.map(async (contract) => ({
        ...contract,
        ...(await ethAddressData(contract)),
      }));
    const balances: any = await ethBalanceCovalent(ethAddress);
    const contracts = await Promise.all([...loadContracts()]);
    const promisedData = contracts.map(mapErc20Token).map(async (data) => {
      const balance = await erc20Balance({
        contract: { address: data.address },
        address: ethAddress,
      });
      console.log(balance);
      return {
        ...data,
        balance: formatUnits(balance.toString(), data.decimals) || 0,
      };
    });

    const data = await Promise.all(promisedData);

    const ethBalanceData = await ethBalance(ethAddress);
    const payload = [
      {
        id: ETHEREUM_NETWORK_ID,
        network: ETHEREUM_NETWORK,
        standard: "erc20",
        name: ETHEREUM_SYMBOL,
        symbol: ETHEREUM_SYMBOL,
        icon: "",
        balance: formatUnits(ethBalanceData.toString(), 18) || 0,
      },
      ...data,
    ];
    setEthAssetsData(payload);
    setEthDataLoading(false);
    console.log(contracts.map(mapErc20Token), balances);
    console.log(data);
    console.log("done");
  };

  const handleBtcToCKBtc = async () => {
    if (!update_btc_to_ckBtc) {
      return;
    }
    setEthLoading(true);
    const { data, error } = await update_btc_to_ckBtc(activeMultisig);
    if (!data || error) {
      console.log("error in getting BTC address");
      setEthLoading(false);
      return;
    }
    if (data) {
      setEthLoading(false);
      queueNotification({
        header: "Success!",
        message: "Funds Updates.",
        status: NotificationStatus.SUCCESS,
      });
    }
  };
  useEffect(() => {
    if (!ethAssetsData) {
      return;
    }
    setOpen(true);
  }, [ethAssetsData]);

  // const handleSubmit = async () => {
  //   setLoading(true);
  //   try {
  //     const tx = await signer.sendTransaction({
  //       to: activeMultisig,
  //       value: amount.toString(),
  //     });
  //     // const { transactionHash, to } = await tx.wait();
  //     // fetch(`${FIREBASE_FUNCTIONS_URL}/addTransactionEth`, {
  //     // 	body: JSON.stringify({
  //     // 		amount_token: amount.toString(),
  //     // 		// eslint-disable-next-line sort-keys
  //     // 		from: selectedSender,
  //     // 		safeAddress: activeMultisig,
  //     // 		data: '',
  //     // 		txHash: transactionHash,
  //     // 		to,
  //     // 		note: '',
  //     // 		type: 'fund',
  //     // 		executed: true
  //     // 	}),
  //     // 	// headers: firebaseFunctionsHeader(
  //     // 	//   network,
  //     // 	//   localStorage.getItem("address")!,
  //     // 	//   localStorage.getItem("signature")!
  //     // 	// ),
  //     // 	method: 'POST'
  //     // }).then((res) => res.json());
  //     queueNotification({
  //       header: "Success!",
  //       message: "You have successfully completed the transaction. ",
  //       status: NotificationStatus.SUCCESS,
  //     });
  //     setSuccess(true);
  //   } catch (err) {
  //     console.log("error from handleSubmit sendNativeToken", err);
  //     setNewTxn?.((prev) => !prev);
  //     onCancel();
  //     queueNotification({
  //       header: "Error!",
  //       message: "Please try again",
  //       status: NotificationStatus.ERROR,
  //     });
  //   }

  //   setLoading(false);
  // };

  return (
    <>
      <Erc20Modal
        data={ethAssetsData}
        setShowAddressModal={setOpen}
        open={open}
        ethAddress={ethAddress}
      />
      {success ? (
        <TransactionSuccessScreen
          successMessage="Transaction Successful!"
          amount={amount}
          sender={selectedSender}
          recipients={[activeMultisig]}
          created_at={new Date()}
          txnHash={txnHash}
          onDone={() => {
            setNewTxn?.((prev) => !prev);
          }}
        />
      ) : failure ? (
        <FailedTransactionLottie message="Failed!" />
      ) : (
        <Spin
          spinning={loading}
          indicator={<LoadingLottie width={300} message={loadingMessages} />}
        >
          <div className="flex gap-10 mb-3">
            <button
              onClick={() => setTabState("ICP")}
              className={`text-lg text-white text-bold ${
                tabState === "ICP"
                  ? "border-2 border-primary px-3 py-2 rounded-lg"
                  : ""
              }`}
            >
              ICP
            </button>
            <button
              onClick={() => {
                setTabState("BTC");
                generateBTC();
              }}
              className={`text-lg text-white text-bold ${
                tabState === "BTC"
                  ? "border-2 border-primary px-3 py-2 rounded-lg"
                  : ""
              }`}
            >
              BTC
            </button>
            <button
              onClick={() => {
                setTabState("ETH");
                generateETH();
              }}
              className={`text-lg text-white text-bold ${
                tabState === "ETH"
                  ? "border-2 border-primary px-3 py-2 rounded-lg"
                  : ""
              }`}
            >
              ETH
            </button>
          </div>

          <div className={className}>
            <p className="text-primary font-normal text-xs leading-[13px] mb-2">
              Recipient
            </p>
            {/* TODO: Make into reusable component */}
            {tabState === "ICP" ? (
              <div className=" p-[10px] border-2 border-dashed border-bg-secondary rounded-lg flex items-center justify-between">
                <AddressComponent withBadge={false} address={activeMultisig} />
                <Balance address={activeMultisig} selectedToken="ICP" />
              </div>
            ) : tabState === "BTC" ? (
              <Spin
                spinning={btcLoading}
                indicator={<Loader />}
                tip={"Loading BTC address"}
              >
                <div className="w-full flex justify-between items-center">
                  <AddressComponent
                    withBadge={false}
                    address={bitcoinAddress}
                  />
                  <Button
                    className={`text-lg text-white text-bold border-2 border-primary rounded-lg pb-2`}
                    onClick={handleBtcToCKBtc}
                    loading={ethDataLoading}
                  >
                    Update CKBTC Balance
                  </Button>
                </div>
              </Spin>
            ) : (
              <Spin
                spinning={ethLoading}
                indicator={<Loader />}
                tip={"Loading ETH address"}
              >
                <div className="w-full flex justify-between items-center">
                  <AddressComponent withBadge={false} address={ethAddress} />
                  <Button
                    className={`text-lg text-white text-bold border-2 border-primary rounded-lg pb-2`}
                    onClick={handleEthAssets}
                    loading={ethDataLoading}
                  >
                    Show Assets
                  </Button>
                </div>
              </Spin>
            )}
          </div>
        </Spin>
      )}
    </>
  );
};

export default styled(FundMultisig)`
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
    height: auto !important;
  }
  .ant-select-selector {
    border: none !important;
    height: 40px !important;
    box-shadow: none !important;
  }

  .ant-select {
    height: 40px !important;
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
`;
