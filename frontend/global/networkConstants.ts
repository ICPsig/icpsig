// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import astarLogo from "@frontend/assets/astar-logo.png"
import dfinityLogo from "@frontend/assets/parachains-icons/dfinity-logo.png"
import ckBTCLogo from "@frontend/assets/parachains-icons/ckBTC-logo.jpeg"
import dragginZLogo from "@frontend/assets/parachains-icons/dragginz-logo.jpeg"
import wrappedICPLogo from "@frontend/assets/parachains-icons/wrapped-icp-logo.jpeg"
import chatLogo from "@frontend/assets/parachains-icons/chat-logo.png"
import kinicLogo from "@frontend/assets/parachains-icons/kinic-logo.png"
import hotNotLogo from "@frontend/assets/parachains-icons/hot-not-logo.png"
// import ethereumLogo from 'frontend/assets/eth.png';
// import polygonLogo from 'frontend/assets/polygon.png';
import { ChainPropType, TokenProperties } from "@frontend/types"

export enum NETWORK {
  GOERLI = "goerli",
  POLYGON = "polygon",
  ASTAR = "astar",
}
export const tokenSymbol = {
  ASTAR: "ASTR",
  GOERLI: "GOER",
  POLYGON: "MATIC",
}

export const chainProperties: ChainPropType = {
  // [NETWORK.GOERLI]: {
  // blockExplorer: 'https://goerli.etherscan.io',
  // chainId: '0x5',
  // chainNamespace: CHAIN_NAMESPACES.EIP155,
  // decimals: 18,
  // displayName: 'Goerli',
  // logo: ethereumLogo,
  // rpcTarget: 'https://goerli.blockpi.network/v1/rpc/public',
  // ticker: 'ETH',
  // tickerName: 'GoerliETH'
  // },
  // [NETWORK.POLYGON]: {
  // blockExplorer: 'https://polygonscan.com/',
  // chainId: '0x89',
  // chainNamespace: CHAIN_NAMESPACES.EIP155,
  // decimals: 18,
  // displayName: 'Polygon',
  // logo: polygonLogo,
  // rpcTarget: 'https://polygon-rpc.com/',
  // ticker: 'MATIC',
  // tickerName: 'Matic'
  // },
  [NETWORK.ASTAR]: {
    blockExplorer: "https://astar.subscan.io",
    chainId: "0x250",
    chainNamespace: "",
    decimals: 18,
    displayName: "Astar",
    logo: astarLogo,
    rpcTarget: "https://evm.astar.network/",
    ticker: "ASTR",
    tickerName: "Astar",
  },
}

export const tokens: TokenProperties[] = [
  {
    symbol: "ICP",
    canisterId: "ryjl3-tyaaa-aaaaa-aaaba-cai",
    name: "ICP",
    decimals: 8,
    standard: "ROSETTA",
    fee: 10000,
    amount: 1.5,
    logo: dfinityLogo,
    priceChange: 4.462883997285273,
    error: false,
  },
  {
    symbol: "ckBTC",
    canisterId: "mxzaz-hqaaa-aaaar-qaada-cai",
    name: "ckBTC",
    decimals: 8,
    standard: "ICRC1",
    fee: 10,
    amount: 0,
    logo: ckBTCLogo,
    priceChange: 2.5666343196806336,
    error: false,
  },
  {
    symbol: "SNS1",
    canisterId: "zfcdd-tqaaa-aaaaq-aaaga-cai",
    name: "Dragginz",
    decimals: 8,
    standard: "ICRC1",
    fee: 1000,
    amount: 0,
    logo: dragginZLogo,
    priceChange: 8.676769773718082,
    error: false,
  },
  {
    symbol: "CHAT",
    canisterId: "2ouva-viaaa-aaaaq-aaamq-cai",
    name: "CHAT",
    decimals: 8,
    standard: "ICRC1",
    fee: 100000,
    amount: 0,
    logo: chatLogo,
    priceChange: 5.1375721202632585,
    error: false,
  },
  {
    symbol: "KINIC",
    canisterId: "73mez-iiaaa-aaaaq-aaasq-cai",
    name: "KINIC",
    decimals: 8,
    standard: "ICRC1",
    fee: 100000,
    amount: 0,
    logo: kinicLogo,
    priceChange: 2.8253883235136636,
    error: false,
  },
  {
    symbol: "HOT",
    canisterId: "6rdgd-kyaaa-aaaaq-aaavq-cai",
    name: "HotOrNot",
    decimals: 8,
    standard: "ICRC1",
    fee: 100000,
    amount: 0,
    logo: hotNotLogo,
    priceChange: -18.916043279697494,
    error: false,
  },
  {
    symbol: "WICP",
    canisterId: "utozz-siaaa-aaaam-qaaxq-cai",
    name: "Wrapped ICP",
    decimals: 8,
    standard: "WICP",
    fee: 0,
    amount: 0,
    logo: wrappedICPLogo,
    priceChange: null,
    error: false,
  },
  {
    symbol: "XTC",
    canisterId: "aanaa-xaaaa-aaaah-aaeiq-cai",
    name: "Cycles",
    decimals: 12,
    standard: "XTC",
    fee: 2000000000,
    amount: 0,
    logo: dfinityLogo,
    priceChange: 3.7805254289579224,
    error: false,
  },
]
