import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi"
import { coercePermission } from "zodiac-roles-sdk"
import { ChainPrefix, queryPermissionSet, sdks } from "../sdk"
import {
  permission,
  permissionsQueryBase,
  transactionsDocParams,
  transactionsJson,
  transactionsQueryBase,
} from "../schema"
import { PermissionsHandler, TransactionsHandler } from "../handle"
import { decodeBytes32String } from "defi-kit/."

export const allowBorrow: TransactionsHandler = async (query) => {
  const {
    mod: { address, chain },
    role,
    protocol,
  } = transactionsQueryBase.parse(query)
  const permissions = await queryPermissionSet({
    action: "borrow",
    chain,
    protocol,
    query,
  })

  const { apply, exportToSafeTransactionBuilder } = sdks[chain]
  const calls = await apply(role, permissions, {
    address,
    mode: "extend",
  })

  return exportToSafeTransactionBuilder(calls, {
    name: `Extend permissions of "${decodeBytes32String(role)}" role`,
    description: `Allow borrowing the specified \`tokens\` on ${protocol}`,
  })
}

export const registerAllowBorrow = (
  registry: OpenAPIRegistry,
  chainPrefix: ChainPrefix,
  protocol: string
) => {
  const { schema } = sdks[chainPrefix] as any
  const querySchema = schema[protocol].borrow

  registry.registerPath({
    method: "get",
    path: `/${chainPrefix}:{mod}/{role}/allow/${protocol}/borrow`,
    summary: `Transactions for granting permissions to borrow the specified tokens`,
    tags: [`${protocol} allow`],
    request: {
      params: transactionsDocParams,
      query: querySchema,
    },

    responses: {
      200: {
        description: "Transactions for updating role permissions",
        content: {
          "application/json": {
            schema: transactionsJson,
          },
        },
      },
    },
  })
}

// @ts-ignore
export const borrowPermissions: PermissionsHandler = async (query) => {
  const permissions = await queryPermissionSet({
    action: "borrow",
    ...permissionsQueryBase.parse(query),
    query,
  } as any) // todo fix
  return permissions.map(coercePermission)
}

export const registerBorrowPermissions = (
  registry: OpenAPIRegistry,
  chainPrefix: ChainPrefix,
  protocol: string
) => {
  const { schema } = sdks[chainPrefix] as any
  const querySchema = schema[protocol].borrow

  registry.registerPath({
    method: "get",
    path: `/permissions/${chainPrefix}/${protocol}/borrow`,
    summary: `Borrow the specified tokens on ${protocol}`,
    tags: [`${protocol} permissions`],
    request: {
      query: querySchema,
    },

    responses: {
      200: {
        description: "Permissions for borrowing the specified tokens",
        content: {
          "application/json": {
            schema: permission.array(),
          },
        },
      },
    },
  })
}
