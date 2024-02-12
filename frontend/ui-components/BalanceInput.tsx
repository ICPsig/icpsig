// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Dropdown, Form, Input } from "antd";
import { ItemType } from "antd/lib/menu/hooks/useItems";
import React, { useState } from "react";
import { tokens } from "@frontend/global/networkConstants";
import { CircleArrowDownIcon } from "./CustomIcons";

interface Props {
  className?: string;
  label?: string;
  fromBalance?: string;
  onChange: (balance: string) => void;
  setToken?: React.Dispatch<React.SetStateAction<string>>;
  placeholder?: string;
  defaultValue?: string;
}

export const ParachainIcon = ({
  src,
  className,
  size = 20,
}: {
  src: string;
  className?: string;
  size?: number;
}) => {
  return (
    <img
      className={`${className} block rounded-full`}
      height={size}
      width={size}
      src={src}
      alt="Chain logo"
    />
  );
};

const BalanceInput = ({
  className,
  label = "",
  onChange,
  placeholder = "",
  defaultValue = "",
  setToken,
}: Props) => {
  const [selectedToken, setSelectedToken] = useState<string>(tokens[0].name);

  const currencyOptions: ItemType[] = tokens.map((token) => ({
    key: token.name,
    label: (
      <span className="flex items-center gap-x-2 text-white">
        <ParachainIcon src={token.logo} />
        {token.symbol}
      </span>
    ) as any,
  }));

  return (
    <section className={`${className}`}>
      <label className="text-primary font-normal text-xs leading-[13px] block mb-[5px]">
        {label}
      </label>
      <div className="flex items-center gap-x-[10px]">
        <article className="w-full">
          <Form.Item
            className="border-0 outline-0 my-0 p-0"
            name="balance"
            rules={[{ required: true }]}
          >
            <div className="flex items-center h-[50px]">
              <Input
                id="balance"
                onChange={(e) => onChange(e.target.value)}
                placeholder={`${placeholder} `}
                defaultValue={defaultValue}
                className="w-full h-full text-sm font-normal leading-[15px] border-0 outline-0 p-3 placeholder:text-[#505050] bg-bg-secondary rounded-lg text-white pr-24"
              />
              <Dropdown
                trigger={["click"]}
                className={className}
                menu={{
                  items: currencyOptions,
                  onClick: (e) => {
                    setSelectedToken(e.key);
                    setToken?.(e.key);
                  },
                }}
              >
                <div className="absolute right-0 flex gap-x-1 cursor-pointer items-center justify-center pr-3 text-white">
                  <ParachainIcon
                    src={
                      tokens.find((item) => item.name === selectedToken)
                        ?.logo || ""
                    }
                  />
                  {selectedToken}
                  <CircleArrowDownIcon className="text-primary" />
                </div>
              </Dropdown>
            </div>
          </Form.Item>
        </article>
      </div>
    </section>
  );
};

export default BalanceInput;
