import {
  FeeData,
  InfuraProvider,
  TransactionResponse,
} from "@ethersproject/providers";
import { NETWORK } from "../networkConstant/networkConstant";
import { ETH_ADDRESS } from "./servcieTypes";
import { BigNumber } from "@ethersproject/bignumber";

const API_KEY = "1594957eee3845fa9b9ce216ac3d2b68";
export const provider = new InfuraProvider(NETWORK, API_KEY);

export const sendTransaction = (
  signedTransaction: string,
): Promise<TransactionResponse> => provider.sendTransaction(signedTransaction);

export const getFeeData = (): Promise<FeeData> => provider.getFeeData();

export const ethBalance = (address: ETH_ADDRESS): Promise<BigNumber> =>
  provider.getBalance(address);
