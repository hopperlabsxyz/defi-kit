import { allow } from "zodiac-roles-sdk/kit"
// import { EthPool } from "./types"
// import { NotFoundError } from "../../errors"
// import { Permission } from "zodiac-roles-sdk/."
// import { allowErc20Approve } from "../../conditions"
import { c } from "zodiac-roles-sdk"
import { contracts } from "../../../eth-sdk/config"

const WSTETH = contracts.mainnet.lido.wstEth

export const eth = {
  deposit: async () => {
    const encoded = c.abiEncodedMatches(["0x00"], ["bytes1"])
    console.log("Expected: in the permission: ", encoded())
    return [
      allow.mainnet.spectra.router["execute(bytes,bytes[])"](
        // c.abiEncodedMatches(["0x00"], ["bytes1"]), //command
        // encoded,
        undefined, //command
        undefined //inputs
      ),
    ]
  },
}
