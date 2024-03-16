// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
/* eslint-disable sort-keys */

import { Form, Input, InputNumber, Modal, Spin } from "antd";
import classNames from "classnames";
import React, { FC, useState } from "react";
import CancelBtn from "../../components/Multisig/CancelBtn";
import AddBtn from "../../components/Multisig/ModalBtn";
import { useActiveMultisigContext } from "@frontend/context/ActiveMultisigContext";
import { useGlobalUserDetailsContext } from "@frontend/context/UserDetailsContext";
import { DEFAULT_ADDRESS_NAME } from "../../global/default";
import { IMultisigAddress, ISharedAddressBookRecord } from "../../types";
import { NotificationStatus } from "../../types";
import {
  DashDotIcon,
  OutlineCloseIcon,
} from "@frontend/ui-components/CustomIcons";
import PrimaryButton from "@frontend/ui-components/PrimaryButton";
import queueNotification from "@frontend/ui-components/QueueNotification";

import DragDrop from "../Multisig/DragDrop";
import Search from "../Multisig/Search";
import Signatory from "./Signatory";
import AddAddress from "../AddressBook/AddAddress";
import SuccessTransactionLottie from "@frontend/ui-components/lottie-graphics/SuccessTransaction";
import FailedTransactionLottie from "@frontend/ui-components/lottie-graphics/FailedTransaction";
import LoadingLottie from "@frontend/ui-components/lottie-graphics/Loading";
import { useGlobalIdentityContext } from "@frontend/context/IdentityProviderContext";
import useIcpVault from "@frontend/hooks/useIcpVault";

interface IMultisigProps {
  className?: string;
  onCancel?: () => void;
  isModalPopup?: boolean;
  homepage?: boolean;
}

const CreateMultisig: React.FC<IMultisigProps> = ({
  onCancel,
  homepage = false,
}) => {
  const {
    setUserDetailsContextState,
    address: userAddress,
    multisigAddresses,
    addressBook,
  } = useGlobalUserDetailsContext();
  const { records, setActiveMultisigContextState } = useActiveMultisigContext();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [uploadSignatoriesJson, setUploadSignatoriesJson] = useState(false);

  const [multisigName, setMultisigName] = useState<string>("");
  const [threshold, setThreshold] = useState<number>(2);
  const [signatories, setSignatories] = useState<[string]>([userAddress]);
  const { identityBackend } = useGlobalUserDetailsContext();

  const [loading, setLoading] = useState<boolean>(false);
  const [success] = useState<boolean>(false);
  const [failure, setFailure] = useState<boolean>(false);
  const [loadingMessages] = useState<string>("");
  const [addAddress, setAddAddress] = useState<string>("");
  const [showAddressModal, setShowAddressModal] = useState<boolean>(false);
  const [form] = Form.useForm();
  const { create_vault } = useIcpVault();

  const handleMultisigCreate = async () => {
    setLoading(true);
    try {
      console.log(signatories);
      const { data: multisigData, error: multisigError } = await create_vault(
        multisigName,
        signatories,
        BigInt(threshold),
      );
      console.log(multisigData);

      if (!multisigData) {
        queueNotification({
          header: "Error!",
          message: "Something went wrong",
          status: NotificationStatus.ERROR,
        });
        setLoading(false);
        setFailure(true);
        return;
      }

      if (multisigError) {
        queueNotification({
          header: "Error!",
          message: multisigError,
          status: NotificationStatus.ERROR,
        });
        setLoading(false);
        setFailure(true);
        return;
      }

      if (multisigData) {
        queueNotification({
          header: "Success!",
          message: `Your Multisig ${multisigName} has been created successfully!`,
          status: NotificationStatus.SUCCESS,
        });
        const { address, multisig } = multisigData;
        const data = {
          address,
          ...{
            name: multisig?.name,
            threshold: Number(multisig?.threshold),
            signatories: multisig?.signers?.flat().map((a) => a.toText?.()),
          },
        };
        console.log(data);
        onCancel?.();
        setUserDetailsContextState((prevState: any) => {
          return {
            ...prevState,
            activeMultisig: data.address,
            multisigAddresses: [...(prevState?.multisigAddresses || []), data],
            multisigSettings: {
              ...prevState.multisigSettings,
              [`${data.address}`]: {
                name: data.name,
                deleted: false,
              },
            },
          };
        });
        const records: { [address: string]: ISharedAddressBookRecord } = {};
        data.signatories.forEach((signatory: any) => {
          const data = addressBook.find((a) => a.address === signatory);
          records[signatory] = {
            address: signatory,
            name: data?.name || DEFAULT_ADDRESS_NAME,
            email: data?.email,
            discord: data?.discord,
            telegram: data?.telegram,
            roles: data?.roles,
          };
        });
        setActiveMultisigContextState((prev) => ({
          ...prev,
          records,
          multisig: data.address,
        }));
      }
    } catch (error) {
      console.log("ERROR", error);
      setFailure(true);

      queueNotification({
        header: "Something went wrong.",
        message: "Please try again with different addresses.",
        status: NotificationStatus.ERROR,
      });
    }
    setLoading(false);
  };

  const AddAddressModal: FC = () => {
    return (
      <>
        <PrimaryButton
          disabled={
            !addAddress ||
            Object.keys(records).includes(addAddress) ||
            addressBook.some((item) => item.address === addAddress)
          }
          onClick={() => setShowAddressModal(true)}
        >
          <p className="font-normal text-sm">Add</p>
        </PrimaryButton>
        <Modal
          onCancel={() => setShowAddressModal(false)}
          open={showAddressModal}
          centered
          footer={false}
          closeIcon={
            <button
              className="outline-none border-none bg-highlight w-6 h-6 rounded-full flex items-center justify-center"
              onClick={() => setShowAddressModal(false)}
            >
              <OutlineCloseIcon className="text-primary w-2 h-2" />
            </button>
          }
          title={
            <h3 className="text-white mb-8 text-lg font-semibold md:font-bold md:text-xl">
              Add Address
            </h3>
          }
          className={"w-auto md:min-w-[500px] scale-90"}
        >
          <AddAddress
            onCancel={() => setShowAddressModal(false)}
            addAddress={addAddress}
            setAddAddress={setAddAddress}
          />
        </Modal>
      </>
    );
  };

  const CreateMultisigSuccessScreen: FC = () => {
    return (
      <div className="flex flex-col h-full">
        <SuccessTransactionLottie message="Multisig created successfully!" />
      </div>
    );
  };
  return (
    <>
      <Spin
        spinning={loading || success || failure}
        indicator={
          loading ? (
            <LoadingLottie message={loadingMessages} />
          ) : success ? (
            <CreateMultisigSuccessScreen />
          ) : (
            <FailedTransactionLottie message="Failed!" />
          )
        }
      >
        <Form
          form={form}
          validateMessages={{ required: "Please add the '${name}'" }}
        >
          <div
            className={`flex flex-col relative ${
              !homepage && "max-h-[68vh] overflow-y-auto px-3 py-2"
            }`}
          >
            <div
              className={classNames(
                `${homepage ? "" : "w-[80vw]"}  flex justify-between items-end`,
                {
                  "w-auto": onCancel,
                },
              )}
            >
              <div className="relative">
                <div className="flex items-center justify-between">
                  {!uploadSignatoriesJson ? (
                    <div className="flex items-center justify-between w-[45vw] gap-x-4">
                      <Search
                        addAddress={addAddress}
                        setAddAddress={setAddAddress}
                      />
                      <AddAddressModal />
                    </div>
                  ) : null}
                  {/* <div className='flex flex-col items-end justify-center absolute top-1 right-1 z-50'>
										<div className='flex items-center justify-center mb-2'>
											<p className='mx-2 text-white'>Upload JSON file with signatories</p><Switch size='small' onChange={(checked) => setUploadSignatoriesJson(checked)} />
										</div>
									</div> */}
                </div>
                <Form.Item
                  name="signatories"
                  rules={[{ required: true }]}
                  help={
                    signatories.length < 2 &&
                    "Multisig Must Have Atleast 2 Signatories."
                  }
                  className="border-0 outline-0 my-0 p-0"
                  validateStatus={signatories.length < 2 ? "error" : "success"}
                >
                  <div className="w-full flex items-center justify-between">
                    <Signatory
                      homepage={homepage}
                      filterAddress={addAddress}
                      setSignatories={setSignatories}
                      signatories={signatories}
                    />
                    <DashDotIcon className="mt-5" />
                    <div className="w-[40%] overflow-auto">
                      <br />
                      {!uploadSignatoriesJson ? (
                        <p className="bg-bg-secondary p-5 rounded-md mx-2 h-fit text-text_secondary">
                          The signatories has the ability to create transactions
                          using the multisig and approve transactions sent by
                          others. Once the threshold is reached with approvals,
                          the multisig transaction is enacted on-chain. Since
                          the multisig function like any other account, once
                          created it is available for selection anywhere
                          accounts are used and needs to be funded before use.
                        </p>
                      ) : (
                        <p className="bg-bg-secondary p-5 rounded-md mx-2 h-fit text-text_secondary">
                          Supply a JSON file with the list of signatories.
                        </p>
                      )}
                    </div>
                  </div>
                </Form.Item>
                <div className="flex items-start justify-between">
                  <Form.Item
                    name="threshold"
                    rules={[{ required: true }]}
                    help={
                      !threshold || threshold < 2
                        ? "Threshold Must Be More Than 1."
                        : threshold > signatories.length &&
                          signatories.length > 1
                        ? "Threshold Must Be Less Than Or Equal To Selected Signatories."
                        : ""
                    }
                    className="border-0 outline-0 my-0 p-0"
                    validateStatus={
                      !threshold ||
                      threshold < 2 ||
                      (threshold > signatories.length && signatories.length > 1)
                        ? "error"
                        : "success"
                    }
                  >
                    <div className="w-[45vw]">
                      <p className="text-primary">Threshold</p>
                      <InputNumber
                        onChange={(val) => setThreshold(val || 2)}
                        value={threshold}
                        className="bg-bg-secondary placeholder:text-[#505050] text-white outline-none border-none w-full mt-2 py-2"
                        placeholder="0"
                      />
                    </div>
                  </Form.Item>
                  <DashDotIcon className="mt-5" />
                  <div className="w-[40%] overflow-auto">
                    <p className="bg-bg-secondary py-2 px-5 rounded-md mx-2 mt-5 text-text_secondary">
                      The threshold for approval should be less or equal to the
                      number of signatories for this multisig.
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="w-[45vw]">
                    <p className="text-primary">Name</p>
                    <Input
                      onChange={(e) => setMultisigName(e.target.value)}
                      value={multisigName}
                      className="bg-bg-secondary placeholder-text_placeholder text-white outline-none border-none w-full mt-2 py-2"
                      placeholder="Give the MultiSig a unique name"
                    />
                  </div>
                  <DashDotIcon className="mt-5" />
                  <div className="w-[40%] overflow-auto">
                    <p className="bg-bg-secondary py-2 px-5 rounded-md mx-2 mt-5 text-text_secondary">
                      The name is for unique identification of the account in
                      your owner lists.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-x-5 mt-[40px]">
              <CancelBtn onClick={onCancel} />
              <AddBtn
                disabled={
                  signatories.length < 2 ||
                  !threshold ||
                  threshold < 2 ||
                  threshold > signatories.length ||
                  !multisigName
                }
                loading={loading}
                title="Create Multisig"
                onClick={handleMultisigCreate}
              />
            </div>
          </div>
        </Form>
      </Spin>
    </>
  );
};

export default CreateMultisig;
