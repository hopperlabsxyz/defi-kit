import { eth } from "."
import { wallets } from "../../../test/wallets"
import { applyPermissions, stealErc20 } from "../../../test/helpers"
import { eth as kit } from "../../../test/kit"
import { parseEther } from "ethers"
import { Chain } from "../../../src"

const MorphoBluePool = "0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb" // gtLRTcore Vault address
const STEAL_ADDRESS = "0xacB7027f271B03B502D65fEBa617a0d817D62b8e" // Address wstETH
const STEAL_WETH = "0xa1E2481a9CD0Cb0447EeB1cbc26F1b3fff3bec20"
const underlying_wsteth = "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0" // WstETH
const marketId =
  "0xb8fc70e82bc5bb53e773626fcc6a23f7eefa036918d7ef216ecfb1950a94a85e"

describe("Morpho supply", () => {
  describe("supply Action", () => {
    beforeAll(async () => {
      await applyPermissions(
        Chain.eth,
        await eth.supply({
          supplyTargets: [
            "0xb8fc70e82bc5bb53e773626fcc6a23f7eefa036918d7ef216ecfb1950a94a85e", //marketId
          ],
        })
      )
    })

    it("approuve -> supply -> withdraw", async () => {
      const amountCollateral = BigInt(parseEther("5").toString())
      const amountRandom = BigInt(parseEther("3").toString())
      const amountSupply = BigInt(parseEther("2").toString())
      //   const marketParams = {
      //     loanToken: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      //     amountCollateral: "0x35d8949372d46b7a3d5a56006ae77b215fc69bc0",
      //     irm: "0x870ac11d48b15db9a138cf899d20f13f79ba00bc",
      //     lltm: "0x870aC11D48B15DB9a138Cf899d20F13F79Ba00BC",
      //     oracle: "0xbf877b424be6d06ca4755af2c677120ec71cac53",
      //   }

      //NO NEED because we have idToMarketParams
      const unauthorizedMarketParams = {
        loanToken: "0x000000000000000000000000000000000000dEaD", //dead address
        collateralToken: "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0", //WstETH
        oracle: "0xbD60A6770b27E084E8617335ddE769241B0e71D8", //MorphoChainlinkOracleV2
        irm: "0x870aC11D48B15DB9a138Cf899d20F13F79Ba00BC", //AdaptiveCurveIrm
        lltv: "965000000000000000",
      }

      await stealErc20(
        Chain.eth,
        underlying_wsteth,
        parseEther("10"),
        STEAL_ADDRESS
      )
      await stealErc20(
        Chain.eth,
        "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        parseEther("10"),
        STEAL_WETH
      )
      await kit.asMember.weth
        .attach(underlying_wsteth)
        .approve(MorphoBluePool, amountCollateral)

      console.log("supply")
      await expect(
        kit.asMember.morpho.morphoBlue
          .attach(MorphoBluePool)
          .supply(
            await kit.asMember.morpho.morphoBlue.idToMarketParams(marketId),
            amountRandom,
            0,
            wallets.avatar,
            "0x"
          )
      ).not.toRevert()
      //     kit.asMember.morpho.morphoBlue
      //       .attach(MorphoBluePool)
      //       .supplyCollateral(
      //         await kit.asMember.morpho.morphoBlue.idToMarketParams(marketId),
      //         amountCollateral,
      //         wallets.avatar,
      //         "0x"
      //       )
      //   ).not.toRevert()

      //Omg I'm completetly exhausted, I can't even open my eyes

      //   await expect(
      //     kit.asMember.morpho.morphoBlue
      //       .attach(MorphoBluePool)
      //       .supplyCollateral(
      //         unauthorizedMarketParams,
      //         amountCollateral,
      //         wallets.avatar,
      //         "0x"
      //       )
      //   ).toRevert()

      //   console.log("withdraw")
      //   await expect(
      //     kit.asMember.morpho.morphoBlue
      //       .attach(MorphoBluePool)
      //       .borrow(
      //         await kit.asMember.morpho.morphoBlue.idToMarketParams(marketId),
      //         amountSupply,
      //         0,
      //         wallets.avatar,
      //         wallets.avatar

      //       )
      //   ).not.toRevert()

      //   await expect(
      //     kit.asMember.morpho.morphoBlue
      //       .attach(MorphoBluePool)
      //       .borrow(
      //         unauthorizedMarketParams,
      //         amountSupply,
      //         0,
      //         wallets.avatar,
      //         wallets.avatar
      //       )
      //   ).toRevert()

      //   await kit.asMember.weth.approve(MorphoBluePool, amountSupply)

      //   console.log("repay")
      //   await expect(
      //     kit.asMember.morpho.morphoBlue
      //       .attach(MorphoBluePool)
      //       .repay(
      //         await kit.asMember.morpho.morphoBlue.idToMarketParams(marketId),
      //         amountSupply,
      //         0,
      //         wallets.avatar,
      //         "0x"
      //       )
      //   ).not.toRevert()

      //   console.log("withdraw collateral")
      //   await expect(
      //     kit.asMember.morpho.morphoBlue
      //       .attach(MorphoBluePool)
      //       .withdrawCollateral(
      //         await kit.asMember.morpho.morphoBlue.idToMarketParams(marketId),
      //         amountCollateral,
      //         wallets.avatar,
      //         wallets.avatar
      //       )
      //   ).not.toRevert()
    })
  })
})
