import maticPools from "./_maticPools"

export type maticPools = (typeof maticPools)[number]
export type Pool = maticPools

export type maticToken = maticPools["tokens"][number]
export type Token = maticToken
