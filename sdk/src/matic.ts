import { matic as allow } from "./protocols"
import { matic as schema } from "./protocols/schema"

import { createApply } from "./apply"
import { createExportToSafeTransactionBuilder } from "./export"

export { allow, schema }

const chainId = 137

export const apply = createApply(chainId)

export const exportToSafeTransactionBuilder =
  createExportToSafeTransactionBuilder(chainId)
