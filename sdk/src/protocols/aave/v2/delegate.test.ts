import { eth } from "."
import { avatar, member } from "../../../../test/wallets"
import {
  applyPermissions,
} from "../../../../test/helpers"
import { contracts } from "../../../../eth-sdk/config"
import { Status } from "../../../../test/types"
import { testKit } from "../../../../test/kit"
import { parseEther } from "ethers/lib/utils"

const DELEGATEE = "0x849D52316331967b6fF1198e5E32A0eB168D039d"

describe("aave_v2", () => {
  describe("delegate", () => {
    beforeAll(async () => {
      await applyPermissions(await eth.delegate({ targets: ["AAVE"], delegatee: DELEGATEE }))
    })

    it("only allow delegation of AAVE to delegatee", async () => {
      await expect(
        testKit.eth.aaveV2.aave.delegate(
          DELEGATEE
        )
      ).not.toRevert()

      await expect(
        testKit.eth.aaveV2.aave.delegate(
          member._address
        )
      ).toBeForbidden(Status.ParameterNotAllowed)

      await expect(
        testKit.eth.aaveV2.aave.delegateByType(
          DELEGATEE,
          0
        )
      ).not.toRevert()

      await expect(
        testKit.eth.aaveV2.aave.delegateByType(
          member._address,
          0
        )
      ).toBeForbidden(Status.ParameterNotAllowed)

      // Test to go through roles
      await expect(
        testKit.eth.aaveV2.governanceV2.submitVote(
          1,
          true
        )
      ).toBeAllowed()
    })
  })
})