import { z } from "zod"
import ethTokens from "./_info_ethereum"
import arb1Tokens from "./_info_arbitrum"
import ethStakeTokens from "../v2/stakeTokens"
import ethDelegateTokens from "../v2/delegateTokens"
import { zx } from "../../../zx"

const zEthToken = z.enum([
  "ETH",
  ...ethTokens.map((token) => token.symbol),
  ...ethTokens.map((token) => token.token),
] as [string, string, ...string[]])

const zEthStakeToken = z.enum([
  ...ethStakeTokens.map((token) => token.symbol),
  ...ethStakeTokens.map((token) => token.address),
] as [string, string, ...string[]])

const zEthDelegateToken = z.enum([
  ...ethDelegateTokens.map((token) => token.symbol),
  ...ethDelegateTokens.map((token) => token.address),
] as [string, string, ...string[]])

const zDelegatee = zx.address()

const ethOptions = ethTokens.map((token) => token.symbol).join(", ")
const ethStakeOptions = ethStakeTokens.map((token) => token.symbol).join(", ")
const ethDelegateOptions = ethDelegateTokens
  .map((token) => token.symbol)
  .join(", ")

export const eth = {
  deposit: z.object({
    targets: zEthToken.array().describe(ethOptions),
  }),

  borrow: z.object({
    targets: zEthToken.array().describe(ethOptions),
  }),

  stake: z.object({
    targets: zEthStakeToken.array().describe(ethStakeOptions),
  }),

  delegate: z.object({
    targets: zEthDelegateToken.array().describe(ethDelegateOptions),
    delegatee: zDelegatee.describe("0x..."),
  }),
}

const arb1Options = arb1Tokens.map((token) => token.symbol).join(", ")

const zArb1Token = z.enum([
  "ETH",
  ...arb1Tokens.map((token) => token.symbol),
  ...arb1Tokens.map((token) => token.token),
] as [string, string, ...string[]])

export const arb1 = {
  deposit: z.object({
    targets: zArb1Token.array().describe(arb1Options),
  }),

  borrow: z.object({
    targets: zArb1Token.array().describe(arb1Options),
  }),
}
