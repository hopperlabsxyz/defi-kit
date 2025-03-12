import { eth } from "."
import { wallets } from "../../../test/wallets"
import { applyPermissions, stealErc20 } from "../../../test/helpers"
import { eth as kit } from "../../../test/kit"
import { AbiCoder, ethers, parseEther, toBeHex } from "ethers"
import { Chain, contracts } from "../../../src"
import { getProvider } from "../../../test/provider"
import { c } from "zodiac-roles-sdk/."

const weth = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
const input1 =
  "0x000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee000000000000000000000000000000000000000000000000001ba55f6289df860000000000000000000000007f39c581f595b53c5cb19bd0b3f8da6c935e2ca0"
// const inpu4 = ""
describe("spectra", () => {
  describe("deposit action", () => {
    beforeAll(async () => {
      await applyPermissions(Chain.eth, await eth.deposit())
    })

    it("deposit", async () => {
      const provider = getProvider(Chain.eth)
      const amount = BigInt(toBeHex(parseEther("10")))
      const router = contracts.mainnet.spectra.router

      // Set up test balance
      await provider.send("anvil_setBalance", [
        wallets.avatar,
        toBeHex(parseEther("10")),
      ])

      // For command 0x04 - DEPOSIT_ASSET_IN_IBT
      // Parameters needed: (address ibt, uint256 assets, address recipient)
      const ibtAddress = "0xd89fc47aacbb31e2bf23ec599f593a4876d8c18c"
      const assets = BigInt(
        "0x8000000000000000000000000000000000000000000000000000000000000000"
      )

      // For command 0x00 -  TRANSFER_FROM
      // /*** Transfers tokens from msg.sender to the Router.
      // * (address token, uint256 value)

      const token = weth
      const value = BigInt(
        "0x8000000000000000000000000000000000000000000000000000000000000000"
      )
      // Encode the parameters properly
      const encodedParams1 = ethers.AbiCoder.defaultAbiCoder().encode(
        ["address", "uint256", "address"],
        [ibtAddress, assets, wallets.avatar]
      )

      const encodedParams2 = ethers.AbiCoder.defaultAbiCoder().encode(
        ["address", "uint256"],
        [token, value]
      )

      console.log("Encoded parameters:", encodedParams1)

      // Approve tokens first (required for most operations)
      // await kit.asMember.weth.approve(router, amount)

      await expect(
        kit.asMember.spectra.router["execute(bytes,bytes[])"]("0x00", [
          encodedParams2,
        ])
      ).not.toRevert()

      // // Execute the deposit command with proper encoded parameters
      // await expect(
      //   kit.asMember.spectra.router["execute(bytes,bytes[])"]("0x04", [
      //     encodedParams1,
      //   ])
      // ).not.toRevert()
    })
  })
})
