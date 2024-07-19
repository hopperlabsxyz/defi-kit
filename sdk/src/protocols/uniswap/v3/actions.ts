import { queryTokens, findToken, FeeMapping, ZERO_ADDRESS } from "./utils"
import { EthToken, ArbToken, Fee } from "./types"
import { allowErc20Approve, oneOf } from "../../../conditions"
import { contracts as contractsConfig } from "../../../../eth-sdk/config"
import { allow as allowKit } from "zodiac-roles-sdk/kit"
import { c, Permission } from "zodiac-roles-sdk"
import ethInfo from "./_info_ethereum"
import arbInfo from "./_info_arbitrum"
import { BigNumber } from "ethers"
import { NotFoundError } from "../../../errors"
export interface DepositParams {
  /** Position NFT token IDs to allow depositing into. If unspecified, all positions owned by avatar can be managed that are in any pair of the specified `tokens`.
   *
   * **Attention:** If the avatar has approved the Uniswap NFT Position contract to spend tokens other than the ones specified in `tokens`, the role will be able to increase and decrease any existing positions' liquidity in these tokens as well.
   */
  targets?: string[]
  /** Positions can be minted for any pair of the specified `tokens`. If unspecified, minting of new positions won't be allowed. */
  tokens?: (EthToken["address"] | EthToken["symbol"])[]
  fees?: Fee[]
  chainId: number
}
// export const eth = {
export const deposit = async ({
  targets,
  tokens,
  fees,
  chainId,
}: DepositParams) => {
  if (!targets && !tokens) {
    throw new Error("Either `targets` or `tokens` must be specified.")
  }
  const chainInfo = chainId === 1 ? ethInfo : arbInfo
  const contracts =
    chainId === 1 ? contractsConfig.mainnet : contractsConfig.arbitrumOne
  const allow = chainId === 1 ? allowKit.mainnet : allowKit.arbitrumOne
  if (targets && targets.length === 0)
    throw new Error("`targets` must not be empty")

  const mintFees = fees?.map((fee) => FeeMapping[fee]) || undefined
  const nftIds =
    targets &&
    targets.map((target) => {
      try {
        return BigNumber.from(target)
      } catch (e) {
        // could not be parsed as BigNumber
        throw new NotFoundError(`Invalid NFT ID: ${target}`)
      }
    })

  const tokensForTargets = (nftIds && (await queryTokens(nftIds))) || []

  const mintTokenAddresses =
    tokens?.map((addressOrSymbol) => findToken(chainInfo, addressOrSymbol)) ||
    []

  const permissions: Permission[] = [
    ...allowErc20Approve(tokensForTargets || [], [
      contracts.uniswap_v3.positions_nft,
    ]),
    ...allowErc20Approve(mintTokenAddresses, [
      contracts.uniswap_v3.positions_nft,
    ]),
    allow.uniswap_v3.positions_nft.increaseLiquidity(
      {
        tokenId: nftIds ? oneOf(nftIds) : c.avatarIsOwnerOfErc721,
      },
      {
        send: true,
      }
    ),
    allow.uniswap_v3.positions_nft.decreaseLiquidity(
      nftIds
        ? {
            tokenId: oneOf(nftIds),
          }
        : undefined
    ),
    allow.uniswap_v3.positions_nft.collect({
      tokenId: nftIds ? oneOf(nftIds) : undefined,
      recipient: c.avatar,
    }),
  ]

  if (mintTokenAddresses && mintTokenAddresses.length > 0) {
    permissions.push(
      allow.uniswap_v3.positions_nft.mint(
        {
          recipient: c.avatar,
          token0: oneOf(mintTokenAddresses),
          token1: oneOf(mintTokenAddresses),
          fee: mintFees && mintFees.length > 0 ? oneOf(mintFees) : undefined,
        },
        {
          send: true,
        }
      )
    )
  }

  if (
    mintTokenAddresses.includes(contracts.weth) ||
    tokensForTargets?.includes(contracts.weth)
  ) {
    permissions.push(
      allow.uniswap_v3.positions_nft.refundETH(),
      allow.uniswap_v3.positions_nft.unwrapWETH9(undefined, c.avatar),
      allow.uniswap_v3.positions_nft.collect({
        tokenId: nftIds ? oneOf(nftIds) : undefined,
        recipient: ZERO_ADDRESS,
      }),
      allow.uniswap_v3.positions_nft.sweepToken(undefined, undefined, c.avatar)
    )
  }

  return permissions
}
