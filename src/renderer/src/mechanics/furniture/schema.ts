import { z } from 'zod'

export const furnitureSchema = z.object({
  type: z.enum(['ITEM_FRAME', 'DISPLAY_ENTITY', 'GLOWING_ITEM_FRAME']),
  barrier: z.boolean().optional(),
  rotatable: z.boolean().optional(),
  restrictedRotation: z.enum(['NONE', 'STRICT', 'VERY_STRICT']).optional(),
  light: z.number().int().min(0).max(15).optional(),
  seatHeight: z.number().optional(),
  seatYaw: z.number().optional(),
  storageEnabled: z.boolean().optional(),
  storageRows: z.number().int().min(1).max(6).optional(),
  storageTitle: z.string().optional(),
  dropSilktouch: z.boolean().optional(),
  /** Passthrough for deeper subsections (block_sounds, limited_placing, blocklocker, jukebox, ...)
   *  not yet modeled as dedicated form fields - keeps round-trip safe when importing existing packs. */
  advanced: z.record(z.string(), z.unknown()).optional()
})

export type FurnitureData = z.infer<typeof furnitureSchema>

export function defaultFurniture(): FurnitureData {
  return { type: 'DISPLAY_ENTITY', rotatable: true }
}
