import { providers } from "ethers"
import { Chain } from "./types"

console.log("node env", process.env.NODE_ENV)

export const ethProvider = new providers.JsonRpcProvider(
  "https://rpc.eth.gateway.fm",
  {
    chainId: 1,
    name: "Ethereum",
  }
)

export const gnoProvider = new providers.JsonRpcProvider(
  "https://rpc.gnosis.gateway.fm",
  {
    chainId: 100,
    name: "Gnosis",
  }
)

export const maticProvider = new providers.JsonRpcProvider(
  "https://rpc.gnosis.gateway.fm",
  {
    chainId: 137,
    name: "Polygon",
  }
)

export const arb1Provider = new providers.JsonRpcProvider(
  "https://rpc.gnosis.gateway.fm",
  {
    chainId: 42161,
    name: "ArbitrumOne",
  }
)

export function getProviderByChainId(chain: Chain) {
  switch (chain) {
    case Chain.eth:
      return ethProvider
    case Chain.gno:
      return gnoProvider
    case Chain.matic:
      return maticProvider
    case Chain.arb1:
      return arb1Provider
    default:
      throw new Error(`Unsupported chain ${chain}`)
  }
}
