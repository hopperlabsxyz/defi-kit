import { providers } from "ethers"

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

export function getProviderByChainId(chainId: number) {
  if (chainId === 1) {
    return ethProvider
  }
  if (chainId === 100) {
    return gnoProvider
  }
  if (chainId === 137) {
    return maticProvider
  }
  if (chainId === 42161) {
    return arb1Provider
  }
  throw new Error(`Unsupported chainId ${chainId}`)
}
