import { z } from "zod"
import EthInfo from "./_info_ethereum"
import ArbInfo from "./_info_arbitrum"
import { FEES } from "./types"

const zFee = z.enum(FEES)

const ethTokens = [
  ...new Set(EthInfo.flatMap((token) => [token.token, token.symbol])),
]
const zEthToken = z.enum(ethTokens as [string, string, ...string[]])

export const eth = {
  deposit: z.object({
    targets: z.string().array().optional(),
    tokens: zEthToken.array().optional(),
    fees: zFee.array().optional(),
  }),
}

const arb1Tokens = [
  ...new Set(ArbInfo.flatMap((token) => [token.token, token.symbol])),
]
const zArb1Token = z.enum(arb1Tokens as [string, string, ...string[]])

const arb1TokensOptions = [
  ...new Set(ArbInfo.flatMap((token) => [token.symbol])),
].join(", ")

export const arb1 = {
  deposit: z.object({
    targets: z.string().array().optional().describe("0x..."),
    tokens: zArb1Token.array().optional().describe(`(${arb1TokensOptions}`),
    fees: zFee.array().optional(),
  }),
  swap: z.object({
    targets: zArb1Token.array().describe(arb1TokensOptions),
  }),
}
