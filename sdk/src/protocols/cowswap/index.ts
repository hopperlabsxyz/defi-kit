import { allow } from "zodiac-roles-sdk/kit"
import { allowErc20Approve, oneOf } from "../../conditions"
import tokensArbitrum from "./_info_arbitrum"
import { c, Permission } from "zodiac-roles-sdk"
import { Token, TokensArbitrum } from "./types"
import { Chain } from "../../types"
import { NotFoundError } from "../../errors"

const GPv2VaultRelayer = "0xC92E8bdf79f0507f65a392b0ab4667716BFE0110"
const E_ADDRESS = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"

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

const swap = async ({
  sell,
  buy,
  chain,
}: {
  sell: ("ETH" | `0x${string}` | Token["symbol"])[]
  chain: Chain
  buy?: ("ETH" | `0x${string}` | Token["symbol"])[]
}) => {
  const permissions: Permission[] = []

  if (sell.length === 0) {
    throw new Error("`sell` must not be an empty array.")
  }
  if (buy && buy.length === 0) {
    throw new Error(
      "`buy` must not be an empty array. Pass `undefined` if you want to allow buying any token."
    )
  }

  if ("ETH" in sell) {
    permissions.push(allow.mainnet.weth.deposit({ send: true }))
  }

  const updatedSell = sell.map((item) => {
    if (item === "ETH") {
      return E_ADDRESS
    }
    if (item.startsWith("0x")) {
      return item
    }
    return findTokenArbitrum(item).token
  }) as `0x${string}`[]

  const updatedBuy =
    buy &&
    (buy.map((item) => {
      if (item === "ETH") {
        return E_ADDRESS
      }
      if (item.startsWith("0x")) {
        return item
      }
      return findTokenArbitrum(item).token
    }) as `0x${string}`[])

  const orderStructScoping = {
    sellToken: oneOf(updatedSell),
    buyToken: updatedBuy && oneOf(updatedBuy),
    receiver: c.avatar,
  }

  permissions.push(
    ...allowErc20Approve(updatedSell as `0x${string}`[], [GPv2VaultRelayer]),

    allow.mainnet.cowswap.orderSigner.signOrder(
      orderStructScoping,
      undefined,
      undefined,
      { delegatecall: true }
    ),

    allow.mainnet.cowswap.orderSigner.unsignOrder(orderStructScoping, {
      delegatecall: true,
    })
  )

  return permissions
}

export const eth = {
  swap,
}

export const gno = {
  swap,
}

export const arb1 = {
  swap,
}
