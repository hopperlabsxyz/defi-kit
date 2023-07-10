/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  IMultiSend,
  IMultiSendInterface,
} from "../../../../contracts/adapters/Types.sol/IMultiSend";

const _abi = [
  {
    inputs: [
      {
        internalType: "bytes",
        name: "transactions",
        type: "bytes",
      },
    ],
    name: "multiSend",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
] as const;

export class IMultiSend__factory {
  static readonly abi = _abi;
  static createInterface(): IMultiSendInterface {
    return new utils.Interface(_abi) as IMultiSendInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IMultiSend {
    return new Contract(address, _abi, signerOrProvider) as IMultiSend;
  }
}