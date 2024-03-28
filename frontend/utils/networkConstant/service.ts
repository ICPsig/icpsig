import { BigNumber } from "@ethersproject/bignumber";
import type { PopulatedTransaction } from "@ethersproject/contracts";
import { Contract, ethers } from "ethers";
import { ERC20_ABI, ERC20_FALLBACK_FEE } from "./networkConstant";
import { CovalentClient } from "@covalenthq/client-sdk";

import {
  Erc20ContractAddress,
  Erc20Metadata,
  Erc20PopulateTransaction,
  ETH_ADDRESS,
  ETHEREUM_NETWORK_ID,
  ETHEREUM_SYMBOL,
  TransferParams,
} from "../eth/servcieTypes";
import { ethPrepareTransaction } from "../eth/ethService";
import { erc20PrepareTransaction } from "../eth/erc20Service";
import { provider, sendTransaction } from "../eth/providers";

export const ethAddressData = async ({
  address,
}: Pick<Erc20ContractAddress, "address">): Promise<Erc20Metadata> => {
  const erc20Contract = new ethers.Contract(address, ERC20_ABI, provider);

  const [name, symbol, decimals] = await Promise.all([
    erc20Contract.name(),
    erc20Contract.symbol(),
    erc20Contract.decimals(),
  ]);

  return {
    name,
    symbol,
    decimals,
  };
};

export const ethBalanceCovalent = async (address: string) => {
  const client = new CovalentClient("cqt_rQgtV86Yc4vT6PQ3ffh8vbJtWT7w");
  const resp = await client.BalanceService.getTokenBalancesForWalletAddress(
    "eth-mainnet",
    address,
  );
  return resp.data;
};

export const erc20Balance = async ({
  contract: { address: contractAddress },
  address,
}: {
  contract: Erc20ContractAddress;
  address: ETH_ADDRESS;
}): Promise<BigNumber> => {
  const erc20Contract = new ethers.Contract(
    contractAddress,
    ERC20_ABI,
    provider,
  );

  return erc20Contract.balanceOf(address);
};

export const getEthFeeData = async ({
  contract: { address: contractAddress },
  address,
  amount,
}: {
  contract: Erc20ContractAddress;
  address: ETH_ADDRESS;
  amount: BigNumber;
}): Promise<BigNumber> => {
  try {
    const erc20Contract = new ethers.Contract(
      contractAddress,
      ERC20_ABI,
      provider,
    );
    return erc20Contract.estimateGas.approve(address, amount);
  } catch (error) {
    return BigNumber.from(ERC20_FALLBACK_FEE);
  }
};

// Transaction send: https://ethereum.stackexchange.com/a/131944

export const populateErc20Transaction: Erc20PopulateTransaction = async ({
  contract: { address: contractAddress },
  to,
  amount,
}: {
  contract: Erc20ContractAddress;
  to: ETH_ADDRESS;
  amount: BigNumber;
}): Promise<PopulatedTransaction> => {
  console.log({ contractAddress });
  const erc20Contract = new Contract(contractAddress, ERC20_ABI, provider);
  return erc20Contract.populateTransaction.transfer(to, amount);
};

export const getTransactionCount = (address: ETH_ADDRESS): Promise<number> =>
  provider.getTransactionCount(address, "pending");

export const send = async ({
  token,
  from,
  to,
  maxFeePerGas,
  maxPriorityFeePerGas,
  gas,
  network,
  signTransaction,
  vault,
  gasPrice,
  ...rest
}: Omit<TransferParams, "maxPriorityFeePerGas" | "maxFeePerGas"> &
  any &
  Pick<any, "gas"> & {
    maxFeePerGas: BigNumber;
    maxPriorityFeePerGas: BigNumber;
  }): Promise<{ hash: string }> => {
  const nonce = await getTransactionCount(from);

  console.log(nonce);
  console.log(token.id === Symbol(ETHEREUM_SYMBOL));
  console.log(token.id, token?.contract?.address);

  const transaction = await (!token?.contract?.address
    ? ethPrepareTransaction({
        ...rest,
        from,
        to,
        nonce,
        gas: gas?.toBigInt(),
        maxFeePerGas: maxFeePerGas?.toBigInt() || 0,
        maxPriorityFeePerGas: maxPriorityFeePerGas?.toBigInt() || 0,
        vault,
      })
    : erc20PrepareTransaction({
        ...rest,
        from,
        to,
        token,
        nonce,
        gas: gas?.toBigInt(),
        maxFeePerGas: maxFeePerGas?.toBigInt() || 0,
        maxPriorityFeePerGas: maxPriorityFeePerGas?.toBigInt() || 0,
        populate: populateErc20Transaction,
        vault,
      }));

  const rawTransaction = await signTransaction(transaction);
  console.log(rawTransaction);
  const sign_hex = rawTransaction.data.Ok.signature_hex;
  const sign_hex2 = rawTransaction.data.Ok.signed_hash;

  console.log(sign_hex, "sign_hex");
  console.log(sign_hex2, "sign_hex");
  const transactionSent = await sendTransaction(sign_hex2);
  return { hash: transactionSent.hash };
};
