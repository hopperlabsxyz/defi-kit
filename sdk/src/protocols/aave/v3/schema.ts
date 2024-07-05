import { z } from "zod"
import ethTokens from "./_info"
import ethStakeTokens from "../v2/stakeTokens"
import ethDelegateTokens from "../v2/delegateTokens"
import {
  arb1Tokens,
  arb1StakeTokens,
  arb1DelegateTokens,
} from "./arb1Tokens_tempfile"
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

export const eth = {
  deposit: z.object({
    targets: zEthToken.array(),
  }),

  borrow: z.object({
    targets: zEthToken.array(),
  }),

  stake: z.object({
    targets: zEthStakeToken.array(),
  }),

  delegate: z.object({
    targets: zEthDelegateToken.array(),
    delegatee: zDelegatee,
  }),
}

const zArb1Token = z.enum([
  "ETH",
  ...arb1Tokens.map((token) => token.symbol),
  ...arb1Tokens.map((token) => token.token),
] as [string, string, ...string[]])

const zArb1StakeToken = z.enum([
  ...arb1StakeTokens.map((token) => token.symbol),
  ...arb1StakeTokens.map((token) => token.address),
] as [string, string, ...string[]])

const zArb1DelegateToken = z.enum([
  ...arb1DelegateTokens.map((token) => token.symbol),
  ...arb1DelegateTokens.map((token) => token.address),
] as [string, string, ...string[]])

export const arb1 = {
  deposit: z.object({
    targets: zArb1Token.array(),
  }),

  borrow: z.object({
    targets: zArb1Token.array(),
  }),

  stake: z.object({
    targets: zArb1StakeToken.array(),
  }),

  delegate: z.object({
    targets: zArb1DelegateToken.array(),
    delegatee: zDelegatee,
  }),
}
