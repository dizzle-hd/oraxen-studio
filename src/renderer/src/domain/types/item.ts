import type { AssetReference } from './asset'
import type { MechanicId } from './mechanics/base'

export type PackMode = 'generated' | 'custom_model' | 'none'

export interface PackSection {
  mode: PackMode
  /** Only relevant when mode === 'generated'. e.g. "item/handheld", "item/generated", "block/cube_all". */
  parentModel?: string
  /** Only relevant when mode === 'generated'. Ordered texture layers, or named-slot textures for block models. */
  textures?: AssetReference[]
  namedTextures?: Record<string, AssetReference>
  /** Only relevant when mode === 'custom_model'. Pre-made Blockbench-exported JSON model. */
  customModel?: AssetReference
  blockingModel?: AssetReference
}

export interface OraxenItem {
  id: string
  displayName: string
  material: string
  permission?: string
  pack: PackSection
  mechanics: Partial<Record<MechanicId, unknown>>
  /** Unrecognized top-level YAML fields, preserved verbatim so importing an existing pack never loses data. */
  extra?: Record<string, unknown>
}

export function createEmptyItem(id: string): OraxenItem {
  return {
    id,
    displayName: id,
    material: 'PAPER',
    pack: { mode: 'generated', parentModel: 'item/generated', textures: [] },
    mechanics: {}
  }
}
