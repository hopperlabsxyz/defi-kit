import { TokensArbitrum } from "./types"
import tokensArbitrum from "./_info_arbitrum"
import { NotFoundError } from "../../errors"
import { depositToken } from "./actions"

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

export const arb1 = {
  deposit: async ({
    targets,
  }: {
    targets: (TokensArbitrum["symbol"] | TokensArbitrum["token"])[]
  }) => {
    return targets.flatMap((target) => depositToken(findTokenArbitrum(target)))
  },
}
