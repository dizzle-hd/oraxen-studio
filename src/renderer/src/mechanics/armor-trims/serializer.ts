import type { ArmorTrimsData } from './schema'

const KNOWN_KEYS = new Set(['base_armor_material', 'trim_material', 'trim_pattern'])

export function armorTrimsToYaml(data: ArmorTrimsData): unknown {
  const out: Record<string, unknown> = { ...(data.advanced ?? {}) }
  if (data.baseArmorMaterial) out.base_armor_material = data.baseArmorMaterial
  if (data.trimMaterial) out.trim_material = data.trimMaterial
  if (data.trimPattern) out.trim_pattern = data.trimPattern
  return out
}

export function armorTrimsFromYaml(raw: unknown): ArmorTrimsData {
  const obj = (raw ?? {}) as Record<string, unknown>
  const advanced: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(obj)) {
    if (!KNOWN_KEYS.has(key)) advanced[key] = value
  }
  return {
    baseArmorMaterial: typeof obj.base_armor_material === 'string' ? obj.base_armor_material : undefined,
    trimMaterial: typeof obj.trim_material === 'string' ? obj.trim_material : undefined,
    trimPattern: typeof obj.trim_pattern === 'string' ? obj.trim_pattern : undefined,
    advanced: Object.keys(advanced).length > 0 ? advanced : undefined
  }
}
