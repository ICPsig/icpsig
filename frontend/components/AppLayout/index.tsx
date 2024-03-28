// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { Drawer, Layout } from "antd";
import { Badge } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import polkasafeLogo from "@frontend/assets/icons/polkasafe.svg";
import longIframe from "@frontend/assets/long-iframe.svg";
import shortIframe from "@frontend/assets/short-iframe.svg";
import { useActiveMultisigContext } from "@frontend/context/ActiveMultisigContext";
import { useGlobalUserDetailsContext } from "@frontend/context/UserDetailsContext";
import { FIREBASE_FUNCTIONS_URL } from "@frontend/global/firebaseFunctionsUrl";
import useHandleMetamask from "@frontend/hooks/useHandleMetamask";
import { ISharedAddressBooks } from "@frontend/types";
import Loader from "@frontend/ui-components/Loader";
import styled from "styled-components";

import Footer from "./Footer";
import Menu from "./Menu";
import NavHeader from "./NavHeader";
import SwitchRoutes from "./SwitchRoutes";

const { Content, Sider } = Layout;

export interface IRouteInfo {
  pathName: string;
  title: string;
}

const AppLayout = ({ className }: { className?: string }) => {
  const { activeMultisig } = useGlobalUserDetailsContext();
  const [sideDrawer, setSideDrawer] = useState(false);
  const [multisigChanged, setMultisigChanged] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMultisigChanged(true);
    setTimeout(() => {
      setMultisigChanged(false);
    }, 500);
    setLoading(true);
  }, [activeMultisig]);

  return (
    <Layout className={className}>
      <NavHeader setSideDrawer={setSideDrawer} sideDrawer={sideDrawer} />
      <Layout hasSider style={{ transition: "ease-in-out 1s" }}>
        <>
          <Sider
            trigger={null}
            collapsible={false}
            collapsed={true}
            className={`hidden overflow-y-hidden bg-bg-main sidebar lg:block top-0 bottom-0 left-0 h-screen w-full max-w-[180px] absolute z-10`}
          >
            <Menu />
          </Sider>
          <Drawer
            placement="left"
            closable={false}
            onClose={() => setSideDrawer(false)}
            open={sideDrawer}
            getContainer={false}
            className="w-full max-w-[180px] p-0"
          >
            <Menu />
          </Drawer>
        </>
        <Layout className="min-h flex flex-row p-0 bg-bg-main">
          <div className={`hidden lg:block w-full max-w-[30px] absolute`}></div>
          <div
            className={`hidden lg:block w-full max-w-[180px] relative left-0px`}
          ></div>
          <>
            <Content className="bg-bg-secondary p-[30px] max-w-[100%] lg:max-w-[calc(100%-180px)] rounded-lg">
              {multisigChanged ? <Loader size="large" /> : <SwitchRoutes />}
            </Content>
          </>
        </Layout>
      </Layout>
      <Footer />
    </Layout>
  );
};

export default styled(AppLayout)`
  background: transparent !important;
  .min-h {
    min-height: calc(100vh - 70px - 60px);
  }
  .ant-drawer-content-wrapper {
    max-width: 240px;
  }
  .ant-drawer-mask {
  }
  .ant-drawer-body {
    padding: 0;
    margin: 0;
  }
`;
