import { Avatar } from "antd";
import React from "react";

export default function MetaMaskAvtar({
  address,
  size = 40,
}: {
  address: string;
  size: number;
}) {
  return <Avatar size={size} alt={address} />;
}
