import maticPools from "./_maticPools"
import arb1Pools from "./_arb1Pools"

export type maticPools = (typeof maticPools)[number]
export type arb1Pools = (typeof arb1Pools)[number]
export type Pool = maticPools | arb1Pools

export type maticToken = maticPools["tokens"][number]
export type arb1Token = arb1Pools["tokens"][number]
export type Token = maticToken | arb1Token
