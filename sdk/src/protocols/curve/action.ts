import { Permission } from "zodiac-roles-sdk/."
import { Pool, Token } from "./types"
import { allowErc20Approve } from "../../conditions"
import { allow } from "zodiac-roles-sdk/kit"

export const deposit = (pool: Pool, tokens: readonly Token[] = pool.tokens) => {
  const tokenAddresses = tokens.map((token) => token.address)

  const permissions: Permission[] = [
    {
      ...allow.mainnet.curve.stableNGPool["add_liquidity(uint256[],uint256)"](),
      targetAddress: pool.address,
    },
    {
      ...allow.mainnet.curve.stableNGPool[
        "remove_liquidity_one_coin(uint256,int128,uint256)"
      ](),
      targetAddress: pool.address,
    },
    {
      ...allow.mainnet.curve.stableNGPool[
        "remove_liquidity(uint256,uint256[])"
      ](),
      targetAddress: pool.address,
    },
    {
      ...allow.mainnet.curve.stableNGPool[
        "remove_liquidity_imbalance(uint256[],uint256)"
      ](),
      targetAddress: pool.address,
    },
  ]
  if (tokenAddresses.length > 0) {
    permissions.push(...allowErc20Approve(tokenAddresses, [pool.address]))
  }
  return permissions
}
