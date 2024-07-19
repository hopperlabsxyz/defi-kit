import ethInfo from "./_info_ethereum"
import arbInfo from "./_info_arbitrum"

export type EthToken = (typeof ethInfo)[number]
export type ArbToken = (typeof arbInfo)[number]

export type Token = EthToken | ArbToken

export const FEES = ["0.01%", "0.05%", "0.3%", "1%"] as const

export type Fee = (typeof FEES)[number]
