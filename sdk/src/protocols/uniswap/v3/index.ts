import { TokensArbitrum } from "./types"
import { deposit, swapToken } from "./actions"
import tokensArbitrum from "./_info_arbitrum"
import { NotFoundError } from "../../../errors"

const findTokenArbitrum = (symbolOrAddress: string): TokensArbitrum => {
  const symbolOrAddressLower = symbolOrAddress.toLowerCase()
  const token = tokensArbitrum.find(
    (token) =>
      token.symbol.toLowerCase() === symbolOrAddressLower ||
      token.token.toLowerCase() === symbolOrAddressLower
  )

  if (!token) {
    throw new NotFoundError(`Token not found: ${symbolOrAddress}`)
  }

  return token
}

export const eth = {
  deposit: deposit,
}

export const arb1 = {
  deposit: deposit,
  swap: async ({
    targets,
  }: {
    targets: (TokensArbitrum["symbol"] | TokensArbitrum["token"])[]
  }) => {
    const tokens = targets.map((target) => findTokenArbitrum(target))
    return swapToken(tokens)
  },
}
