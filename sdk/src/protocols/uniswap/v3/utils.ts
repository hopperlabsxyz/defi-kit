import { getMainnetSdk } from "@dethcrypto/eth-sdk-client"
import { NotFoundError } from "../../../errors"
import { BigNumber } from "ethers"
import { getProviderByChainId } from "../../../provider"
import { getProvider } from "../../../../test/provider"
import { Token } from "./types"
import ethInfo from "./_info_ethereum"
import arb1Info from "./_info_arbitrum"
import { Chain } from "../../../types"
import { contractAddressOverrides, contracts } from "../../../../eth-sdk/config"

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"

export const getSdk = (chain: Chain) =>
  getMainnetSdk(
    process.env.NODE_ENV === "test"
      ? getProvider()
      : getProviderByChainId(chain)
  )

export const getChainInfo = (chain: Chain): readonly Token[] => {
  switch (chain) {
    case Chain.eth:
      return ethInfo
    case Chain.arb1:
      return arb1Info
    default:
      throw new Error(`Unsupported chain ${chain}`)
  }
}

export const getAddressByChain = (chain: Chain) => {
  switch (chain) {
    case Chain.eth:
      return {
        targetAddress: contracts.mainnet.uniswap_v3.positions_nft,
        weth: contracts.mainnet.weth,
      }
    case Chain.arb1:
      return {
        targetAddress:
          contractAddressOverrides.arbitrumOne.uniswap_v3.positions_nft,
        weth: contractAddressOverrides.arbitrumOne.weth,
      }
    default:
      throw new Error(`Unsupported chain ${chain}`)
  }
}

export const FeeMapping: { [key: string]: number } = {
  "0.01%": 100,
  "0.05%": 500,
  "0.3%": 3000,
  "1%": 10000,
}

export const findToken = (
  tokens: readonly Token[],
  symbolOrAddress: string
) => {
  const symbolOrAddressLower = symbolOrAddress.toLowerCase()
  const token = tokens.find(
    (token) =>
      token.address.toLowerCase() === symbolOrAddressLower ||
      token.symbol.toLowerCase() === symbolOrAddressLower
  )
  if (!token) {
    throw new NotFoundError(`Token not found: ${symbolOrAddress}`)
  }
  return token.address
}

export const queryTokens = async (
  nftIds: BigNumber[],
  chainInfo: readonly Token[],
  sdk: ReturnType<typeof getSdk>
) => {
  const positions = await Promise.all(
    nftIds.map((nftId) => sdk.uniswap_v3.positions_nft.positions(nftId))
  )

  const result = new Set<`0x${string}`>()
  for (const position of positions) {
    result.add(findToken(chainInfo, position[2])) // token0
    result.add(findToken(chainInfo, position[3])) // token1
  }

  return [...result]
}
