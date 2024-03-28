import { isNullish } from "@dfinity/utils";
import { BigNumber } from "@ethersproject/bignumber";
import { FeeData } from "@ethersproject/providers";

export type TransactionFeeData = Pick<
  FeeData,
  "maxFeePerGas" | "maxPriorityFeePerGas"
> & {
  gas: BigNumber;
};

export const maxGasFee = ({
  maxFeePerGas,
  gas: estimatedGasFee,
}: TransactionFeeData): BigNumber | undefined =>
  isNullish(maxFeePerGas) ? undefined : maxFeePerGas.mul(estimatedGasFee);

export const minGasFee = ({
  maxPriorityFeePerGas,
  gas: estimatedGasFee,
}: TransactionFeeData): BigNumber =>
  (maxPriorityFeePerGas ?? BigNumber.from(0)).mul(estimatedGasFee);
