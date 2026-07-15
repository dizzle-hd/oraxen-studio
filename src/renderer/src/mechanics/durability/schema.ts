import { z } from 'zod'

export const durabilitySchema = z.object({
  value: z.number().int().positive(),
  itemDamageOnHit: z.number().optional(),
  itemDamageOnBlockBreak: z.number().optional(),
  removeUnbreakable: z.boolean().optional()
})

export type DurabilityData = z.infer<typeof durabilitySchema>

export function defaultDurability(): DurabilityData {
  return { value: 1000 }
}
