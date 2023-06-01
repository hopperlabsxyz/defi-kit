import { SomeZodObject } from "zod"
import { PresetAllowEntry } from "zodiac-roles-sdk/index"

export type Action = "deposit" | "borrow" | "stake" | "claim" | "swap"

export enum Chain {
  eth = "eth",
  gor = "gor",
}

// These types define the common interface for actions across all protocols
export type ProtocolActions = {
  deposit?: (options: { targets: any[] }) => PresetAllowEntry[]

  borrow?: (options: {}) => PresetAllowEntry[]

  stake?: (options: {}) => PresetAllowEntry[]

  claim?: (options: {}) => PresetAllowEntry[]

  swap?: (options: {
    sell?: any[]
    buy?: any[]
    pools?: any[]
  }) => PresetAllowEntry[]
}

// For registering protocols in the REST API we need zod schemas for the specific parameters of each action
export type ProtocolSchemas = {
  deposit?: SomeZodObject
  borrow?: SomeZodObject
  stake?: SomeZodObject
  claim?: SomeZodObject
  swap?: SomeZodObject
}
