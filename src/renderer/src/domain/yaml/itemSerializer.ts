import { Document, parseDocument, YAMLMap } from 'yaml'
import type { OraxenItem, PackSection } from '../types/item'
import type { AssetReference } from '../types/asset'
import { MechanicRegistry } from '../../mechanics/registry'

function textureRef(relPath: string): AssetReference {
  return { id: relPath, kind: 'texture', absPath: '', relPath }
}

function modelRef(relPath: string): AssetReference {
  return { id: relPath, kind: 'model', absPath: '', relPath }
}

function packSectionToYaml(pack: PackSection): Record<string, unknown> {
  if (pack.mode === 'none') return {}

  if (pack.mode === 'custom_model') {
    const out: Record<string, unknown> = { generate_model: false }
    if (pack.customModel) out.model = pack.customModel.relPath
    if (pack.blockingModel) out.blocking_model = pack.blockingModel.relPath
    return out
  }

  const out: Record<string, unknown> = { generate_model: true }
  if (pack.parentModel) out.parent_model = pack.parentModel
  if (pack.namedTextures && Object.keys(pack.namedTextures).length > 0) {
    out.textures = Object.fromEntries(
      Object.entries(pack.namedTextures).map(([slot, asset]) => [slot, asset.relPath])
    )
  } else if (pack.textures && pack.textures.length > 0) {
    out.textures = pack.textures.map((t) => t.relPath)
  }
  return out
}

function packSectionFromYaml(raw: unknown): PackSection {
  if (raw === undefined || raw === null || typeof raw !== 'object') {
    return { mode: 'none' }
  }
  const obj = raw as Record<string, unknown>

  if (obj.generate_model === false) {
    return {
      mode: 'custom_model',
      customModel: typeof obj.model === 'string' ? modelRef(obj.model) : undefined,
      blockingModel: typeof obj.blocking_model === 'string' ? modelRef(obj.blocking_model) : undefined
    }
  }

  const parentModel = typeof obj.parent_model === 'string' ? obj.parent_model : undefined
  if (Array.isArray(obj.textures)) {
    return {
      mode: 'generated',
      parentModel,
      textures: obj.textures.filter((t): t is string => typeof t === 'string').map(textureRef)
    }
  }
  if (obj.textures && typeof obj.textures === 'object') {
    const named: Record<string, AssetReference> = {}
    for (const [slot, value] of Object.entries(obj.textures as Record<string, unknown>)) {
      if (typeof value === 'string') named[slot] = textureRef(value)
    }
    return { mode: 'generated', parentModel, namedTextures: named }
  }
  return { mode: 'generated', parentModel, textures: [] }
}

function mechanicsToYaml(item: OraxenItem): Record<string, unknown> | undefined {
  const entries = Object.entries(item.mechanics).filter(([, data]) => data !== undefined)
  if (entries.length === 0) return undefined

  const out: Record<string, unknown> = {}
  for (const [mechanicId, data] of entries) {
    const def = MechanicRegistry.get(mechanicId)
    if (!def) continue
    out[def.yamlKey] = def.toYaml(data)
  }
  return out
}

function mechanicsFromYaml(raw: unknown): OraxenItem['mechanics'] {
  const mechanics: OraxenItem['mechanics'] = {}
  if (!raw || typeof raw !== 'object') return mechanics

  const byYamlKey = new Map(MechanicRegistry.list().map((def) => [def.yamlKey, def]))
  for (const [yamlKey, value] of Object.entries(raw as Record<string, unknown>)) {
    const def = byYamlKey.get(yamlKey)
    if (def) {
      mechanics[def.id] = def.fromYaml(value)
    }
  }
  return mechanics
}

/**
 * Serializes a single OraxenItem to a YAML string. When `existingDocument`
 * is provided (round-trip editing of an imported/previously-exported
 * file), fields are patched in place via `setIn` so comments, key order
 * and blank lines the user hasn't touched survive untouched.
 */
export function itemToYamlString(item: OraxenItem, existingDocument?: Document): string {
  const doc = existingDocument ?? new Document({})
  if (!(doc.contents instanceof YAMLMap)) {
    doc.contents = doc.createNode({})
  }

  const root = new YAMLMap()
  doc.set(item.id, root)

  doc.setIn([item.id, 'displayname'], item.displayName)
  doc.setIn([item.id, 'material'], item.material)
  if (item.permission) {
    doc.setIn([item.id, 'permission'], item.permission)
  }

  const packYaml = packSectionToYaml(item.pack)
  if (Object.keys(packYaml).length > 0) {
    doc.setIn([item.id, 'Pack'], packYaml)
  }

  const mechanicsYaml = mechanicsToYaml(item)
  if (mechanicsYaml) {
    doc.setIn([item.id, 'Mechanics'], mechanicsYaml)
  }

  if (item.extra) {
    for (const [key, value] of Object.entries(item.extra)) {
      doc.setIn([item.id, key], value)
    }
  }

  return doc.toString()
}

/** Parses a `<item_id>.yml` file (single root key = item id) back into an OraxenItem. */
export function itemFromYamlString(yamlText: string): OraxenItem {
  const doc = parseDocument(yamlText)
  if (!(doc.contents instanceof YAMLMap) || doc.contents.items.length === 0) {
    throw new Error('Item-YAML muss genau einen Wurzel-Schlüssel (die Item-ID) enthalten')
  }

  const rootObj = doc.toJS() as Record<string, unknown>
  const id = Object.keys(rootObj)[0]
  const body = (rootObj[id] ?? {}) as Record<string, unknown>

  const knownKeys = new Set(['displayname', 'material', 'permission', 'Pack', 'Mechanics'])
  const extra: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(body)) {
    if (!knownKeys.has(key)) extra[key] = value
  }

  return {
    id,
    displayName: typeof body.displayname === 'string' ? body.displayname : id,
    material: typeof body.material === 'string' ? body.material : 'PAPER',
    permission: typeof body.permission === 'string' ? body.permission : undefined,
    pack: packSectionFromYaml(body.Pack),
    mechanics: mechanicsFromYaml(body.Mechanics),
    extra: Object.keys(extra).length > 0 ? extra : undefined
  }
}
