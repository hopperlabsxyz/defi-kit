import { allow } from "zodiac-roles-sdk/kit"
// import { EthPool } from "./types"
// import { NotFoundError } from "../../errors"
// import { Permission } from "zodiac-roles-sdk/."
// import { allowErc20Approve } from "../../conditions"
import { c, Permission } from "zodiac-roles-sdk"
import { contracts } from "../../../eth-sdk/config"
import { allowErc20Approve } from "../../conditions"
import { wallets } from "../../../test/wallets"

// const WSTETH = contracts.mainnet.lido.wstEth as `0x${string}`
// export const ROUTER = "0xD733e545C65d539f588d7c3793147B497403F0d2"

const TRANSFER_FROM = "00" // (address token, uint256 value)
const DEPOSIT_ASSET_IN_IBT = "04" //(address ibt, uint256 assets, address recipient)
const DEPOSIT_IBT_IN_PT = "06" //(address pt, uint256 ibts, address ptRecipient, address ytRecipient, uint256 minShares)
const CURVE_ADD_LIQUIDITY = "0c" //(address pool, uint256[] amounts, uint256 min_mint_amount, address recipient)
const pool = "0xe119bad8a35b999f65b1e5fd48c626c327daa16b" // Vyper_contract => proxy (just a normal pool name ???)

const DEPOSIT_COMMAND = `0x${TRANSFER_FROM}${DEPOSIT_ASSET_IN_IBT}${DEPOSIT_IBT_IN_PT}${CURVE_ADD_LIQUIDITY}`

export const eth = {
  deposit: async () => {
    // const encoded = c.abiEncodedMatches(["0x00"], ["bytes1"])
    // console.log("Expected: in the permission: ", encoded())
    const permissions: Permission[] = []

    const ibt = "0xd89fc47aacbb31e2bf23ec599f593a4876d8c18c" //ibt = Interest bearing token -> proxy for SpectraWrappedILRT
    const depositToken = "0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0" //wsteth
    const ADDRESS_THIS = "0x00000000000000000000000000000000000000e0"
    const CONTRACT_BALANCE =
      "0x8000000000000000000000000000000000000000000000000000000000000000"

    permissions.push(
      ...allowErc20Approve([depositToken], [contracts.mainnet.spectra.router]),
      {
        ...allow.mainnet.spectra.router["execute(bytes,bytes[])"](
          c.abiEncodedMatches([DEPOSIT_COMMAND], ["bytes4"]), // _commands
          c.matches([
            // TRANSFER_FROM = "00"
            // Transfer the underlying tokens from the depositor's wallet to the Router
            c.abiEncodedMatches(
              [depositToken, undefined], //underlyint token, amount
              ["address", "uint256"]
            ),

            // DEPOSIT_ASSET_IN_IBT = "04"
            // Deposit all underlying tokens in the specified ERC4626 IBT contract to receive IBT shares
            c.abiEncodedMatches(
              //(address ibt, uint256 assets, address recipient)
              [ibt, undefined, undefined], //ibt, assets, recipient
              ["address", "uint256", "address"]
              // ✅ //    ✅    //  1:recipent
            ),

            // DEPOSIT_IBT_IN_PT = "06"
            c.abiEncodedMatches(
              //(address pt, uint256 ibts, address ptRecipient, address ytRecipient, uint256 minShares)
              [undefined, undefined, undefined, undefined, undefined],
              ["address", "uint256", "address", "address", "uint256"]
              // 1:pt  // ✅ // 1:ptRecipent //1:ytRecipent //  ✅
            ),

            // CURVE_ADD_LIQUIDITY = "0c"
            // Add IBT and PT liquidity to the Curve Pool. Send the Curve LP token to the user.
            c.abiEncodedMatches(
              //(address pool, uint256[] amounts, uint256 min_mint_amount, address recipient)
              [pool, undefined, undefined, undefined], //address pool,
              ["address", "uint256[]", "uint256", "address"]
              // 1:pool //   ✅   //   ✅    // 1: recipient
            ),
          ])// TODO: recipent + ptRecipient + ytRecipient (= avatar?) + pt + pool
        ),
      }
    )
    console.log("permissions: ", permissions)
    console.log("commands: ", DEPOSIT_COMMAND)

    return permissions
  },
}
