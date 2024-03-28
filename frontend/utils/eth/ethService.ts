import { ETH_BASE_FEE, ETH_CHAIN_ID } from "../networkConstant/networkConstant";
import { SignRequest, TransferParams } from "./servcieTypes";

export const ethPrepareTransaction = async ({
  to,
  amount,
  maxPriorityFeePerGas: max_priority_fee_per_gas,
  maxFeePerGas: max_fee_per_gas,
  nonce,
  gas,
  data,
  vault,
}: TransferParams & {
  nonce: number;
  gas: bigint | undefined;
}): Promise<SignRequest> => ({
  to,
  value: amount.toBigInt(),
  chain_id: ETH_CHAIN_ID,
  nonce: BigInt(nonce),
  gas: gas ?? ETH_BASE_FEE,
  max_fee_per_gas,
  max_priority_fee_per_gas,
  data: null,
  vault,
});
