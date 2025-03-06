import { eth } from "."
import { wallets } from "../../../test/wallets"
import { applyPermissions, stealErc20 } from "../../../test/helpers"
import { eth as kit } from "../../../test/kit"
import { parseEther, toBeHex } from "ethers"
import { Chain, contracts } from "../../../src"
import { getProvider } from "../../../test/provider"

const weth = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
const input1 = "0x000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee000000000000000000000000000000000000000000000000001ba55f6289df860000000000000000000000007f39c581f595b53c5cb19bd0b3f8da6c935e2ca0"
// const inpu4 = ""
describe("spectra", () => {
  describe("deposit action", () => {
    beforeAll(async () => {
      await applyPermissions(Chain.eth, await eth.deposit())
    })

    it("deposit", async () => {
      const provider = getProvider(Chain.eth)
      await provider.send("anvil_setBalance", [wallets.avatar, toBeHex(parseEther("10"))])
      // contracts.mainnet.weth.a
      await expect(
        kit.asMember.spectra.router["execute(bytes,bytes[])"](
          "0x00",
          [input1]
        )
      ).not.toRevert()
    })
  })
})
