import type { AssetReference } from './asset'
import type { OraxenItem } from './item'
import type { GlyphDefinition } from './glyph'
import type { RecipeDefinition } from './recipe'

export interface PackSettings {
  description: string
  format: number
  iconAsset?: AssetReference
  compression: 'none' | 'zip' | 'gzip'
  protectionEnabled: boolean
}

export function createDefaultPackSettings(): PackSettings {
  return {
    description: 'Generated with Oraxen Studio',
    format: 34,
    compression: 'zip',
    protectionEnabled: false
  }
}

export interface Project {
  id: string
  name: string
  rootDir: string
  minecraftVersion: string
  items: OraxenItem[]
  glyphs: GlyphDefinition[]
  recipes: RecipeDefinition[]
  assets: AssetReference[]
  packSettings: PackSettings
  meta: {
    createdAt: string
    updatedAt: string
    oraxenStudioVersion: string
  }
}

export function createEmptyProject(name: string, rootDir: string): Project {
  const now = new Date().toISOString()
  return {
    id: crypto.randomUUID(),
    name,
    rootDir,
    minecraftVersion: '1.21',
    items: [],
    glyphs: [],
    recipes: [],
    assets: [],
    packSettings: createDefaultPackSettings(),
    meta: { createdAt: now, updatedAt: now, oraxenStudioVersion: '0.1.0' }
  }
}
