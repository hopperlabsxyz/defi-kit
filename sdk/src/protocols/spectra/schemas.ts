import { z } from zod
import ethPools from ./_ethPools

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