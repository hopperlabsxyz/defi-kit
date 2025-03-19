import { allow } from "zodiac-roles-sdk/kit"
// import { EthPool } from "./types"
// import { NotFoundError } from "../../errors"
// import { Permission } from "zodiac-roles-sdk/."
// import { allowErc20Approve } from "../../conditions"
import { c, Permission } from "zodiac-roles-sdk"
import { contracts } from "../../../eth-sdk/config"
import { allowErc20Approve } from "../../conditions"
import { wallets } from "../../../test/wallets"

const WSTETH = contracts.mainnet.lido.wstEth as `0x${string}`
export const ROUTER = "0xD733e545C65d539f588d7c3793147B497403F0d2"

const TRANSFER_FROM = "00" // (address token, uint256 value)
const DEPOSIT_ASSET_IN_IBT = "04" //(address ibt, uint256 assets, address recipient)
const DEPOSIT_IBT_IN_PT = "06" //(address pt, uint256 ibts, address ptRecipient, address ytRecipient, uint256 minShares)
const CURVE_ADD_LIQUIDITY = "0c" //(address pool, uint256[] amounts, uint256 min_mint_amount, address recipient)

const DEPOSIT_COMMAND = `0x${TRANSFER_FROM}${DEPOSIT_ASSET_IN_IBT}${DEPOSIT_IBT_IN_PT}${CURVE_ADD_LIQUIDITY}`

export const eth = {
  deposit: async () => {
    // const encoded = c.abiEncodedMatches(["0x00"], ["bytes1"])
    // console.log("Expected: in the permission: ", encoded())
    const permissions: Permission[] = []

    const ibt = "0xd89fc47aacbb31e2bf23ec599f593a4876d8c18c"
    const depositToken = "0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0"//wsteth
    const ADDRESS_THIS = "0x00000000000000000000000000000000000000e0"
    const CONTRACT_BALANCE =
      "0x8000000000000000000000000000000000000000000000000000000000000000"

    permissions.push(...allowErc20Approve([WSTETH], [ROUTER]), {
      ...allow.mainnet.spectra.router["execute(bytes,bytes[])"](
        c.abiEncodedMatches([DEPOSIT_COMMAND], ["bytes4"]), // _commands
        c.matches([
          // TRANSFER_FROM = "00" // (address token, uint256 value)
          c.abiEncodedMatches(
            [depositToken, undefined],
            ["address", "uint256"]
          ),
          // DEPOSIT_ASSET_IN_IBT = "04" //(address ibt, uint256 assets, address recipient)
          c.abiEncodedMatches(
            [ibt, undefined, undefined],
            ["address", "uint256", "address"]
          ),
          // DEPOSIT_IBT_IN_PT = "06" //(address pt, uint256 ibts, address ptRecipient, address ytRecipient, uint256 minShares)
          c.abiEncodedMatches(
            [undefined, undefined, undefined, undefined, undefined],
            ["address", "uint256", "address", "address", "uint256"]
          ),
          // CURVE_ADD_LIQUIDITY = "0c" //(address pool, uint256[] amounts, uint256 min_mint_amount, address recipient)
          c.abiEncodedMatches(
            [undefined, undefined, undefined, undefined],
            ["address", "uint256[]", "uint256", "address"]
          ),
        ]) // _inputs
      ),
      
    })
    console.log("permissions: ", permissions)
    console.log("commands: ", DEPOSIT_COMMAND)

    return permissions
  },
}
