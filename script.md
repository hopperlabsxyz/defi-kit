# Protocol Integration Guide

## File Structure
```
protocol/
├── index.ts
├── types.ts
├── schema.ts
├── _ethPools.ts
└── action.test.ts
```

## Setup Steps

1. Create protocol directory and files:
```bash
mkdir protocol
cd protocol
touch index.ts types.ts schema.ts _ethPools.ts action.test.ts
```

2. Basic file contents:

### types.ts
```typescript
import ethPools from "./_ethPools"

export type EthPool = (typeof ethPools)[number]
```

```bash
cd protocol
echo "import ethPools from "./_ethPools"

export type EthPool = (typeof ethPools)[number]" > types.ts
```


### schema.ts
```typescript
import { z } from "zod"
import ethPools from "./_ethPools"

const zEthPool = z.enum([
  ...ethPools.map((pool) => pool.tokenSymbol),
  ...ethPools.map((pool) => pool.tokenAddress),
] as [string, string, ...string[]])

export const eth = {
  action1: z.object({
    targets: zEthPool.array(),
  }),
  action2: z.object({
    targets: zEthPool.array(),
  }),
}
```

```bash
echo "import { z } from "zod"
import ethPools from "./_ethPools"

const zEthPool = z.enum([
  ...ethPools.map((pool) => pool.tokenSymbol),
  ...ethPools.map((pool) => pool.tokenAddress),
] as [string, string, ...string[]])

export const eth = {
  action1: z.object({
    targets: zEthPool.array(),
  }),
  action2: z.object({
    targets: zEthPool.array(),
  }),
}" > schema.ts
```

### _ethPools.ts
```typescript
export default [
  {
    name: "DC_wstETH",
    address: "0xC329400492c6ff2438472D4651Ad17389fCb843a",
    tokenAddress: "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0",
    tokenSymbol: "wstETH",
  },...
] as const
```

```bash
echo "export default [
  {
    name: "DC_wstETH",
    address: "0xC329400492c6ff2438472D4651Ad17389fCb843a",
    tokenAddress: "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0",
    tokenSymbol: "wstETH",
  },...
] as const" > _ethPools.ts
```

### index.ts example symbiotic
```typescript
import { allow } from "zodiac-roles-sdk/kit"
import { EthPool } from "./types"
import { NotFoundError } from "../../errors"
import _ethPools from "./_ethPools"
import { Permission } from "zodiac-roles-sdk/."
import { allowErc20Approve } from "../../conditions"
import { c } from "zodiac-roles-sdk"
import { contracts } from "../../../eth-sdk/config"

const WSTETH = contracts.mainnet.lido.wstEth

const findPool = (nameOrAddress: string) => {
  const pools = _ethPools
  const nameOrAddressLower = nameOrAddress.toLowerCase()
  const pool = pools.find(
    (pool) =>
      pool.tokenAddress.toLowerCase() === nameOrAddressLower ||
      pool.tokenSymbol.toLowerCase() === nameOrAddressLower
  )
  if (!pool) {
    throw new NotFoundError(`Pool not found: ${nameOrAddress}`)
  }
  return pool
}

export const eth = {
  deposit: async ({
    targets,
  }: {
    targets: (EthPool["tokenAddress"] | EthPool["tokenSymbol"])[]
  }) => {
    return targets.flatMap((target) => {
      const pool = findPool(target)
      const permissions: Permission[] = []
      if (pool.tokenSymbol === "wstETH") {
        permissions.push(
          allow.mainnet.lido.stEth.approve(WSTETH),
          allow.mainnet.lido.wstEth.wrap()
        )
      }
      permissions.push(
        ...allowErc20Approve([pool.tokenAddress], [pool.address]),
        {
          ...allow.mainnet.symbiotic.defaultCollateral.action1(
            c.avatar,
            undefined
          ),
          targetAddress: pool.address,
        }
      )
      return permissions
    })
  },
}

```

### action.test.ts example symbiotic
```typescript
import { eth } from "."
import { avatar } from "../../../test/wallets"
import { applyPermissions, stealErc20 } from "../../../test/helpers"
import { eth as kit } from "../../../test/kit"
import _ethPools from "./_ethPools"
import { parseEther } from "ethers"

const stealAddress = "0x3c22ec75ea5D745c78fc84762F7F1E6D82a2c5BF"
const defaultCollateral = "0xC329400492c6ff2438472D4651Ad17389fCb843a" //wstETHPool
const underlying = "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0" //wstETH token
const stETHToken = "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84"
const stealAddress1 = "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0"

describe("symbiotic", () => {
  describe("deposit action", () => {
    beforeAll(async () => {
      await applyPermissions(await eth.deposit({ targets: ["wstETH"] }))
    })

    it("deposit", async () => {
      const amount = parseEther("10")
      await stealErc20(underlying, amount, stealAddress)
      await kit.asAvatar.weth
        .attach(underlying)
        .approve(defaultCollateral, amount)
      await expect(
        kit.asMember.symbiotic.defaultCollateral
          .attach(defaultCollateral)
          ["deposit(address,uint256)"](avatar.address, amount)
      ).not.toRevert()
    })

    it("wrap stETH", async () => {
      const amount = parseEther("10")
      await stealErc20(stETHToken, amount, stealAddress1)
      await expect(
        kit.asMember.lido.stEth.approve(underlying, amount)
      ).not.toRevert()
      await expect(kit.asMember.lido.wstEth.wrap(amount)).not.toRevert()
    })

    it("withdraw", async () => {
      const amount = parseEther("10")
      await stealErc20(underlying, amount, stealAddress)
      await kit.asAvatar.weth
        .attach(underlying)
        .approve(defaultCollateral, amount)
      await expect(
        kit.asMember.symbiotic.defaultCollateral
          .attach(defaultCollateral)
          ["deposit(address,uint256)"](avatar.address, amount)
      ).not.toRevert()
      await expect(
        kit.asMember.symbiotic.defaultCollateral
          .attach(defaultCollateral)
          .withdraw(avatar.address, amount)
      ).not.toRevert()
    })
  })
})

```

## Testing
```bash
yarn install
yarn setup
yarn test:watch protocol/deposit
```
