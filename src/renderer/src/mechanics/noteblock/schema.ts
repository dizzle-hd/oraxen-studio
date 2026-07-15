import { z } from 'zod'

export const noteblockSchema = z.object({
  customVariation: z.number().int().min(1),
  hardness: z.number().optional(),
  light: z.number().int().min(0).max(15).optional(),
  isFalling: z.boolean().optional(),
  dropSilktouch: z.boolean().optional(),
  advanced: z.record(z.string(), z.unknown()).optional()
})

export type NoteblockData = z.infer<typeof noteblockSchema>

export function defaultNoteblock(): NoteblockData {
  return { customVariation: 2 }
}
