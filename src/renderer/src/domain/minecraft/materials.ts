import materials121 from './data/materials-1.21.json'

/**
 * Curated subset of vanilla Minecraft material names for autocomplete and
 * validation. Not exhaustive (the full Bukkit Material enum has 1000+
 * entries) - covers the materials commonly used as Oraxen item bases.
 * Extend `data/materials-1.21.json` as needed; keyed by Minecraft version
 * so future versions can add their own list without breaking older projects.
 */
const MATERIAL_LISTS: Record<string, string[]> = {
  '1.21': materials121 as string[]
}

export function getMaterialsForVersion(version: string): string[] {
  return MATERIAL_LISTS[version] ?? MATERIAL_LISTS['1.21']
}

export function isValidMaterial(name: string, version: string): boolean {
  return getMaterialsForVersion(version).includes(name.toUpperCase())
}
