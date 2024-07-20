import tokensEthereum from "./_info_ethereum"
import tokensArbitrum from "./_info_arbitrum"

export type TokenEthereum = (typeof tokensEthereum)[number]
export type TokensArbitrum = (typeof tokensArbitrum)[number]
export type Token = TokenEthereum | TokensArbitrum

export const FEES = ["0.01%", "0.05%", "0.3%", "1%"] as const

export type Fee = (typeof FEES)[number]
