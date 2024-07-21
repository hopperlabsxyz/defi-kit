import { z } from "zod"
import arb1Tokens from "./_info_arbitrum"

const zArb1Token = z.enum([
  ...arb1Tokens.map((token) => token.symbol),
  ...arb1Tokens.map((token) => token.token),
] as [string, string, ...string[]])

const depositOptions = arb1Tokens.map((token) => token.symbol).join(", ")

export const arb1 = {
  deposit: z
    .object({
      targets: zArb1Token.array(),
    })
    .describe(
      `List of vault addresses that your avatar is owner of.\nAvailable options: ${depositOptions}`
    ),
}
