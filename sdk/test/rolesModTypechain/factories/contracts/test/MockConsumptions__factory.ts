/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../common";
import type {
  MockConsumptions,
  MockConsumptionsInterface,
} from "../../../contracts/test/MockConsumptions";

const _abi = [
  {
    inputs: [
      {
        components: [
          {
            internalType: "bytes32",
            name: "allowanceKey",
            type: "bytes32",
          },
          {
            internalType: "uint128",
            name: "balance",
            type: "uint128",
          },
          {
            internalType: "uint128",
            name: "consumed",
            type: "uint128",
          },
        ],
        internalType: "struct Consumption[]",
        name: "c1",
        type: "tuple[]",
      },
      {
        components: [
          {
            internalType: "bytes32",
            name: "allowanceKey",
            type: "bytes32",
          },
          {
            internalType: "uint128",
            name: "balance",
            type: "uint128",
          },
          {
            internalType: "uint128",
            name: "consumed",
            type: "uint128",
          },
        ],
        internalType: "struct Consumption[]",
        name: "c2",
        type: "tuple[]",
      },
    ],
    name: "merge",
    outputs: [
      {
        components: [
          {
            internalType: "bytes32",
            name: "allowanceKey",
            type: "bytes32",
          },
          {
            internalType: "uint128",
            name: "balance",
            type: "uint128",
          },
          {
            internalType: "uint128",
            name: "consumed",
            type: "uint128",
          },
        ],
        internalType: "struct Consumption[]",
        name: "result",
        type: "tuple[]",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b506106bc806100206000396000f3fe608060405234801561001057600080fd5b506004361061002b5760003560e01c8063d8d025c214610030575b600080fd5b61004361003e366004610544565b610059565b60405161005091906105a8565b60405180910390f35b6060610065838361006e565b90505b92915050565b60608251600003610080575080610068565b8151600003610090575081610068565b8151835161009e9190610624565b67ffffffffffffffff8111156100b6576100b66103fc565b60405190808252806020026020018201604052801561010157816020015b60408051606081018252600080825260208083018290529282015282526000199092019101816100d45790505b50835190915060005b818110156101fa5784818151811061012457610124610637565b60200260200101516000015183828151811061014257610142610637565b6020026020010151600001818152505084818151811061016457610164610637565b60200260200101516020015183828151811061018257610182610637565b6020026020010151602001906001600160801b031690816001600160801b0316815250508481815181106101b8576101b8610637565b6020026020010151604001518382815181106101d6576101d6610637565b60209081029190910101516001600160801b0390911660409091015260010161010a565b5060005b835181101561038c576000806102318787858151811061022057610220610637565b6020026020010151600001516103a1565b9150915080156102945785838151811061024d5761024d610637565b60200260200101516040015185838151811061026b5761026b610637565b6020026020010151604001818151610283919061064d565b6001600160801b0316905250610382565b8583815181106102a6576102a6610637565b6020026020010151600001518585815181106102c4576102c4610637565b602002602001015160000181815250508583815181106102e6576102e6610637565b60200260200101516020015185858151811061030457610304610637565b6020026020010151602001906001600160801b031690816001600160801b03168152505085838151811061033a5761033a610637565b60200260200101516040015185858151811061035857610358610637565b60209081029190910101516001600160801b039091166040909101528361037e8161066d565b9450505b50506001016101fe565b50815181101561039a578082525b5092915050565b81516000908190815b818110156103eb57848682815181106103c5576103c5610637565b602002602001015160000151036103e3579250600191506103f59050565b6001016103aa565b5060008092509250505b9250929050565b634e487b7160e01b600052604160045260246000fd5b6040516060810167ffffffffffffffff81118282101715610435576104356103fc565b60405290565b604051601f8201601f1916810167ffffffffffffffff81118282101715610464576104646103fc565b604052919050565b80356001600160801b038116811461048357600080fd5b919050565b600082601f83011261049957600080fd5b8135602067ffffffffffffffff8211156104b5576104b56103fc565b6104c3818360051b0161043b565b828152606092830285018201928282019190878511156104e257600080fd5b8387015b858110156105375781818a0312156104fe5760008081fd5b610506610412565b8135815261051586830161046c565b86820152604061052681840161046c565b9082015284529284019281016104e6565b5090979650505050505050565b6000806040838503121561055757600080fd5b823567ffffffffffffffff8082111561056f57600080fd5b61057b86838701610488565b9350602085013591508082111561059157600080fd5b5061059e85828601610488565b9150509250929050565b602080825282518282018190526000919060409081850190868401855b8281101561060157815180518552868101516001600160801b0390811688870152908601511685850152606090930192908501906001016105c5565b5091979650505050505050565b634e487b7160e01b600052601160045260246000fd5b808201808211156100685761006861060e565b634e487b7160e01b600052603260045260246000fd5b6001600160801b0381811683821601908082111561039a5761039a61060e565b60006001820161067f5761067f61060e565b506001019056fea264697066735822122051f7006c77b56c09052dcfb9d9524cec2b25506540ac1390a9a4837ed5a2cc4764736f6c63430008110033";

type MockConsumptionsConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: MockConsumptionsConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class MockConsumptions__factory extends ContractFactory {
  constructor(...args: MockConsumptionsConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<MockConsumptions> {
    return super.deploy(overrides || {}) as Promise<MockConsumptions>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): MockConsumptions {
    return super.attach(address) as MockConsumptions;
  }
  override connect(signer: Signer): MockConsumptions__factory {
    return super.connect(signer) as MockConsumptions__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): MockConsumptionsInterface {
    return new utils.Interface(_abi) as MockConsumptionsInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): MockConsumptions {
    return new Contract(address, _abi, signerOrProvider) as MockConsumptions;
  }
}