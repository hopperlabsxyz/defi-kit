import { eth } from "."
import {
  BAL,
  B_80BAL_20WETH,
  B_80BAL_20WETH_PID,
  bb_a_USD_v1,
  bb_a_USD_v2,
  bb_a_USD_v3,
} from "./actions"
import { contracts } from "../../../eth-sdk/config"
import { Status } from "../../../test/types"
import { avatar, member } from "../../../test/wallets"
import { applyPermissions } from "../../../test/helpers"
import { eth as kit } from "../../../test/kit"
import { ZeroAddress, parseEther } from "ethers"

describe("balancer", () => {
  describe("lock", () => {
    beforeAll(async () => {
      await applyPermissions(await eth.lock())
    })

    it("deposit and withdraw from B-80BAL-20WETH pool", async () => {
      await expect(
        kit.asMember.balancer.vault.joinPool(
          B_80BAL_20WETH_PID,
          avatar.address,
          avatar.address,
          {
            assets: [BAL, ZeroAddress],
            maxAmountsIn: [0, parseEther("100")],
            userData:
              "0x000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000056bc75e2d63100000",
            fromInternalBalance: false,
          },
          { value: parseEther("100") }
        )
      ).not.toRevert()

      await expect(
        kit.asMember.balancer.vault.exitPool(
          B_80BAL_20WETH_PID,
          avatar.address,
          avatar.address,
          {
            assets: [BAL, contracts.mainnet.weth],
            minAmountsOut: [0, 0],
            userData:
              "0x00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001",
            toInternalBalance: false,
          }
        )
      ).not.toRevert()
    })

    it("lock and claim", async () => {
      let unlock_timestamp =
        Math.floor(new Date().getTime() / 1000) + 30 * 24 * 60 * 60
      await expect(
        kit.asMember.usdc
          .attach(B_80BAL_20WETH)
          .approve(contracts.mainnet.balancer.veBal, parseEther("200"))
      ).not.toRevert()

      // The create_lock() reverts because it checks if the call
      // is from a whitelisted smart contract (like a Safe), revert if not.
      // To check if the the smart contract is whitelisted you can query
      // the check() in https://etherscan.io/address/0x7869296Efd0a76872fEE62A058C8fBca5c1c826C
      await expect(
        kit.asMember.balancer.veBal.create_lock(
          parseEther("100"),
          unlock_timestamp
        )
      ).toRevert()

      // Test that the transaction goes through the roles
      await expect(
        kit.asMember.balancer.veBal.create_lock(
          parseEther("100"),
          unlock_timestamp
        )
      ).toBeAllowed()

      // Test that the transaction goes through the roles
      await expect(
        kit.asMember.balancer.veBal.increase_amount(parseEther("200"))
      ).toBeAllowed()

      unlock_timestamp = unlock_timestamp + 30 * 24 * 60 * 60
      // Test that the transaction goes through the roles
      await expect(
        kit.asMember.balancer.veBal.increase_unlock_time(unlock_timestamp)
      ).toBeAllowed()

      // Test that the transaction goes through the roles
      await expect(kit.asMember.balancer.veBal.withdraw()).toBeAllowed()

      // Claim only with avatar as user
      await expect(
        kit.asMember.balancer.feeDistributor.claimTokens(avatar.address, [
          bb_a_USD_v1,
          bb_a_USD_v2,
          bb_a_USD_v3,
          BAL,
          contracts.mainnet.usdc,
        ])
      ).not.toRevert()

      await expect(
        kit.asMember.balancer.feeDistributor.claimTokens(member.address, [
          bb_a_USD_v1,
          bb_a_USD_v2,
          bb_a_USD_v3,
          BAL,
          contracts.mainnet.usdc,
        ])
      ).toBeForbidden(Status.ParameterNotAllowed)
    })
  })
})
