import type { ArmorComponentsData } from './schema'

const KNOWN_KEYS = new Set(['color', 'trim_material', 'trim_pattern'])

export function armorComponentsToYaml(data: ArmorComponentsData): unknown {
  const out: Record<string, unknown> = { ...(data.advanced ?? {}) }
  if (data.color) out.color = data.color
  if (data.trimMaterial) out.trim_material = data.trimMaterial
  if (data.trimPattern) out.trim_pattern = data.trimPattern
  return out
}

export function armorComponentsFromYaml(raw: unknown): ArmorComponentsData {
  const obj = (raw ?? {}) as Record<string, unknown>
  const advanced: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(obj)) {
    if (!KNOWN_KEYS.has(key)) advanced[key] = value
  }
  return {
    color: typeof obj.color === 'string' ? obj.color : undefined,
    trimMaterial: typeof obj.trim_material === 'string' ? obj.trim_material : undefined,
    trimPattern: typeof obj.trim_pattern === 'string' ? obj.trim_pattern : undefined,
    advanced: Object.keys(advanced).length > 0 ? advanced : undefined
  }
}
