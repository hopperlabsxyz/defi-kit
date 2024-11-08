import { Permission, c } from "zodiac-roles-sdk"
import { allow } from "zodiac-roles-sdk/kit"
import { allowErc20Approve } from "../../conditions"
import { Pool, Token } from "./types"
import { contracts } from "../../../eth-sdk/config"
import { Chain } from "../../types"

export const BAL = "0xba100000625a3754423978a60c9317c58a424e3D"
const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
export const B_80BAL_20WETH = "0x5c6Ee304399DBdB9C8Ef030aB642B10820DB8F56"
export const B_80BAL_20WETH_PID =
  "0x5c6ee304399dbdb9c8ef030ab642b10820db8f56000200000000000000000014"
export const bb_a_USD_v1 = "0x7B50775383d3D6f0215A8F290f2C9e2eEBBEceb2"
export const bb_a_USD_v2 = "0xA13a9247ea42D743238089903570127DdA72fE44"
export const bb_a_USD_v3 = "0xfeBb0bbf162E64fb9D0dfe186E517d84C395f016"

export const deposit = (pool: Pool, tokens: readonly Token[] = pool.tokens) => {
  const tokenAddresses = pool.tokens
    .map((token) => token.address)
    .filter((address) => tokens.some((token) => token.address === address))

  const permissions: Permission[] = [
    ...allowErc20Approve(tokenAddresses, [contracts.mainnet.balancer.vault]),

    allow.mainnet.balancer.vault.joinPool(
      pool.id,
      c.avatar,
      c.avatar,
      undefined,
      // Independently if one of the tokens added is ETH or not we must
      // add the send: true because Roles mod does not support scoping
      // the same function with different option values.
      {
        send: true,
      }
    ),

    allow.mainnet.balancer.vault.exitPool(pool.id, c.avatar, c.avatar),
  ]

  // WARNING: The Relayer permissions have been removed as there is
  // no evidence that they are being used for joins or exits.
  // const tokenPoolIds = pool.tokens
  //   .filter(
  //     (token) =>
  //       tokens.some((t) => token.address === t.address) &&
  //       token.id !== null &&
  //       token.id !== "0x"
  //   )
  //   .map((token) => token.id)
  // if (tokenPoolIds.length > 0) {
  //   permissions.push(
  //     // With the latest changes that Balancer made, there's no need to swap
  //     // tokens in order to join or exit pools
  //     // allow.mainnet.balancer.vault.swap(
  //     //   { poolId: c.or(...(tokenPoolIds as [string, string, ...string[]])) },
  //     //   { recipient: c.avatar, sender: c.avatar }
  //     // ),

  //     allow.mainnet.balancer.vault.setRelayerApproval(
  //       c.avatar,
  //       contracts.mainnet.balancer.relayer
  //     ),

  //     allow.mainnet.balancer.relayer.multicall(
  //       c.every(
  //         c.or(
  //           c.calldataMatches(
  //             allow.mainnet.balancer.relayerLibrary.joinPool(
  //               c.or(
  //                 pool.id,
  //                 ...(tokenPoolIds as [string, string, ...string[]])
  //               ),
  //               undefined,
  //               c.or(c.avatar, contracts.mainnet.balancer.relayer),
  //               c.or(c.avatar, contracts.mainnet.balancer.relayer)
  //             )
  //           ),
  //           c.calldataMatches(
  //             allow.mainnet.balancer.relayerLibrary.exitPool(
  //               c.or(
  //                 pool.id,
  //                 ...(tokenPoolIds as [string, string, ...string[]])
  //               ),
  //               undefined,
  //               c.avatar,
  //               c.avatar
  //             )
  //           )
  //           // With the latest changes that Balancer made, there's no need to swap
  //           // tokens in order to join or exit pools
  //           // c.calldataMatches(
  //           //   allow.mainnet.balancer.relayerLibrary.swap(
  //           //     {
  //           //       poolId: c.or(
  //           //         ...(tokenPoolIds as [string, string, ...string[]])
  //           //       ),
  //           //     },
  //           //     { recipient: c.avatar, sender: c.avatar }
  //           //   )
  //           // )
  //         )
  //       ),
  //       { send: true }
  //     )
  //   )
  // }

  return permissions
}

export const stake = (chain: Chain, pool: Pool) => {
  const permissions: Permission[] = []

  let minter: `0x${string}`
  let relayer: `0x${string}`

  switch (chain) {
    case Chain.eth:
      minter = contracts.mainnet.balancer.minter as `0x${string}`
      relayer = contracts.mainnet.balancer.relayer as `0x${string}`
      break

    case Chain.gno:
      minter = contracts.gnosis.balancer.minter as `0x${string}`
      relayer = contracts.gnosis.balancer.relayer as `0x${string}`
      break

    case Chain.arb1:
      minter = contracts.arbitrumOne.balancer.minter as `0x${string}`
      relayer = contracts.arbitrumOne.balancer.relayer as `0x${string}`
      break
  }

  if (pool.gauge) {
    permissions.push(
      ...allowErc20Approve([pool.bpt], [pool.gauge]),
      {
        ...allow.mainnet.balancer.gauge["deposit(uint256)"](),
        targetAddress: pool.gauge,
      },
      {
        ...allow.mainnet.balancer.gauge["withdraw(uint256)"](),
        targetAddress: pool.gauge,
      },
      {
        ...allow.mainnet.balancer.gauge["claim_rewards()"](),
        targetAddress: pool.gauge,
      },
      {
        ...allow.mainnet.balancer.minter.mint(pool.gauge),
        targetAddress: minter,
      },

      // New permissions for Unstaking and Claiming
      allow.mainnet.balancer.vault.setRelayerApproval(c.avatar, relayer),
      {
        ...allow.mainnet.balancer.relayer.gaugeWithdraw(
          pool.gauge,
          c.avatar,
          c.avatar
        ),
        targetAddress: relayer,
      },
      // New permissions for Claiming and Claiming All
      {
        ...allow.mainnet.balancer.minter.setMinterApproval(relayer),
        targetAddress: minter,
      },
      // vault.setRelayerApproval() already added
      {
        ...allow.mainnet.balancer.relayer.gaugeClaimRewards([pool.gauge]), // WARNING!!: Specify gauge?
        targetAddress: relayer,
      },
      {
        ...allow.mainnet.balancer.relayer.gaugeMint([pool.gauge]), // WARNING!!: Specify gauge?
        targetAddress: relayer,
      }
    )
  }

  return permissions
}

export const lock = (): Permission[] => {
  return [
    ...allowErc20Approve([BAL, WETH], [contracts.mainnet.balancer.vault]),
    ...allowErc20Approve([B_80BAL_20WETH], [contracts.mainnet.balancer.veBal]),
    allow.mainnet.balancer.vault.joinPool(
      B_80BAL_20WETH_PID,
      c.avatar,
      c.avatar,
      undefined,
      { send: true }
    ),
    allow.mainnet.balancer.vault.exitPool(
      B_80BAL_20WETH_PID,
      c.avatar,
      c.avatar
    ),
    // As Safes are smart contracts they are not allowed to lock veBAL
    // if the they are not whitelisted previously by Balancer:
    // https://forum.balancer.fi/t/allow-for-gnosis-safe-to-be-used-for-vebal-locking/2698
    allow.mainnet.balancer.veBal.create_lock(),
    allow.mainnet.balancer.veBal.increase_amount(),
    allow.mainnet.balancer.veBal.increase_unlock_time(),
    allow.mainnet.balancer.veBal.withdraw(),
    allow.mainnet.balancer.feeDistributor.claimToken(c.avatar),
    allow.mainnet.balancer.feeDistributor.claimTokens(c.avatar),
  ]
}

// export const swap = (
//   pool: Pool,
//   sell: Token[] | undefined,
//   buy: Token[] | undefined
// ) => {
//   const result: Permission[] = []

//   return result
// }
