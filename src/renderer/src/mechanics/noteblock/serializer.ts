import type { NoteblockData } from './schema'

const KNOWN_KEYS = new Set(['custom_variation', 'hardness', 'light', 'is_falling', 'drop'])

export function noteblockToYaml(data: NoteblockData): unknown {
  const out: Record<string, unknown> = { ...(data.advanced ?? {}), custom_variation: data.customVariation }
  if (data.hardness !== undefined) out.hardness = data.hardness
  if (data.light !== undefined) out.light = data.light
  if (data.isFalling !== undefined) out.is_falling = data.isFalling
  if (data.dropSilktouch !== undefined) out.drop = { silktouch: data.dropSilktouch }
  return out
}

export function noteblockFromYaml(raw: unknown): NoteblockData {
  const obj = (raw ?? {}) as Record<string, unknown>
  const drop = obj.drop as Record<string, unknown> | undefined
  const advanced: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(obj)) {
    if (!KNOWN_KEYS.has(key)) advanced[key] = value
  }
  return {
    customVariation: typeof obj.custom_variation === 'number' ? obj.custom_variation : 2,
    hardness: typeof obj.hardness === 'number' ? obj.hardness : undefined,
    light: typeof obj.light === 'number' ? obj.light : undefined,
    isFalling: typeof obj.is_falling === 'boolean' ? obj.is_falling : undefined,
    dropSilktouch: typeof drop?.silktouch === 'boolean' ? drop.silktouch : undefined,
    advanced: Object.keys(advanced).length > 0 ? advanced : undefined
  }
}
