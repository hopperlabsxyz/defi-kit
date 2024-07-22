import {
  queryTokens,
  findToken,
  FeeMapping,
  ZERO_ADDRESS,
  getChainInfo,
  getAddressByChain,
  getSdk,
} from "./utils"
import { Fee, Token } from "./types"
import { allowErc20Approve, oneOf } from "../../../conditions"
import { allow } from "zodiac-roles-sdk/kit"
import { c, Permission } from "zodiac-roles-sdk"
import { BigNumber } from "ethers"
import { NotFoundError } from "../../../errors"
import { Chain } from "../../../types"
import { contracts } from "../../../../eth-sdk/config"
export interface DepositParams {
  /** Position NFT token IDs to allow depositing into. If unspecified, all positions owned by avatar can be managed that are in any pair of the specified `tokens`.
   *
   * **Attention:** If the avatar has approved the Uniswap NFT Position contract to spend tokens other than the ones specified in `tokens`, the role will be able to increase and decrease any existing positions' liquidity in these tokens as well.
   */
  targets?: string[]
  /** Positions can be minted for any pair of the specified `tokens`. If unspecified, minting of new positions won't be allowed. */
  tokens?: (Token["token"] | Token["symbol"])[]
  fees?: Fee[]
  chain: Chain
}

// export const eth = {
export const deposit = async ({
  targets,
  tokens,
  fees,
  chain,
}: DepositParams) => {
  if (!targets && !tokens) {
    throw new Error("Either `targets` or `tokens` must be specified.")
  }
  if (targets && targets.length === 0)
    throw new Error("`targets` must not be empty")

  const { targetAddress, weth } = getAddressByChain(chain)

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

  const chainInfo = getChainInfo(chain)
  const tokensForTargets =
    (nftIds && (await queryTokens(nftIds, chainInfo, getSdk(chain)))) || []
  const mintTokenAddresses =
    tokens?.map((addressOrSymbol) => findToken(chainInfo, addressOrSymbol)) ||
    []

  const permissions: Permission[] = [
    ...allowErc20Approve(tokensForTargets || [], [targetAddress]),
    ...allowErc20Approve(mintTokenAddresses, [targetAddress]),
    {
      ...allow.mainnet.uniswap_v3.positions_nft.increaseLiquidity(
        {
          tokenId: nftIds ? oneOf(nftIds) : c.avatarIsOwnerOfErc721,
        },
        {
          send: true,
        }
      ),
      targetAddress,
    },
    {
      ...allow.mainnet.uniswap_v3.positions_nft.decreaseLiquidity(
        nftIds
          ? {
            tokenId: oneOf(nftIds),
          }
          : undefined
      ),
      targetAddress,
    },
    {
      ...allow.mainnet.uniswap_v3.positions_nft.collect({
        tokenId: nftIds ? oneOf(nftIds) : undefined,
        recipient: c.avatar,
      }),
      targetAddress,
    },
  ]

  if (mintTokenAddresses && mintTokenAddresses.length > 0) {
    permissions.push({
      ...allow.mainnet.uniswap_v3.positions_nft.mint(
        {
          recipient: c.avatar,
          token0: oneOf(mintTokenAddresses),
          token1: oneOf(mintTokenAddresses),
          fee: mintFees && mintFees.length > 0 ? oneOf(mintFees) : undefined,
        },
        {
          send: true,
        }
      ),
      targetAddress,
    })
  }

  if (mintTokenAddresses.includes(weth) || tokensForTargets?.includes(weth)) {
    permissions.push(
      {
        ...allow.mainnet.uniswap_v3.positions_nft.refundETH(),
        targetAddress,
      },
      {
        ...allow.mainnet.uniswap_v3.positions_nft.unwrapWETH9(
          undefined,
          c.avatar
        ),
        targetAddress,
      },
      {
        ...allow.mainnet.uniswap_v3.positions_nft.collect({
          tokenId: nftIds ? oneOf(nftIds) : undefined,
          recipient: ZERO_ADDRESS,
        }),
        targetAddress,
      },
      {
        ...allow.mainnet.uniswap_v3.positions_nft.sweepToken(
          undefined,
          undefined,
          c.avatar
        ),
        targetAddress,
      }
    )
  }

  return permissions
}

export const swapToken = (tokens: Token[]) => {
  const router = contracts.arbitrumOne.uniswap_v3.swap_router
  return [
    ...allowErc20Approve(
      tokens.map((token) => token.token),
      ["0x000000000022d473030f116ddee9f6b43ac78ba3"]
    ),
    {
      ...allow.arbitrumOne.uniswap_v3.swap_router["execute(bytes,bytes[])"](),
      targetAddress: router,
    },
    {
      ...allow.arbitrumOne.uniswap_v3.swap_router[
        "execute(bytes,bytes[],uint256)"
      ](),
      targetAddress: router,
    },
  ]
}
