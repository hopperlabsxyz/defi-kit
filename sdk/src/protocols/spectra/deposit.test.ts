import { eth } from "."
import { wallets } from "../../../test/wallets"
import { applyPermissions, stealErc20 } from "../../../test/helpers"
import { eth as kit } from "../../../test/kit"
import { parseEther, toBeHex } from "ethers"
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
      const amount = toBeHex(parseEther("10"))
      const router = contracts.mainnet.spectra.router
      await provider.send("anvil_setBalance", [
        wallets.avatar,
        toBeHex(parseEther("10")),
      ])
      //trying the command 0x00 = uint256 constant TRANSFER_FROM = 0x00;
      // /**
      //  * Transfers tokens from msg.sender to the Router.
      //   * (address token, uint256 value)
      //   */
      // Try using a different command format - either the function selector or properly encoded
      const SPECTRA_CMD = "0xe21fd0e9" // This is the function selector found in your input data
      console.log("Command being passed:", "0x00")
      console.log("Arguments being passed:", [weth, amount])

      await kit.asMember.weth.approve(router, amount)
      await expect(
        kit.asMember.spectra.router["execute(bytes,bytes[])"]("0x00", [
          weth,
          amount,
        ])
      ).not.toRevert()
    })
  })
})
