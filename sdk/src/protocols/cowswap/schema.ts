import { z } from "zod"
import { zx } from "../../zx"
import arb1Tokens from "./_info_arbitrum"

const swap = z.object({
  sell: zx.address().or(z.literal("ETH")).array(),
  buy: zx.address().or(z.literal("ETH")).array(),
})

export const eth = {
  swap,
}

export const gno = {
  swap,
}

const zArb1Token = z.enum([
  "ETH",
  ...arb1Tokens.map((token) => token.symbol),
  ...arb1Tokens.map((token) => token.token),
] as [string, string, ...string[]])

const arb1Options = arb1Tokens.map((token) => token.symbol).join(", ")

export const arb1 = {
  swap: z.object({
    sell: zx.address().or(zArb1Token).array().describe(`0x..., ${arb1Options}`),
    buy: zx.address().or(zArb1Token).array().describe(`0x..., ${arb1Options}`),
  }),
}
