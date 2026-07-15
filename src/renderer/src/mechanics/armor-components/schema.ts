import { z } from 'zod'

/**
 * COMPONENTS-based custom armor (Oraxen 1.21.2+, the recommended approach
 * per current docs). Field set covers the common case (a dyeable-leather
 * style layered texture with an optional trim); anything beyond that goes
 * through `advanced` so importing a hand-written config never loses data.
 * NOTE: exact YAML keys should be re-verified against docs.oraxen.com
 * before relying on this in production - the public docs did not expose a
 * full field reference at the time this was written.
 */
export const armorComponentsSchema = z.object({
  color: z.string().optional(),
  trimMaterial: z.string().optional(),
  trimPattern: z.string().optional(),
  advanced: z.record(z.string(), z.unknown()).optional()
})

export type ArmorComponentsData = z.infer<typeof armorComponentsSchema>

export function defaultArmorComponents(): ArmorComponentsData {
  return {}
}
