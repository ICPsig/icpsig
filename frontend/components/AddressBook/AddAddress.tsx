// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { MinusCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, Modal, Select, Spin } from "antd";
import React, { useEffect, useState } from "react";
import LoadingLottie from "@frontend/ui-components/lottie-graphics/Loading";
import CancelBtn from "../../components/Settings/CancelBtn";
import AddBtn from "../../components/Settings/ModalBtn";
import { useActiveMultisigContext } from "@frontend/context/ActiveMultisigContext";
import { useModalContext } from "@frontend/context/ModalContext";
import { useGlobalUserDetailsContext } from "@frontend/context/UserDetailsContext";
import { DEFAULT_ADDRESS_NAME, EMAIL_REGEX } from "../../global/default";
import { firebaseFunctionsHeader } from "../../global/firebaseFunctionsHeader";
import { FIREBASE_FUNCTIONS_URL } from "../../global/firebaseFunctionsUrl";
import {
  IAddressBookItem,
  ISharedAddressBooks,
  NotificationStatus,
} from "@frontend/types";
import {
  OutlineCloseIcon,
  WarningCircleIcon,
} from "@frontend/ui-components/CustomIcons";
import queueNotification from "@frontend/ui-components/QueueNotification";
import styled from "styled-components";
import { useGlobalIdentityContext } from "@frontend/context/IdentityProviderContext";
import useIcpVault from "@frontend/hooks/useIcpVault";

interface IMultisigProps {
  className?: string;
  addAddress?: string;
  onCancel?: () => void;
  setAddAddress?: React.Dispatch<React.SetStateAction<string>>;
}

const EditAddressModal = ({
  className,
  confirm,
  open,
  onCancel,
}: {
  open: boolean;
  className?: string;
  onCancel: () => void;
  confirm: () => Promise<void>;
}) => {
  return (
    <>
      <Modal
        centered
        footer={false}
        closeIcon={
          <button
            className="outline-none border-none bg-highlight w-6 h-6 rounded-full flex items-center justify-center"
            onClick={onCancel}
          >
            <OutlineCloseIcon className="text-primary w-2 h-2" />
          </button>
        }
        title={
          <h3 className="text-white mb-8 text-lg font-semibold md:font-bold md:text-xl"></h3>
        }
        open={open}
        className={`${className} w-auto md:min-w-[500px] scale-90`}
      >
        <Form className="my-0 w-[560px]">
          <p className="text-white font-medium text-sm leading-[15px]">
            This will update the Address book for all Signatories of this
            Multisig, would you like to continue?
          </p>
          <div className="flex items-center justify-between gap-x-5 mt-[30px]">
            <CancelBtn onClick={onCancel} />
            <AddBtn
              onClick={() => {
                confirm();
                onCancel();
              }}
              title="Yes"
            />
          </div>
        </Form>
      </Modal>
    </>
  );
};

const AddAddress: React.FC<IMultisigProps> = ({
  addAddress,
  onCancel,
  setAddAddress,
  className,
}) => {
  const {
    addressBook,
    activeMultisig,
    multisigAddresses,
    setUserDetailsContextState,
  } = useGlobalUserDetailsContext();

  const [address, setAddress] = useState<string>(addAddress || "");
  const [addressValid, setAddressValid] = useState<boolean>(true);
  const [name, setName] = useState<string>("");
  const [nickName, setNickName] = useState<string>("");
  const [showNickNameField, setShowNickNameField] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [emailValid, setEmailValid] = useState<boolean>(true);
  const [roles, setRoles] = useState<string[]>([]);
  const [discord, setDiscord] = useState<string>("");
  const [telegram, setTelegram] = useState<string>("");
  const [shared, setShared] = useState<boolean>(activeMultisig ? true : false);
  const { add_address_to_address_book } = useIcpVault();

  const [openConfirmationModal, setOpenConfirmationModal] =
    useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);

  const {
    setActiveMultisigContextState,
    records,
    roles: defaultRoles,
  } = useActiveMultisigContext();

  const multisig = multisigAddresses.find(
    (item) => item.address === activeMultisig || item.proxy === activeMultisig,
  );

  useEffect(() => {
    setAddressValid(true);
  }, [address]);

  useEffect(() => {
    if (email) {
      const validEmail = EMAIL_REGEX.test(email);
      if (validEmail) {
        setEmailValid(true);
      } else {
        setEmailValid(false);
      }
    }
  }, [email]);

  const handlePersonalAddressBookUpdate = async () => {
    if (!address || !name) return;

    try {
      setLoading(true);
      if (addressBook.some((item) => item.address === address)) {
        queueNotification({
          header: "Address Exists",
          message: "Please try editing the address.",
          status: NotificationStatus.ERROR,
        });
        setLoading(false);
        return;
      }

      const { data: addAddressData, error: addAddressError } =
        await add_address_to_address_book(
          address,
          name,
          telegram,
          email,
          discord,
          roles?.[0],
        );
      console.log(addAddressData, addAddressError);

      if (addAddressError) {
        queueNotification({
          header: "Error!",
          message: addAddressError,
          status: NotificationStatus.ERROR,
        });
        setLoading(false);
        return;
      }

      if (addAddressData) {
        setUserDetailsContextState((prevState) => {
          return {
            ...prevState,
            addressBook: addAddressData,
          };
        });

        queueNotification({
          header: "Success!",
          message: "Your address has been added successfully!",
          status: NotificationStatus.SUCCESS,
        });
        setLoading(false);
        if (onCancel) {
          onCancel();
        } else {
          toggleVisibility();
        }
        if (setAddAddress) {
          setAddAddress("");
        }
      }
    } catch (error) {
      console.log("ERROR", error);
      setLoading(false);
    }
  };

  const handleSharedAddressBookUpdate = async () => {
    if (!address || !name) return;

    try {
      setLoading(true);

      if (records && Object.keys(records).includes(address)) {
        queueNotification({
          header: "Address Exists",
          message: "Please try editing the address.",
          status: NotificationStatus.ERROR,
        });
        setLoading(false);
        return;
      }

      const { data: addAddressResponse, error: addAddressError } =
        await add_address_to_address_book(
          address,
          name,
          telegram,
          email,
          discord,
          roles?.[0],
        );
      console.log(addAddressResponse, addAddressError);

      if (addAddressError) {
        queueNotification({
          header: "Error!",
          message: addAddressError,
          status: NotificationStatus.ERROR,
        });
        setLoading(false);
        return;
      }

      if (addAddressResponse) {
        setUserDetailsContextState((prevState) => {
          return {
            ...prevState,
            addressBook: addAddressResponse,
          };
        });

        queueNotification({
          header: "Success!",
          message: "Your address has been added successfully!",
          status: NotificationStatus.SUCCESS,
        });
        setLoading(false);
        if (onCancel) {
          onCancel();
        } else {
          toggleVisibility();
        }
        if (setAddAddress) {
          setAddAddress("");
        }
      }
    } catch (error) {
      console.log("ERROR", error);
      setLoading(false);
    }
  };

  const { toggleVisibility } = useModalContext();
  return (
    <>
      <Spin
        spinning={loading}
        indicator={
          <LoadingLottie noWaitMessage message={"Updating Your Address Book"} />
        }
      >
        <EditAddressModal
          onCancel={() => setOpenConfirmationModal(false)}
          open={openConfirmationModal}
          confirm={handleSharedAddressBookUpdate}
        />
        <Form
          className={`${className} add-address my-0 w-[560px] max-h-[75vh] px-2 overflow-y-auto`}
        >
          <div className="flex flex-col gap-y-3">
            <label
              className="text-primary text-xs leading-[13px] font-normal"
              htmlFor="name"
            >
              Name*
            </label>
            <Form.Item
              name="name"
              rules={[
                {
                  message: "Required",
                  required: true,
                },
              ]}
              className="border-0 outline-0 my-0 p-0"
            >
              <Input
                placeholder="Give the address a name"
                className="text-sm font-normal m-0 leading-[15px] border-0 outline-0 p-3 placeholder:text-[#505050] bg-bg-secondary rounded-lg text-white"
                id="name"
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
            </Form.Item>
          </div>
          {showNickNameField && (
            <div className="flex flex-col gap-y-3 mt-5">
              <label
                className="text-primary text-xs leading-[13px] font-normal"
                htmlFor="nick-name"
              >
                Nickname
              </label>
              <Form.Item
                name="nick-name"
                rules={[
                  {
                    message: "Required",
                    required: true,
                  },
                ]}
                className="border-0 outline-0 my-0 p-0"
              >
                <Input
                  placeholder="Give the address a Nickname"
                  className="text-sm font-normal m-0 leading-[15px] border-0 outline-0 p-3 placeholder:text-[#505050] bg-bg-secondary rounded-lg text-white"
                  id="nick-name"
                  onChange={(e) => setNickName(e.target.value)}
                  value={nickName}
                />
                <Button
                  onClick={() => {
                    setShowNickNameField(false);
                    setNickName("");
                  }}
                  icon={<MinusCircleOutlined className="text-primary" />}
                  className="bg-transparent p-0 border-none outline-none text-primary text-sm flex items-center"
                >
                  Remove Nickname
                </Button>
              </Form.Item>
            </div>
          )}
          <div className="flex flex-col gap-y-3 mt-5">
            <label
              className="text-primary text-xs leading-[13px] font-normal"
              htmlFor="address"
            >
              Address*
            </label>
            <Form.Item
              name="address"
              rules={[{ message: "Address Required", required: true }]}
              validateStatus={address && !addressValid ? "error" : "success"}
              help={address && !addressValid && "Please enter a valid address"}
              className="border-0 outline-0 my-0 p-0"
            >
              <Input
                placeholder="Unique Address"
                className="text-sm font-normal leading-[15px] border-0 outline-0 p-3 placeholder:text-[#505050] bg-bg-secondary rounded-lg text-white"
                id="address"
                defaultValue={addAddress || ""}
                onChange={(e) => setAddress(e.target.value)}
                value={address}
              />
            </Form.Item>
          </div>
          <div className="flex flex-col gap-y-3 mt-5">
            <label
              className="text-primary text-xs leading-[13px] font-normal"
              htmlFor="email-address"
            >
              Email
            </label>
            <Form.Item
              name="email"
              className="border-0 outline-0 my-0 p-0"
              help={email && !emailValid && "Please enter a valid Email."}
              validateStatus={email && !emailValid ? "error" : "success"}
            >
              <Input
                type="email"
                placeholder="Email"
                className="text-sm font-normal leading-[15px] border-0 outline-0 p-3 placeholder:text-[#505050] bg-bg-secondary rounded-lg text-white"
                id="email-address"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </Form.Item>
          </div>
          <div className="flex flex-col gap-y-3 mt-5">
            <label
              className="text-primary text-xs leading-[13px] font-normal"
              htmlFor="discord"
            >
              Discord
            </label>
            <Form.Item name="discord" className="border-0 outline-0 my-0 p-0">
              <Input
                placeholder="Discord"
                className="text-sm font-normal leading-[15px] border-0 outline-0 p-3 placeholder:text-[#505050] bg-bg-secondary rounded-lg text-white"
                id="discord"
                onChange={(e) => setDiscord(e.target.value)}
                value={discord}
              />
            </Form.Item>
          </div>
          <div className="flex flex-col gap-y-3 mt-5">
            <label
              className="text-primary text-xs leading-[13px] font-normal"
              htmlFor="telegram"
            >
              Telegram
            </label>
            <Form.Item name="telegram" className="border-0 outline-0 my-0 p-0">
              <Input
                placeholder="Telegram"
                className="text-sm font-normal leading-[15px] border-0 outline-0 p-3 placeholder:text-[#505050] bg-bg-secondary rounded-lg text-white"
                id="telegram"
                onChange={(e) => setTelegram(e.target.value)}
                value={telegram}
              />
            </Form.Item>
          </div>
          <div className="flex flex-col gap-y-3 mt-5">
            <label className="text-primary text-xs leading-[13px] font-normal">
              Role
            </label>
            <Form.Item name="role" className="border-0 outline-0 my-0 p-0">
              <Select
                options={
                  defaultRoles
                    ? defaultRoles.map((item, i) => ({
                        label: (
                          <span
                            key={i}
                            className="text-white bg-primary rounded-lg py-1 px-3"
                          >
                            {item}
                          </span>
                        ),
                        value: item,
                      }))
                    : []
                }
                mode="tags"
                className={className}
                onChange={(value) => setRoles(value)}
                tokenSeparators={[","]}
                placeholder="Add Roles"
                notFoundContent={false}
              />
            </Form.Item>
          </div>
        </Form>
        <div className="flex items-center justify-between gap-x-5 mt-[30px]">
          <CancelBtn onClick={onCancel ? onCancel : toggleVisibility} />
          <AddBtn
            loading={loading}
            disabled={
              !name || !address || !addressValid || (!!email && !emailValid)
            }
            title="Add"
            onClick={
              shared
                ? () => setOpenConfirmationModal(true)
                : handlePersonalAddressBookUpdate
            }
          />
        </div>
      </Spin>
    </>
  );
};

export default styled(AddAddress)`
  .ant-select-selector {
    border: none !important;
    padding: 8px 10px;
    box-shadow: none !important;
    background-color: #24272e !important;
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

  .ant-select-multiple .ant-select-selection-item {
    border: none !important;
    background: #1573fe !important;
    border-radius: 5px !important;
    color: white !important;
    margin-inline-end: 10px !important;
  }
`;
