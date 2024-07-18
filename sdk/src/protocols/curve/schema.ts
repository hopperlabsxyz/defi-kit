import maticPools from "./_maticPools"
import arb1Pools from "./_arb1Pools"
import { z } from "zod"
import { maticToken } from "./types"
import { arb1Token } from "./types"

const arb1Tokens = [
  ...new Set(
    arb1Pools
      .flatMap((pool) => pool.tokens as readonly arb1Token[])
      .flatMap((token) => [token.address, token.name])
  ),
]

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

const zarb1Pools = z.enum([
  ...arb1Pools.map((pool) => pool.symbol),
  ...arb1Pools.map((pool) => pool.address),
] as [string, string, ...string[]])

const zmaticToken = z.enum(maticTokens as [string, string, ...string[]])

const zarb1Token = z.enum(arb1Tokens as [string, string, ...string[]])

export const matic = {
  deposit: z.object({
    targets: zmaticPools.array(),
    tokens: zmaticToken.array().optional(),
  }),
}

export const arb1 = {
  deposit: z.object({
    targets: zarb1Pools.array(),
    tokens: zarb1Token.array().optional(),
  }),
}
