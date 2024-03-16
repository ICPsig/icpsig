// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { PlusCircleOutlined } from "@ant-design/icons";
import {
  AutoComplete,
  Button,
  Divider,
  Dropdown,
  Form,
  Input,
  Modal,
  Spin,
} from "antd";
import { DefaultOptionType } from "antd/es/select";
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import LoadingLottie from "@frontend/ui-components/lottie-graphics/Loading";
import CancelBtn from "@frontend/components/Settings/CancelBtn";
import ModalBtn from "@frontend/components/Settings/ModalBtn";
import { useActiveMultisigContext } from "@frontend/context/ActiveMultisigContext";
import { useGlobalUserDetailsContext } from "@frontend/context/UserDetailsContext";
import { EFieldType, NotificationStatus } from "@frontend/types";
import AddressComponent from "@frontend/ui-components/AddressComponent";
import Balance from "@frontend/ui-components/Balance";
import BalanceInput from "@frontend/ui-components/BalanceInput";
import {
  CircleArrowDownIcon,
  DeleteIcon,
  LineIcon,
  OutlineCloseIcon,
  SquareDownArrowIcon,
} from "@frontend/ui-components/CustomIcons";
import queueNotification from "@frontend/ui-components/QueueNotification";
import { addNewTransaction } from "@frontend/utils/addNewTransaction";
import { addToAddressBook } from "@frontend/utils/addToAddressBook";
import getOtherSignatories from "@frontend/utils/getOtherSignatories";
import { notify } from "@frontend/utils/notify";
import styled from "styled-components";

import TransactionFailedScreen from "./TransactionFailedScreen";
import TransactionSuccessScreen from "./TransactionSuccessScreen";
import useIcpVault from "@frontend/hooks/useIcpVault";
import convertToE8s from "@frontend/utils/convertToE8s";

export interface IRecipientAndAmount {
  recipient: string;
  amount: string;
}

enum ESendMode {
  SEND = "Send (IC Network)",
  WITHDRAW = "Withdraw (Bitcoin Network)",
}

interface ISendFundsFormProps {
  onCancel?: () => void;
  className?: string;
  setNewTxn?: React.Dispatch<React.SetStateAction<boolean>>;
  defaultSelectedAddress?: string;
}

const SendFundsForm = ({
  className,
  onCancel,
  defaultSelectedAddress,
  setNewTxn,
}: ISendFundsFormProps) => {
  const { activeMultisig, addressBook, address, transactionFields } =
    useGlobalUserDetailsContext();
  const { records } = useActiveMultisigContext();
  const [selectedToken, setSelectedToken] = useState<string>("");

  const [note, setNote] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState("0");
  const [recipientAndAmount, setRecipientAndAmount] = useState<
    IRecipientAndAmount[]
  >([
    {
      amount: "0",
      recipient: defaultSelectedAddress
        ? defaultSelectedAddress || ""
        : address || "",
    },
  ]);
  const [autocompleteAddresses, setAutoCompleteAddresses] = useState<
    DefaultOptionType[]
  >([]);
  const [success, setSuccess] = useState(false);
  const [failure, setFailure] = useState(false);

  const [validRecipient, setValidRecipient] = useState<boolean[]>([true]);

  const [form] = Form.useForm();

  const [multisigBalance, setMultisigBalance] = useState<string>("");

  const [loadingMessages] = useState<string>("");

  const [transactionData] = useState<any>({});

  const [showAddressModal, setShowAddressModal] = useState<boolean>(false);

  const [category, setCategory] = useState<string>("none");

  const [transactionFieldsObject, setTransactionFieldsObject] = useState<{
    category: string;
    subfields: { [subfield: string]: { name: string; value: string } };
  }>({ category: "none", subfields: {} });

  const { create_transactions } = useIcpVault();

  const [sendMode, setSendMode] = useState<ESendMode>(ESendMode.SEND);
  const [ckBTCAddress, setCkBTCAddress] = useState<string>("");

  const sendModeOptions: any[] = Object.values(ESendMode).map((a) => ({
    key: a,
    label: (
      <span className="flex items-center gap-x-2 text-white">{a}</span>
    ) as any,
  }));

  const onRecipientChange = (value: string, i: number) => {
    setRecipientAndAmount((prevState) => {
      const copyArray = [...prevState];
      const copyObject = { ...copyArray[i] };
      copyObject.recipient = value;
      copyArray[i] = copyObject;
      return copyArray;
    });
  };
  const onAmountChange = (amount: string, i: number) => {
    setRecipientAndAmount((prevState) => {
      const copyArray = [...prevState];
      const copyObject = { ...copyArray[i] };
      copyObject.amount = amount;
      copyArray[i] = copyObject;
      return copyArray;
    });
  };

  // Set address options for recipient
  useEffect(() => {
    const allAddresses: string[] = [];
    if (records) {
      Object.keys(records).forEach((address) => {
        allAddresses.push(address);
      });
    }
    addressBook.forEach((item) => {
      if (!allAddresses.includes(item.address)) {
        allAddresses.push(item.address);
      }
    });
    setAutoCompleteAddresses(
      allAddresses.map((address) => ({
        label: <AddressComponent withBadge={false} address={address} />,
        value: address,
      })),
    );
  }, [address, addressBook, records]);

  useEffect(() => {
    setTransactionFieldsObject({ category, subfields: {} });
  }, [category]);

  useEffect(() => {
    const total = recipientAndAmount.reduce(
      (sum, item) => sum + Number(item.amount),
      0,
    );
    setAmount(total.toString());
  }, [recipientAndAmount]);

  useEffect(() => {
    if (!recipientAndAmount) return;

    recipientAndAmount.forEach((item, i) => {
      if (
        item.recipient &&
        recipientAndAmount.indexOf(
          recipientAndAmount.find(
            (a) => item.recipient === a.recipient,
          ) as IRecipientAndAmount,
        ) !== i
      ) {
        setValidRecipient((prev) => {
          const copyArray = [...prev];
          copyArray[i] = false;
          return copyArray;
        });
      } else {
        setValidRecipient((prev) => {
          const copyArray = [...prev];
          copyArray[i] = true;
          return copyArray;
        });
      }
    });
  }, [recipientAndAmount]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const recipients = recipientAndAmount.map((r) => r.recipient);
      const amounts = recipientAndAmount.map((a) => a.amount);
      const convertToICPFormat = convertToE8s(Number(amounts?.[0]));
      const { data: multisigVaultTx } = await create_transactions(
        activeMultisig,
        recipients?.[0],
        convertToICPFormat,
        "ICP",
      );

      if (multisigVaultTx) {
        queueNotification({
          header: "Success",
          message: "New Transaction Created.",
          status: NotificationStatus.SUCCESS,
        });
        setSuccess(true);
      } else {
        queueNotification({
          header: "Error.",
          message: "Please try again.",
          status: NotificationStatus.ERROR,
        });
        setFailure(true);
        setLoading(false);
      }
    } catch (err) {
      console.log(err);
      setNewTxn?.((prev) => !prev);
      onCancel?.();
      setFailure(true);
      setLoading(false);
      queueNotification({
        header: "Error.",
        message: "Please try again.",
        status: NotificationStatus.ERROR,
      });
    }
  };

  const AddAddressModal = ({ defaultAddress }: { defaultAddress: string }) => {
    const [addAddressName, setAddAddressName] = useState("");
    const [addAddressLoading, setAddAddressLoading] = useState(false);

    const handleAddAddress = async () => {
      setAddAddressLoading(true);
      const newAddresses = await addToAddressBook({
        address: defaultAddress,
        addressBook,
        name: addAddressName,
      } as any);
      setAddAddressLoading(false);
      if (newAddresses) {
        setAutoCompleteAddresses(
          newAddresses.map((item) => ({
            label: <AddressComponent name={item.name} address={item.address} />,
            value: item.address,
          })),
        );
      }
      setShowAddressModal(false);
      queueNotification({
        header: "Successful!",
        message: "Your Address has been Added.",
        status: NotificationStatus.SUCCESS,
      });
    };
    return (
      <>
        <Modal
          centered
          title={
            <h3 className="text-white mb-8 text-lg font-semibold">
              Add Address
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
          open={showAddressModal}
          className="w-auto min-w-[500px] scale-90 origin-center"
        >
          <Form className="my-0 w-[560px]">
            <div className="flex flex-col gap-y-3">
              <label
                className="text-primary text-xs leading-[13px] font-normal"
                htmlFor="name"
              >
                Name
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
                  onChange={(e) => setAddAddressName(e.target.value)}
                  value={addAddressName}
                />
              </Form.Item>
            </div>
            <div className="flex flex-col gap-y-3 mt-5">
              <label
                className="text-primary text-xs leading-[13px] font-normal"
                htmlFor="address"
              >
                Address
              </label>
              <Form.Item
                name="address"
                rules={[]}
                className="border-0 outline-0 my-0 p-0"
              >
                <Input
                  className="text-sm font-normal leading-[15px] outline-0 p-2.5 placeholder:text-[#505050] border-2 border-dashed border-[#505050] rounded-lg text-white pr-24"
                  id="address"
                  defaultValue={defaultAddress}
                  disabled={true}
                />
              </Form.Item>
            </div>
            <div className="flex items-center justify-between gap-x-5 mt-[30px]">
              <CancelBtn onClick={() => setShowAddressModal(false)} />
              <ModalBtn
                loading={addAddressLoading}
                disabled={!addAddressName || !defaultAddress}
                title="Add"
                onClick={handleAddAddress}
              />
            </div>
          </Form>
        </Modal>
      </>
    );
  };

  return (
    <>
      {success ? (
        <TransactionSuccessScreen
          successMessage="Transaction in Progress!"
          waitMessage="All Threshold Signatories need to Approve the Transaction."
          amount={amount}
          txnHash={transactionData?.callHash}
          created_at={transactionData?.created_at || new Date()}
          sender={address}
          recipients={recipientAndAmount.map((item) => item.recipient)}
          onDone={() => {
            setNewTxn?.((prev) => !prev);
            onCancel?.();
          }}
        />
      ) : failure ? (
        <TransactionFailedScreen
          onDone={() => {
            setNewTxn?.((prev) => !prev);
            onCancel?.();
          }}
          txnHash={transactionData?.callHash || ""}
          sender={address}
          failedMessage="Oh no! Something went wrong."
          waitMessage="Your transaction has failed due to some technical error. Please try again...Details of the transaction are included below"
          created_at={new Date()}
        />
      ) : (
        <Spin
          wrapperClassName={className}
          spinning={loading}
          indicator={<LoadingLottie message={loadingMessages} />}
        >
          <Form
            className={classNames("max-h-[68vh] overflow-y-auto px-2")}
            form={form}
            validateMessages={{ required: "Please add the '${name}'" }}
          >
            <section>
              <p className="text-primary font-normal text-xs leading-[13px]">
                Sending from
              </p>
              <div className="flex items-center gap-x-[10px] mt-[14px]">
                <article className="w-[500px] p-[10px] border-2 border-dashed border-bg-secondary rounded-lg flex items-center justify-between">
                  <AddressComponent
                    withBadge={false}
                    address={activeMultisig}
                  />
                  <Balance
                    address={activeMultisig}
                    onChange={setMultisigBalance}
                    isCkbtc={selectedToken === "ckBTC"}
                  />
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
                    {recipientAndAmount.map(({ recipient }, i) => (
                      <article
                        key={recipient}
                        className="w-[500px] flex items-start gap-x-2"
                      >
                        {selectedToken !== "ckBTC" && (
                          <>
                            <AddAddressModal defaultAddress={recipient} />
                            <div className="w-[55%]">
                              <label className="text-primary font-normal text-xs leading-[13px] block mb-[5px]">
                                Recipient*
                              </label>
                              <Form.Item
                                name="recipient"
                                rules={[{ required: true }]}
                                help={
                                  (!recipient &&
                                    "Recipient Address is Required") ||
                                  (!validRecipient[i] &&
                                    "Please add a valid Address")
                                }
                                className="border-0 outline-0 my-0 p-0"
                                validateStatus={
                                  recipient && validRecipient[i]
                                    ? "success"
                                    : "error"
                                }
                              >
                                <div className="h-[50px]">
                                  {recipient &&
                                  autocompleteAddresses.some(
                                    (item) =>
                                      item.value &&
                                      String(item.value) === recipient,
                                  ) ? (
                                    <div className="border border-solid border-primary rounded-lg px-2 h-full flex justify-between items-center">
                                      {
                                        autocompleteAddresses.find(
                                          (item) =>
                                            item.value &&
                                            String(item.value) === recipient,
                                        )?.label
                                      }
                                      <button
                                        className="outline-none border-none bg-highlight w-6 h-6 rounded-full flex items-center justify-center z-100"
                                        onClick={() => {
                                          onRecipientChange("", i);
                                        }}
                                      >
                                        <OutlineCloseIcon className="text-primary w-2 h-2" />
                                      </button>
                                    </div>
                                  ) : (
                                    <AutoComplete
                                      autoFocus
                                      defaultOpen
                                      filterOption={(inputValue, options) => {
                                        return inputValue && options?.value
                                          ? String(options?.value) ===
                                              inputValue
                                          : true;
                                      }}
                                      notFoundContent={
                                        validRecipient[i] && (
                                          <Button
                                            icon={
                                              <PlusCircleOutlined className="text-primary" />
                                            }
                                            className="bg-transparent border-none outline-none text-primary text-sm flex items-center"
                                            onClick={() =>
                                              setShowAddressModal(true)
                                            }
                                          >
                                            Add Address to Address Book
                                          </Button>
                                        )
                                      }
                                      options={autocompleteAddresses.filter(
                                        (item) =>
                                          !recipientAndAmount.some(
                                            (r) =>
                                              r.recipient &&
                                              item.value &&
                                              r.recipient ===
                                                (String(item.value) || ""),
                                          ),
                                      )}
                                      id="recipient"
                                      placeholder="Send to Address.."
                                      onChange={(value) =>
                                        onRecipientChange(value, i)
                                      }
                                      value={recipientAndAmount[i].recipient}
                                      defaultValue={
                                        defaultSelectedAddress || ""
                                      }
                                    />
                                  )}
                                </div>
                              </Form.Item>
                            </div>
                          </>
                        )}
                        <div
                          className={`flex items-center gap-x-2 w-[${
                            selectedToken === "ckBTC" ? "100%" : "45%"
                          }]`}
                        >
                          <BalanceInput
                            label="Amount*"
                            fromBalance={multisigBalance}
                            onChange={(balance) => onAmountChange(balance, i)}
                            setToken={setSelectedToken}
                          />
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-y-4">
                  <article className="w-[412px] flex items-center">
                    <span className="-mr-1.5 z-0">
                      <LineIcon className="text-5xl" />
                    </span>
                    <p className="p-3 bg-bg-secondary rounded-xl font-normal text-sm text-text_secondary leading-[15.23px]">
                      The beneficiary will have access to the transferred fees
                      when the transaction is included in a block.
                    </p>
                  </article>
                  <article className="w-[412px] flex items-center">
                    <span className="-mr-1.5 z-0">
                      <LineIcon className="text-5xl" />
                    </span>
                    <p className="p-3 bg-bg-secondary rounded-xl font-normal text-sm text-text_secondary leading-[15.23px] -mb-5">
                      If the recipient account is new, the balance needs to be
                      more than the existential deposit. Likewise if the sending
                      account balance drops below the same value, the account
                      will be removed from the state.
                    </p>
                  </article>
                </div>
              </div>
            </section>

            {selectedToken === "ckBTC" ? (
              <section className="mt-[15px] w-[500px]">
                <label className="text-primary font-normal text-xs block mb-[5px]">
                  Send Mode*
                </label>
                <Form.Item
                  name="send_mode"
                  rules={[{ message: "Required", required: true }]}
                  className="border-0 outline-0 my-0 p-0"
                >
                  <Dropdown
                    trigger={["click"]}
                    className={
                      "border border-primary rounded-lg p-2 bg-bg-secondary cursor-pointer"
                    }
                    menu={{
                      items: sendModeOptions,
                      onClick: (e) => setSendMode(e.key as ESendMode),
                    }}
                  >
                    <div className="flex justify-between items-center text-white">
                      {sendMode}
                      <CircleArrowDownIcon className="text-primary" />
                    </div>
                  </Dropdown>
                </Form.Item>
                <label className="text-primary font-normal text-xs block mb-[5px] mt-[10px]">
                  To*
                </label>
                <Form.Item
                  name="ckBTC"
                  rules={[{ message: "Required", required: true }]}
                  className="border-0 outline-0 my-0 p-0"
                >
                  <Input
                    placeholder={
                      sendMode === ESendMode.WITHDRAW
                        ? "Please enter you bitcoin wallet"
                        : "Enter Pricipal ID or Account ID"
                    }
                    className="w-full text-sm font-normal leading-[15px] border-0 outline-0 p-3 placeholder:text-[#505050] bg-bg-secondary rounded-lg text-white pr-24 resize-none"
                    value={ckBTCAddress}
                    onChange={(e) => setCkBTCAddress(e.target.value)}
                  />
                </Form.Item>
              </section>
            ) : null}

            <section className="mt-[15px] w-[500px]">
              <label className="text-primary font-normal text-xs block mb-[5px]">
                Category*
              </label>
              <Form.Item
                name="category"
                rules={[{ message: "Required", required: true }]}
                className="border-0 outline-0 my-0 p-0"
              >
                <Dropdown
                  trigger={["click"]}
                  className={
                    "border border-primary rounded-lg p-2 bg-bg-secondary cursor-pointer"
                  }
                  menu={{
                    items: [
                      ...Object.keys(transactionFields)
                        .filter((c) => c !== "none")
                        .map((c) => ({
                          key: c,
                          label: (
                            <span className="text-white">
                              {transactionFields[c]?.fieldName}
                            </span>
                          ),
                        })),
                      {
                        key: "none",
                        label: <span className="text-white">Other</span>,
                      },
                    ],
                    onClick: (e) => setCategory(e.key),
                  }}
                >
                  <div className="flex justify-between items-center text-white">
                    {transactionFields[category]?.fieldName}
                    <CircleArrowDownIcon className="text-primary" />
                  </div>
                </Dropdown>
              </Form.Item>
            </section>

            {transactionFields[category] &&
              transactionFields[category].subfields &&
              Object.keys(transactionFields[category].subfields).map(
                (subfield) => {
                  const subfieldObject =
                    transactionFields[category].subfields[subfield];
                  return (
                    <section key={subfield} className="mt-[15px]">
                      <label className="text-primary font-normal text-xs block mb-[5px]">
                        {subfieldObject.subfieldName}
                        {subfieldObject.required && "*"}
                      </label>
                      <div className="">
                        <article className="w-[500px]">
                          {subfieldObject.subfieldType ===
                            EFieldType.SINGLE_SELECT &&
                          subfieldObject.dropdownOptions ? (
                            <Form.Item
                              name={`${subfieldObject.subfieldName}`}
                              rules={[
                                {
                                  message: "Required",
                                  required: subfieldObject.required,
                                },
                              ]}
                              className="border-0 outline-0 my-0 p-0"
                              // help={(!transactionFieldsObject.subfields[subfield]?.value) && subfieldObject.required && `${subfieldObject.subfieldName} is Required.`}
                              // validateStatus={(!transactionFieldsObject.subfields[subfield]?.value) && subfieldObject.required ? 'error' : 'success'}
                            >
                              <Dropdown
                                trigger={["click"]}
                                className={
                                  "border border-primary rounded-lg p-2 bg-bg-secondary cursor-pointer"
                                }
                                menu={{
                                  items: subfieldObject.dropdownOptions
                                    ?.filter((item) => !item.archieved)
                                    .map((item) => ({
                                      key: item.optionName,
                                      label: (
                                        <span className="text-white">
                                          {item.optionName}
                                        </span>
                                      ),
                                    })),
                                  onClick: (e) => {
                                    setTransactionFieldsObject((prev) => ({
                                      category:
                                        transactionFields[category].fieldName,
                                      subfields: {
                                        ...prev.subfields,
                                        [subfield]: {
                                          name: subfieldObject.subfieldName,
                                          value: e.key,
                                        },
                                      },
                                    }));
                                  },
                                }}
                              >
                                <div className="flex justify-between items-center text-white">
                                  {transactionFieldsObject.subfields[subfield]
                                    ?.value ? (
                                    transactionFieldsObject.subfields[subfield]
                                      ?.value
                                  ) : (
                                    <span className="text-text_secondary">
                                      Select {subfieldObject.subfieldName}
                                    </span>
                                  )}
                                  <CircleArrowDownIcon className="text-primary" />
                                </div>
                              </Dropdown>
                            </Form.Item>
                          ) : (
                            <Form.Item
                              name={subfield}
                              rules={[
                                {
                                  message: "Required",
                                  required: subfieldObject.required,
                                },
                              ]}
                              className="border-0 outline-0 my-0 p-0"
                            >
                              <div className="flex items-center h-[40px]">
                                <Input
                                  placeholder={`${subfieldObject.subfieldName}`}
                                  className="w-full text-sm font-normal leading-[15px] border-0 outline-0 p-3 placeholder:text-[#505050] bg-bg-secondary rounded-lg text-white pr-24 resize-none"
                                  id={subfield}
                                  value={
                                    transactionFieldsObject.subfields[subfield]
                                      ?.value
                                  }
                                  onChange={(e) =>
                                    setTransactionFieldsObject((prev) => ({
                                      category:
                                        transactionFields[category].fieldName,
                                      subfields: {
                                        ...prev.subfields,
                                        [subfield]: {
                                          name: subfieldObject.subfieldName,
                                          value: e.target.value,
                                        },
                                      },
                                    }))
                                  }
                                />
                              </div>
                            </Form.Item>
                          )}
                        </article>
                      </div>
                    </section>
                  );
                },
              )}

            <section className="mt-[15px]">
              <label className="text-primary font-normal text-xs block mb-7">
                Note
              </label>
              <div className="">
                <article className="w-[500px]">
                  <Form.Item
                    name="note"
                    rules={[]}
                    className="border-0 outline-0 my-0 p-0"
                  >
                    <div className="flex items-center h-[40px]">
                      <Input.TextArea
                        placeholder="Note"
                        className="w-full text-sm font-normal leading-[15px] border-0 outline-0 p-3 placeholder:text-[#505050] bg-bg-secondary rounded-lg text-white pr-24 resize-none"
                        id="note"
                        rows={4}
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                      />
                    </div>
                  </Form.Item>
                </article>
              </div>
            </section>
          </Form>
          <section className="flex items-center gap-x-5 justify-center mt-10">
            <CancelBtn className="w-[250px]" onClick={onCancel} />
            <ModalBtn
              disabled={
                recipientAndAmount.some(
                  (item) =>
                    item.recipient === "" ||
                    item.amount === "0" ||
                    !item.amount,
                ) ||
                // Number(amount) > Number(multisigBalance) ||
                Object.keys(transactionFields[category].subfields).some(
                  (key) =>
                    !transactionFieldsObject.subfields[key]?.value &&
                    transactionFields[category].subfields[key].required,
                )
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

export default styled(SendFundsForm)`
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
