import { NotFoundError } from "../../errors"
import { addLiquidity } from "./action"
import maticPools from "./_maticPools"
import { Pool, Token } from "./types"

const findPool = (pools: readonly Pool[], symbolOrAddress: string): Pool => {
  const symbolOrAddressLower = symbolOrAddress.toLowerCase()
  const pool = pools.find(
    (pool) =>
      pool.symbol.toLowerCase() === symbolOrAddressLower ||
      pool.address.toLowerCase() === symbolOrAddressLower
  )
  if (!pool) {
    throw new NotFoundError(`Pool not found: ${symbolOrAddress}`)
  }
  return pool
}

const findToken = (pools: readonly Pool[], symbolOrAddress: string): Token => {
  const symbolOrAddressLower = symbolOrAddress.toLowerCase()
  const tokens = pools.flatMap((pool) => [...pool.tokens])
  const token = tokens.find(
    (token) =>
      token.name.toLowerCase() === symbolOrAddressLower ||
      token.address.toLowerCase() === symbolOrAddressLower
  )
  if (!token) {
    throw new NotFoundError(`Pool not found: ${symbolOrAddress}`)
  }
  return token
}

export const matic = {
  addLiquidity: async ({
    targets,
    tokens,
  }: {
    targets: (Pool["address"] | Pool["symbol"])[]
    tokens?: (Token["address"] | Token["name"])[]
  }) => {
    return targets.flatMap((target) => {
      return addLiquidity(
        findPool(maticPools, target),
        tokens?.map((addressOrName) => findToken(maticPools, addressOrName))
      )
    })
  },
}