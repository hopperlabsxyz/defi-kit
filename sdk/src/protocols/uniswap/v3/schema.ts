import { z } from "zod"
import EthInfo from "./_info_ethereum"
import ArbInfo from "./_info_arbitrum"
import { FEES } from "./types"

const zFee = z.enum(FEES)

const ethTokens = [
  ...new Set(EthInfo.flatMap((token) => [token.address, token.symbol])),
]
const zEthToken = z.enum(ethTokens as [string, string, ...string[]])

export const eth = {
  deposit: z.object({
    targets: z.string().array().optional(),
    tokens: zEthToken.array().optional(),
    fees: zFee.array().optional(),
  }),
}

const arbTokens = [
  ...new Set(ArbInfo.flatMap((token) => [token.address, token.symbol])),
]
const zArbToken = z.enum(arbTokens as [string, string, ...string[]])

export const arb1 = {
  deposit: z.object({
    targets: z.string().array().optional(),
    tokens: zArbToken.array().optional(),
    fees: zFee.array().optional(),
  }),
}
