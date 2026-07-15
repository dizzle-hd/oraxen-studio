import type { DurabilityData } from './schema'

export function durabilityToYaml(data: DurabilityData): unknown {
  const out: Record<string, unknown> = { value: data.value }
  if (data.itemDamageOnHit !== undefined) out.item_damage_on_hit = data.itemDamageOnHit
  if (data.itemDamageOnBlockBreak !== undefined) out.item_damage_on_block_break = data.itemDamageOnBlockBreak
  if (data.removeUnbreakable !== undefined) out.remove_unbreakable = data.removeUnbreakable
  return out
}

export function durabilityFromYaml(raw: unknown): DurabilityData {
  const obj = (raw ?? {}) as Record<string, unknown>
  return {
    value: typeof obj.value === 'number' ? obj.value : 1000,
    itemDamageOnHit: typeof obj.item_damage_on_hit === 'number' ? obj.item_damage_on_hit : undefined,
    itemDamageOnBlockBreak:
      typeof obj.item_damage_on_block_break === 'number' ? obj.item_damage_on_block_break : undefined,
    removeUnbreakable: typeof obj.remove_unbreakable === 'boolean' ? obj.remove_unbreakable : undefined
  }
}
