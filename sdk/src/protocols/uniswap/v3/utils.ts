import { getMainnetSdk } from "@gnosis-guild/eth-sdk-client"
import { NotFoundError } from "../../../errors"
import { ethProvider } from "../../../provider"
import { getProvider } from "../../../../test/provider"
import { EthToken } from "./types"
import ethInfo from "./_ethInfo"

const sdk = getMainnetSdk(
  process.env.NODE_ENV === "test" ? getProvider() : ethProvider
)

export const findToken = (
  tokens: readonly EthToken[],
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

export const queryTokens = async (nftIds: bigint[]) => {
  const positions = await Promise.all(
    nftIds.map((nftId) => sdk.uniswap_v3.positions_nft.positions(nftId))
  )
  const result = new Set<`0x${string}`>()
  for (const position of positions) {
    result.add(findToken(ethInfo, position[2])) // token0
    result.add(findToken(ethInfo, position[3])) // token1
  }

  return [...result]
}
