import { NotFoundError } from "../../../errors"
import tokensEthereum from "./_info_ethereum"
import tokensArbitrum from "./_info_arbitrum"
import { TokenEthereum, TokensArbitrum } from "./types"
import { DelegateToken, StakeToken } from "../v2/types"
import { findDelegateToken, findStakeToken } from "../v2/index"
import { depositEther, depositToken, borrowEther, borrowToken } from "./actions"
import { stake, delegate } from "../v2/actions"
import { Chain } from "../../../types"

const findTokenArbitrum = (symbolOrAddress: string): TokensArbitrum => {
  const symbolOrAddressLower = symbolOrAddress.toLowerCase()
  const token = tokensArbitrum.find(
    (token) =>
      token.symbol.toLowerCase() === symbolOrAddressLower ||
      token.token.toLowerCase() === symbolOrAddressLower,
  )

  if (!token) {
    throw new NotFoundError(`Token not found: ${symbolOrAddress}`)
  }

  return token
}

const findTokenEthereum = (symbolOrAddress: string): TokenEthereum => {
  const symbolOrAddressLower = symbolOrAddress.toLowerCase()
  const token = tokensEthereum.find(
    (token) =>
      token.symbol.toLowerCase() === symbolOrAddressLower ||
      token.token.toLowerCase() === symbolOrAddressLower,
  )
  if (!token) {
    throw new NotFoundError(`Token not found: ${symbolOrAddress}`)
  }
  return token
}

export const eth = {
  deposit: async ({
    targets,
  }: {
    targets: ("ETH" | TokenEthereum["symbol"] | TokenEthereum["token"])[]
  }) => {
    return targets.flatMap((target) =>
      target === "ETH"
        ? depositEther(Chain.eth)
        : depositToken(findTokenEthereum(target), Chain.eth),
    )
  },

  borrow: async ({
    targets,
  }: {
    targets: ("ETH" | TokenEthereum["symbol"] | TokenEthereum["token"])[]
  }) => {
    return targets.flatMap((target) =>
      target === "ETH"
        ? borrowEther(Chain.eth)
        : borrowToken(findTokenEthereum(target), Chain.eth),
    )
  },

  stake: async ({
    targets,
  }: {
    targets: (StakeToken["address"] | StakeToken["symbol"])[]
  }) => {
    return targets.flatMap((token) => stake(findStakeToken(token)))
  },

  delegate: async ({
    targets,
    delegatee,
  }: {
    targets: (DelegateToken["address"] | DelegateToken["symbol"])[]
    delegatee: string
  }) => {
    return targets.flatMap((target) =>
      delegate(findDelegateToken(target), delegatee),
    )
  },
}

export const arb1 = {
  deposit: async ({
    targets,
  }: {
    targets: ("ETH" | TokensArbitrum["symbol"] | TokensArbitrum["token"])[]
  }) => {
    return targets.flatMap((target) =>
      target === "ETH"
        ? depositEther(Chain.arb1)
        : depositToken(findTokenArbitrum(target), Chain.arb1),
    )
  },

  borrow: async ({
    targets,
  }: {
    targets: ("ETH" | TokensArbitrum["symbol"] | TokensArbitrum["token"])[]
  }) => {
    return targets.flatMap((target) =>
      target === "ETH"
        ? borrowEther(Chain.arb1)
        : borrowToken(findTokenArbitrum(target), Chain.arb1),
    )
  },
}
