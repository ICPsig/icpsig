import { BigNumber } from "@ethersproject/bignumber";
import type {
  BaseContract,
  PopulatedTransaction,
} from "@ethersproject/contracts";
export type Exchange = "ethereum" | "erc20" | "icp";
export type Erc20ContractAddress = Pick<BaseContract, "address">;
export type Erc20Contract = Erc20ContractAddress & { exchange: Exchange };

import eth from "@frontend/assets/icons/eth.svg";
import uniswap from "@frontend/assets/icons/uniswap.svg";
import usdc from "@frontend/assets/icons/usdc.svg";
import usdt from "@frontend/assets/icons/usdt.svg";
import dai from "@frontend/assets/icons/dai.svg";
import oneInch from "@frontend/assets/icons/1inch.svg";
import icpDark from "@frontend/assets/icons/icp_dark.svg";

export interface TransferParams {
  from: string;
  to: string;
  amount: BigNumber;
  maxPriorityFeePerGas: bigint;
  maxFeePerGas: bigint;
  data?: string;
  vault?: string;
}

export type ETH_ADDRESS = string;
export interface Erc20Metadata {
  name: string;
  symbol: string;
  decimals: number;
  icon?: string;
}

export interface SignRequest {
  to: string;
  gas: bigint;
  value: bigint;
  max_priority_fee_per_gas: bigint;
  data: [] | [string];
  max_fee_per_gas: bigint;
  chain_id: bigint;
  nonce: bigint;
  vault?: string;
}

export type Erc20PopulateTransaction = (
  params: PopulateTransactionParams & {
    amount: BigNumber;
  },
) => Promise<PopulatedTransaction>;

export interface PopulateTransactionParams {
  contract: Erc20ContractAddress;
  to: ETH_ADDRESS;
}

export type Erc20Token = Erc20Contract & Token;

export type Token = {
  id: TokenId;
  network: Network;
  standard: TokenStandard;
} & TokenMetadata;

export type NetworkId = symbol;

export type TokenStandard = "ethereum" | "erc20" | "icp" | "icrc";

export type TokenId = symbol;

export interface TokenMetadata {
  name: string;
  symbol: string;
  decimals: number;
  icon?: string;
}

export interface Network {
  id: NetworkId;
  name: string;
  icon: string;
}

export interface TokenMetadata {
  name: string;
  symbol: string;
  decimals: number;
  icon?: string;
}

export interface Network {
  id: NetworkId;
  name: string;
  icon: string;
}

export const ETHEREUM_SYMBOL = "ETH";

export const ETHEREUM_NETWORK_ID = Symbol(ETHEREUM_SYMBOL);

export const ETHEREUM_NETWORK: Network = {
  id: ETHEREUM_NETWORK_ID,
  name: "Ethereum",
  icon: eth,
};

export const ETHEREUM_TOKEN: Required<Token> = {
  id: ETHEREUM_NETWORK_ID,
  network: ETHEREUM_NETWORK,
  standard: "ethereum",
  name: "Ethereum",
  symbol: ETHEREUM_SYMBOL,
  decimals: 18,
  icon: eth,
};

export const mapErc20Token = ({
  symbol,
  name,
  ...rest
}: Erc20Contract & Erc20Metadata & { balance: string }): Erc20Token => ({
  id: Symbol(symbol),
  network: ETHEREUM_NETWORK,
  standard: "erc20",
  name,
  symbol,
  icon: mapErc20Icon(symbol),
  ...rest,
});

const mapErc20Icon = (symbol: string): string | undefined => {
  switch (symbol.toLowerCase()) {
    case "uni":
      return uniswap;
    case "usdc":
      return usdc;
    case "usdt":
      return usdt;
    case "dai":
      return dai;
    case "1inch":
      return oneInch;
    // ICP in production. ckICP was used on staging because the definitive name and symbol had not been decided.
    case "icp":
    case "ckicp":
      return icpDark;
    default:
      return undefined;
  }
};
