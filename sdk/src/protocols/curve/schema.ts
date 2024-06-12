import maticPools from "./_maticPools"
import { z } from "zod"
import { maticToken } from "./types"

const maticTokens = [
  ...new Set(
    maticPools
      .flatMap((pool) => pool.tokens as readonly maticToken[])
      .flatMap((token) => [token.address, token.name])
  ),
]

const zmaticPools = z.enum([
  ...maticPools.map((pool) => pool.symbol),
  ...maticPools.map((pool) => pool.address),
] as [string, string, ...string[]])

const zmaticToken = z.enum(maticTokens as [string, string, ...string[]])

export const matic = {
  addLiquidity: z.object({
    targets: zmaticPools.array(),
    tokens: zmaticToken.array().optional(),
  }),
}
