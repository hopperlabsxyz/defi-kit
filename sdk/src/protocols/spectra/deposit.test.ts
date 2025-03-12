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
      const tokenAddress = weth

      const command1 = "0x00" // TRANSFER_FROM
      const command2 = "0x02" // TRANSFER (this might represent another command)

      const input =
        "0x000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee000000000000000000000000000000000000000000000000001ba55f6289df860000000000000000000000007f39c581f595b53c5cb19bd0b3f8da6c935e2ca00000000000000000000000000000000000000000000000000015613d59ea54ac00000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000844e21fd0e900000000000000000000000000000000000000000000000000000000000000200000000000000000000000000f4a1d7fdf4890be35e71f3e0bbc4a0ec377eca3000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000003c000000000000000000000000000000000000000000000000000000000000005c00000000000000000000000000000000000000000000000000000000000000300000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee0000000000000000000000007f39c581f595b53c5cb19bd0b3f8da6c935e2ca0000000000000000000000000d733e545c65d539f588d7c3793147b497403f0d20000000000000000000000000000000000000000000000000000000067b3512400000000000000000000000000000000000000000000000000000000000002a"

      const decoded = ethers.AbiCoder.defaultAbiCoder().encode(
        ["address", "uint256", "address", "uint256", "address"],
        [input]
      )

      console.log(decoded)
      const input1 = ethers.AbiCoder.defaultAbiCoder().encode(
        ["address", "uint256"],
        [tokenAddress, amount.toString()]
      )
      // const input2 = ethers.utils.defaultAbiCoder.encode(
      //   ["address", "address", "uint256"],
      //   [recipientAddress, tokenAddress, value]
      // )

      const commands = [command1, command2]
      const inputs = [input1, input1]

      // Combine commands into a single execute call
      // await router.execute(commands, inputs)

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
          amount.toString(),
        ])
      ).not.toRevert()
    })
  })
})
