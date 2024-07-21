import { allowErc20Approve } from "../../conditions"
import { allow } from "zodiac-roles-sdk/kit"
import { Token } from "./types"

export const depositToken = (token: Token) => {
  return [
    ...allowErc20Approve([token.asset], [token.token]),
    {
      ...allow.mainnet.hopper.vault.unwind(),
      targetAddress: token.token,
    },
    {
      ...allow.mainnet.hopper.vault.updateTotalAssets(),
      targetAddress: token.token,
    },
    {
      ...allow.mainnet.hopper.vault.settle(),
      targetAddress: token.token,
    },
  ]
}
