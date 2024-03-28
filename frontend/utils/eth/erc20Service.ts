import { ETH_CHAIN_ID } from "../networkConstant/networkConstant";
import {
  Erc20PopulateTransaction,
  Erc20Token,
  SignRequest,
  TransferParams,
} from "./servcieTypes";
import { isNullish } from "@dfinity/utils";

export const erc20PrepareTransaction = async ({
  to,
  amount,
  maxPriorityFeePerGas: max_priority_fee_per_gas,
  maxFeePerGas: max_fee_per_gas,
  nonce,
  gas,
  token,
  populate,
  vault,
}: TransferParams & {
  nonce: number;
  gas: bigint;
  populate: Erc20PopulateTransaction;
} & Pick<any, "token">): Promise<SignRequest> => {
  const { contract } = token;
  const { data } = await populate({
    contract,
    to,
    amount,
  });

  if (isNullish(data)) {
    throw new Error("Erc20 transaction Data cannot be undefined or null.");
  }

  const { address: contractAddress } = contract as Erc20Token;

  return {
    to: contractAddress,
    chain_id: ETH_CHAIN_ID,
    nonce: BigInt(nonce),
    gas,
    max_fee_per_gas,
    max_priority_fee_per_gas,
    value: 0n,
    data: [data],
    vault,
  };
};
