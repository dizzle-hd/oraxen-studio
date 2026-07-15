import type { ZodType } from 'zod'
import type { ComponentType } from 'react'
import type { ValidationIssue } from '../validation'

/** Extend this union in each mechanic module's own file, then re-export from index.ts. */
export type MechanicId = string

export interface MechanicFormProps<TData> {
  value: TData
  onChange: (value: TData) => void
}

export interface ValidationContext {
  itemId: string
  /** All items in the project, keyed by id - used for cross-item checks like custom_variation uniqueness. */
  allItemsByMechanic: Map<MechanicId, { itemId: string; data: unknown }[]>
}

/**
 * A self-contained plug-in describing one Oraxen `Mechanics.<id>` entry.
 * The item editor and export pipeline only ever iterate the registry -
 * no central switch/if-chain keys off mechanic id anywhere in the app.
 */
export interface MechanicDefinition<TData = unknown> {
  id: MechanicId
  labelKey: string
  /** Key nested under `Mechanics:` in the exported YAML, e.g. "furniture". */
  yamlKey: string
  schema: ZodType<TData>
  defaultValue: () => TData
  FormComponent: ComponentType<MechanicFormProps<TData>>
  toYaml: (data: TData) => unknown
  fromYaml: (raw: unknown) => TData
  validate: (data: TData, ctx: ValidationContext) => ValidationIssue[]
  /** Mechanics sharing a namespace (e.g. noteblock+stringblock) share one custom_variation pool. */
  variationNamespace?: string
}
