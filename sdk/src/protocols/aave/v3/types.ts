import tokensEthereum from "./_info_ethereum"
import tokensArbitrum from "./_info_arbitrum"

export type TokenEthereum = (typeof tokensEthereum)[number]
export type TokensArbitrum = (typeof tokensArbitrum)[number]
