import { eth } from "."

describe("annotations", () => {
  it("should annotate all repertoire functions", async () => {
    const permissionSet = await eth.aura.unstake({
      rewarder: "0xB9D6ED734Ccbdd0b9CadFED712Cf8AC6D0917EcD",
    })
    expect(permissionSet).toHaveProperty("annotation", {
      uri: "https://kit.karpatkey.com/api/v1/repertoire/permissions/eth/aura/withdraw?rewarder=0xB9D6ED734Ccbdd0b9CadFED712Cf8AC6D0917EcD",
      schema: "https://kit.karpatkey.com/api/v1/openapi.json",
    })
  })
})
