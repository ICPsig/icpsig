// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import ManageMultisig from "@frontend/components/Settings/ManageMultisig";
import TransactionFields from "@frontend/components/Settings/TransactionFields";
import TwoFactorAuth from "@frontend/components/Settings/TwoFactorAuth";
import { useGlobalUserDetailsContext } from "@frontend/context/UserDetailsContext";
import Loader from "@frontend/ui-components/Loader";

enum ETab {
  SIGNATORIES,
  ADMIN,
}

const Settings = () => {
  const [tab, setTab] = useState(ETab.SIGNATORIES);
  const [loading, setLoading] = useState<boolean>(true);
  const { activeMultisig } = useGlobalUserDetailsContext();

  useEffect(() => {
    if (activeMultisig) {
      setLoading(false);
    }
  }, [activeMultisig]);

  if (loading) {
    return <Loader size="large" />;
  }
  return (
    <div className="scale-[80%] h-[125%] w-[125%] origin-top-left">
      <div className="flex items-center mb-5">
        <button
          onClick={() => setTab(ETab.SIGNATORIES)}
          className={classNames(
            "rounded-lg p-3 text-sm leading-[15px] w-[110px] text-white",
            {
              "text-primary bg-highlight": tab === ETab.SIGNATORIES,
            },
          )}
        >
          {/* <QueueIcon /> */}
          Signatories
        </button>
        <button
          onClick={() => setTab(ETab.ADMIN)}
          className={`rounded-lg p-3 text-sm leading-[15px] w-[110px] text-white ${
            tab === ETab.ADMIN && "text-primary bg-highlight"
          }`}
        >
          Admin{" "}
          <span className="bg-success text-bg-secondary text-xs py-[2px] px-2 rounded-lg">
            New
          </span>
        </button>
      </div>
      {tab === ETab.SIGNATORIES ? <ManageMultisig /> : <TwoFactorAuth />}
    </div>
  );
};

export default Settings;
