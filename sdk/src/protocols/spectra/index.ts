import { allow } from "zodiac-roles-sdk/kit"
import { EthPool } from "./types"
import { NotFoundError } from "../../errors"
import { Permission } from "zodiac-roles-sdk/."
import { allowErc20Approve } from "../../conditions"
import { c } from "zodiac-roles-sdk"
import { contracts } from "../../../eth-sdk/config"

const WSTETH = contracts.mainnet.lido.wstEth

// const findPool = (nameOrAddress: string) => {
//   const pools = _ethPools
//   const nameOrAddressLower = nameOrAddress.toLowerCase()
//   const pool = pools.find(
//     (pool) =>
//       pool.tokenAddress.toLowerCase() === nameOrAddressLower ||
//       pool.tokenSymbol.toLowerCase() === nameOrAddressLower
//   )
//   if (!pool) {
//     throw new NotFoundError(`Pool not found: ${nameOrAddress}`)
//   }
//   return pool
// }

export const eth = {
  deposit: async () => {
    const encoded = c.abiEncodedMatches(["0x12"], ["bytes1"])
    console.log(encoded())
    return [
      allow.mainnet.spectra.router["execute(bytes,bytes[])"](
        // c.abiEncodedMatches(["0x12"], ["bytes1"]), //command
        // encoded,
        undefined, //inputs
        undefined //inputs
      ),
    ]
  },
}

