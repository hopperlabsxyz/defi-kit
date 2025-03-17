import { eth } from "."
import { wallets } from "../../../test/wallets"
import { applyPermissions, stealErc20 } from "../../../test/helpers"
import { eth as kit } from "../../../test/kit"
import { ethers, isAddress, parseEther, toBeHex } from "ethers"
import { Chain, contracts } from "../../../src"
import { getProvider } from "../../../test/provider"
import { ROUTER } from "./index"

const WSTETH = contracts.mainnet.lido.wstEth as `0x${string}`
const STEAL_ADDRESS = "0x0B925eD163218f6662a35e0f0371Ac234f9E9371"

describe("spectra", () => {
  describe("deposit action", () => {
    beforeAll(async () => {
      await applyPermissions(Chain.eth, await eth.deposit())
    })

    it("deposit", async () => {
      const amount = BigInt(toBeHex(parseEther("1")))

      await stealErc20(Chain.eth, WSTETH, amount, STEAL_ADDRESS)
      // Approve tokens first (required for most operations)
      await kit.asMember.wsteth.approve(ROUTER, amount)

      const commands = "0x0004060c"
      const inputs = [
        "0x0000000000000000000000007f39c581f595b53c5cb19bd0b3f8da6c935e2ca00000000000000000000000000000000000000000000000000de0b6b3a7640000",
        "0x000000000000000000000000d89fc47aacbb31e2bf23ec599f593a4876d8c18c800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000e0",
        "0x0000000000000000000000004ae0154f83427a5864e5de6513a47dac9e5d5a690000000000000000000000000000000000000000000000000710f21f993ae43300000000000000000000000000000000000000000000000000000000000000e00000000000000000000000008e53d04644e9ab0412a8c6bd228c84da7664cfe300000000000000000000000000000000000000000000000006fee6cca8cbc501",
        "0x000000000000000000000000e119bad8a35b999f65b1e5fd48c626c327daa16b8000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006e2b1ca24a75b310000000000000000000000008e53d04644e9ab0412a8c6bd228c84da7664cfe3",
      ]
      // Execute the deposit command with proper encoded parameters
      await expect(
        kit.asMember.spectra.router["execute(bytes,bytes[])"](commands, inputs)
      ).not.toRevert()
    })
  })
})
