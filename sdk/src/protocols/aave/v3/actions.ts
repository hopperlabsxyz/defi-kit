import { allow } from "zodiac-roles-sdk/kit"
import { Permission, c } from "zodiac-roles-sdk"
import { Token } from "./types"
import { allowErc20Approve } from "../../../conditions"
import { contractAddressOverrides, contracts } from "../../../../eth-sdk/config"
import { Chain } from "../../../types"

export const depositToken = (token: Token, chain: Chain) => {
  let aaveLendingPoolV3: `0x${string}`

  switch (chain) {
    case Chain.eth:
      aaveLendingPoolV3 = contracts.mainnet.aaveV3.aaveLendingPoolV3
      break
    case Chain.arb1:
      aaveLendingPoolV3 =
        contractAddressOverrides.arbitrumOne.aaveV3.aaveLendingPoolV3
      break
  }

  return [
    ...allowErc20Approve([token.token], [aaveLendingPoolV3]),
    {
      ...allow.mainnet.aaveV3.aaveLendingPoolV3.supply(
        token.token,
        undefined,
        c.avatar
      ),
      targetAddress: aaveLendingPoolV3,
    },
    {
      ...allow.mainnet.aaveV3.aaveLendingPoolV3.withdraw(
        token.token,
        undefined,
        c.avatar
      ),
      targetAddress: aaveLendingPoolV3,
    },
    {
      ...allow.mainnet.aaveV3.aaveLendingPoolV3.setUserUseReserveAsCollateral(
        token.token
      ),
      targetAddress: aaveLendingPoolV3,
    },
  ]
}

export const depositEther = (chain: Chain) => {
  let aaveLendingPoolV3: `0x${string}`
  let weth: `0x${string}`
  let wrappedTokenGatewayV3: `0x${string}`

  const permissions: Permission[] = []
  switch (chain) {
    case Chain.eth:
      aaveLendingPoolV3 = contracts.mainnet.aaveV3.aaveLendingPoolV3
      weth = contracts.mainnet.weth
      wrappedTokenGatewayV3 = contracts.mainnet.aaveV3.wrappedTokenGatewayV3
      permissions.push(
        ...allowErc20Approve(
          [contracts.mainnet.aaveV3.aEthWETH],
          [wrappedTokenGatewayV3]
        )
      )
      break
    case Chain.arb1:
      aaveLendingPoolV3 =
        contractAddressOverrides.arbitrumOne.aaveV3.aaveLendingPoolV3
      weth = contractAddressOverrides.arbitrumOne.weth
      wrappedTokenGatewayV3 =
        contractAddressOverrides.arbitrumOne.aaveV3.wrappedTokenGatewayV3
      break
  }

  permissions.push(
    {
      ...allow.mainnet.aaveV3.wrappedTokenGatewayV3.depositETH(
        aaveLendingPoolV3,
        c.avatar,
        undefined,
        { send: true }
      ),
      targetAddress: wrappedTokenGatewayV3,
    },
    {
      ...allow.mainnet.aaveV3.wrappedTokenGatewayV3.withdrawETH(
        aaveLendingPoolV3,
        undefined,
        c.avatar
      ),
      targetAddress: wrappedTokenGatewayV3,
    },
    {
      ...allow.mainnet.aaveV3.aaveLendingPoolV3.setUserUseReserveAsCollateral(
        weth
      ),
      targetAddress: aaveLendingPoolV3,
    }
  )
  return permissions
}

export const borrowToken = (token: Token, chain: Chain) => {
  let aaveLendingPoolV3: `0x${string}`

  switch (chain) {
    case Chain.eth:
      aaveLendingPoolV3 = contracts.mainnet.aaveV3.aaveLendingPoolV3
      break
    case Chain.arb1:
      aaveLendingPoolV3 =
        contractAddressOverrides.arbitrumOne.aaveV3.aaveLendingPoolV3
      break
  }

  return [
    ...allowErc20Approve([token.token], [aaveLendingPoolV3]),
    {
      ...allow.mainnet.aaveV3.aaveLendingPoolV3.borrow(
        token.token,
        undefined,
        undefined,
        undefined,
        c.avatar
      ),
      targetAddress: aaveLendingPoolV3,
    },
    {
      ...allow.mainnet.aaveV3.aaveLendingPoolV3.repay(
        token.token,
        undefined,
        undefined,
        c.avatar
      ),
      targetAddress: aaveLendingPoolV3,
    },
    {
      ...allow.mainnet.aaveV3.aaveLendingPoolV3.swapBorrowRateMode(token.token),
      targetAddress: aaveLendingPoolV3,
    },
  ]
}

export const borrowEther = (chain: Chain) => {
  let aaveLendingPoolV3: `0x${string}`
  let weth: `0x${string}`
  let wrappedTokenGatewayV3: `0x${string}`

  switch (chain) {
    case Chain.eth:
      aaveLendingPoolV3 = contracts.mainnet.aaveV3.aaveLendingPoolV3
      weth = contracts.mainnet.weth
      wrappedTokenGatewayV3 = contracts.mainnet.aaveV3.wrappedTokenGatewayV3
      break
    case Chain.arb1:
      aaveLendingPoolV3 =
        contractAddressOverrides.arbitrumOne.aaveV3.aaveLendingPoolV3
      weth = contractAddressOverrides.arbitrumOne.weth
      wrappedTokenGatewayV3 =
        contractAddressOverrides.arbitrumOne.aaveV3.wrappedTokenGatewayV3
      break
  }

  const permissions: Permission[] = [
    {
      ...allow.mainnet.aaveV3.wrappedTokenGatewayV3.borrowETH(
        aaveLendingPoolV3
      ),
      targetAddress: wrappedTokenGatewayV3,
    },
    {
      ...allow.mainnet.aaveV3.wrappedTokenGatewayV3.repayETH(
        aaveLendingPoolV3,
        undefined,
        undefined,
        c.avatar,
        { send: true }
      ),
      targetAddress: wrappedTokenGatewayV3,
    },
    {
      ...allow.mainnet.aaveV3.aaveLendingPoolV3.swapBorrowRateMode(weth),
      targetAddress: aaveLendingPoolV3,
    },
  ]

  if (chain === Chain.eth) {
    permissions.push(
      allow.mainnet.aaveV3.variableDebtWETH.approveDelegation(
        wrappedTokenGatewayV3
      ),
      allow.mainnet.aaveV3.stableDebtWETH.approveDelegation(
        wrappedTokenGatewayV3
      )
    )
  }
  return permissions
}
