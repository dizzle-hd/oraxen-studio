import { z } from 'zod'

/** TRIMS-based custom armor (Minecraft 1.20-1.21.1). See note in armor-components/schema.ts. */
export const armorTrimsSchema = z.object({
  baseArmorMaterial: z.string().optional(),
  trimMaterial: z.string().optional(),
  trimPattern: z.string().optional(),
  advanced: z.record(z.string(), z.unknown()).optional()
})

export type ArmorTrimsData = z.infer<typeof armorTrimsSchema>

export function defaultArmorTrims(): ArmorTrimsData {
  return { baseArmorMaterial: 'CHAINMAIL' }
}
