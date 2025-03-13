import { allow } from "zodiac-roles-sdk/kit"
// import { EthPool } from "./types"
// import { NotFoundError } from "../../errors"
// import { Permission } from "zodiac-roles-sdk/."
// import { allowErc20Approve } from "../../conditions"
import { c, Permission } from "zodiac-roles-sdk"
import { contracts } from "../../../eth-sdk/config"
import { allowErc20Approve } from "../../conditions"

const WSTETH = contracts.mainnet.lido.wstEth
// Assert as `0x${string}`
const xWSTETH: `0x${string}`[] = [WSTETH as `0x${string}`]
const router = contracts.mainnet.spectra.router
const xRouter: `0x${string}`[] = [router as `0x${string}`]

export const eth = {
  deposit: async () => {
    const encoded = c.abiEncodedMatches(["0x00"], ["bytes1"])
    console.log("Expected: in the permission: ", encoded())
    const permissions: Permission[] = []
    permissions.push(
      ...allowErc20Approve(xWSTETH, xRouter),
      {
        //token approve first
        ...allow.mainnet.lido.wstEth.approve(
          contracts.mainnet.spectra.router,
          undefined
        ),
      },
      {
        ...allow.mainnet.spectra.router["execute(bytes,bytes[])"](
          // c.abiEncodedMatches(["0x00"], ["bytes1"]), //command
          // encoded,
          undefined, //command
          undefined //inputs
        ),
      }
    )
    return permissions
  },
}
