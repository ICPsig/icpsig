// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { Layout } from "antd";
// import { PolkadotIcon } from "@frontend/ui-components/CustomIcons"
import React from "react";
import { Link } from "react-router-dom";

const { Footer: AntdFooter } = Layout;

const Footer = () => {
  return (
    <AntdFooter className="flex text-white bg-bg-main flex-row items-center p-0 lg:h-[60px] shadow-top">
      <div className="hidden lg:block w-[180px]"></div>
      <section className="flex-1 text-xs flex flex-col py-[30px] lg:py-0 lg:items-center lg:flex-row lg:justify-between gap-x-2 gap-y-3 px-[30px]">
        <div className="flex gap-2 md:gap-10 items-center justify-between">
          <p className="hidden md:block">
            <sup>&#169;</sup>
            All Rights Reserved
          </p>
          <Link to="/terms-and-conditions">Terms & Conditions</Link>
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/contact-us">Contact Us</Link>
          <a
            href="https://polkasafe.hellonext.co/b/bugs-feedback"
            target="_blank"
            rel="noreferrer"
          >
            Report Bug
          </a>
          <a
            href="https://polkasafe.hellonext.co/b/bugs-feedback"
            target="_blank"
            rel="noreferrer"
          >
            Feature Request
          </a>
        </div>
        <p className="flex items-center gap-x-2">
          {/* <PolkadotIcon className="text-sm" /> */}
          <span className="text-sm">Built By Grants From ICP Treasury</span>
        </p>
        <p className="md:hidden">
          <sup>&#169;</sup>
          All Rights Reserved
        </p>
      </section>
    </AntdFooter>
  );
};

export default Footer;
