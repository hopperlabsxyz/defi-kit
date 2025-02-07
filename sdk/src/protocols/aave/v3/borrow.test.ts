import { eth } from "."
import { avatar, member } from "../../../../test/wallets"
import { applyPermissions, stealErc20 } from "../../../../test/helpers"
import { contracts } from "../../../../eth-sdk/config"
import { Status } from "../../../../test/types"
import { eth as kit } from "../../../../test/kit"
import { parseEther, parseUnits } from "ethers"

describe("aaveV3", () => {
  describe("borrow", () => {
    beforeAll(async () => {
      await applyPermissions(
        await eth.deposit({ market: "Core", targets: ["ETH", "USDC"] })
      )
      await applyPermissions(
        await eth.borrow({ market: "Core", targets: ["ETH", "USDC"] })
      )
    })

    it("deposit USDC", async () => {
      await stealErc20(
        contracts.mainnet.usdc,
        parseUnits("10000", 6),
        contracts.mainnet.balancer.vault
      )
      await expect(
        kit.asMember.usdc.approve(
          contracts.mainnet.aaveV3.poolCoreV3,
          parseUnits("10000", 6)
        )
      ).not.toRevert()
      await expect(
        kit.asMember.aaveV3.poolCoreV3.supply(
          contracts.mainnet.usdc,
          parseUnits("10000", 6),
          avatar.address,
          0
        )
      ).not.toRevert()
    })

    it("borrow ETH and repay", async () => {
      await expect(
        kit.asMember.aaveV3.variableDebtWeth.approveDelegation(
          contracts.mainnet.aaveV3.wrappedTokenGatewayCoreV3,
          parseEther("1")
        )
      ).not.toRevert()

      await expect(
        kit.asMember.aaveV3.wrappedTokenGatewayCoreV3.borrowETH(
          contracts.mainnet.aaveV3.poolCoreV3,
          parseEther("1"),
          0
        )
      ).not.toRevert()

      await expect(
        kit.asMember.aaveV3.wrappedTokenGatewayCoreV3.repayETH(
          contracts.mainnet.aaveV3.poolCoreV3,
          parseEther("0.5"),
          avatar.address,
          { value: parseEther("0.5") }
        )
      ).not.toRevert()
    }, 30000) // Added 30 seconds of timeout because the borrow takes too long and the test fails.

    it("deposit ETH, borrow USDC and repay", async () => {
      await expect(
        kit.asMember.aaveV3.wrappedTokenGatewayCoreV3.depositETH(
          contracts.mainnet.aaveV3.poolCoreV3,
          avatar.address,
          0,
          { value: parseEther("1") }
        )
      ).not.toRevert()

      await expect(
        kit.asMember.aaveV3.poolCoreV3.borrow(
          contracts.mainnet.usdc,
          parseUnits("100", 6),
          2,
          0,
          avatar.address
        )
      ).not.toRevert()

      await expect(
        kit.asMember.usdc.approve(
          contracts.mainnet.aaveV3.poolCoreV3,
          parseUnits("50", 6)
        )
      ).not.toRevert()

      await expect(
        kit.asMember.aaveV3.poolCoreV3.repay(
          contracts.mainnet.usdc,
          parseUnits("50", 6),
          2,
          avatar.address
        )
      ).not.toRevert()
    })

    // Roles Module testing without executing transactions
    // Test with ETH
    it("allows borrowing ETH from avatar", async () => {
      await expect(
        kit.asMember.aaveV3.variableDebtWeth.approveDelegation(
          contracts.mainnet.aaveV3.wrappedTokenGatewayCoreV3,
          parseEther("1")
        )
      ).toBeAllowed()

      await expect(
        kit.asMember.aaveV3.wrappedTokenGatewayCoreV3.borrowETH(
          contracts.mainnet.aaveV3.poolCoreV3,
          parseEther("1"),
          0
        )
      ).toBeAllowed()
    })

    it("only allows repaying ETH from avatar", async () => {
      await expect(
        kit.asMember.aaveV3.wrappedTokenGatewayCoreV3.repayETH(
          contracts.mainnet.aaveV3.poolCoreV3,
          parseEther("1"),
          avatar.address,
          { value: parseEther("1") }
        )
      ).toBeAllowed()

      await expect(
        kit.asMember.aaveV3.wrappedTokenGatewayCoreV3.repayETH(
          contracts.mainnet.aaveV3.poolCoreV3,
          parseEther("1"),
          member.address,
          { value: parseEther("1") }
        )
      ).toBeForbidden(Status.ParameterNotAllowed)
    })

    // Test with USDC
    it("only allows borrowing USDC from avatar", async () => {
      await expect(
        kit.asMember.aaveV3.poolCoreV3.borrow(
          contracts.mainnet.usdc,
          parseUnits("10000", 6),
          2,
          0,
          avatar.address
        )
      ).toBeAllowed()

      await expect(
        kit.asMember.aaveV3.poolCoreV3.borrow(
          contracts.mainnet.usdc,
          parseUnits("10000", 6),
          2,
          0,
          member.address
        )
      ).toBeForbidden(Status.ParameterNotAllowed)
    })

    it("only allows repaying USDC from avatar", async () => {
      await stealErc20(
        contracts.mainnet.usdc,
        parseUnits("10000", 6),
        contracts.mainnet.balancer.vault
      )

      await expect(
        kit.asMember.usdc.approve(
          contracts.mainnet.aaveV3.poolCoreV3,
          parseUnits("10000", 6)
        )
      ).toBeAllowed()

      await expect(
        kit.asMember.aaveV3.poolCoreV3.repay(
          contracts.mainnet.usdc,
          parseUnits("10000", 6),
          2,
          avatar.address
        )
      ).toBeAllowed()

      await expect(
        kit.asMember.aaveV3.poolCoreV3.repay(
          contracts.mainnet.usdc,
          parseUnits("10000", 6),
          2,
          member.address
        )
      ).toBeForbidden(Status.ParameterNotAllowed)
    })
  })
})
