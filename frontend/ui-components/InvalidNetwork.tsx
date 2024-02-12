// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import Modal from "antd/es/modal/Modal"
import React from "react"

export default function InvalidNetwork() {
  return (
    <Modal
      centered
      open={true}
      title={
        <h3 className="text-white mb-8 text-lg font-semibold">
          ERROR: Invalid Network
        </h3>
      }
      footer={null}
      closable={false}
      className="w-auto min-w-[500px] scale-90 origin-center"
    >
      <p className="text-white text-lg">
        The selected Metamask network is invalid. Please change your Metamask
        network settings.
      </p>
    </Modal>
  )
}
