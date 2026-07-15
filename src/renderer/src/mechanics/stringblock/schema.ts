import { z } from 'zod'

export const stringblockSchema = z.object({
  customVariation: z.number().int().min(1),
  hardness: z.number().optional(),
  dropSilktouch: z.boolean().optional(),
  advanced: z.record(z.string(), z.unknown()).optional()
})

export type StringblockData = z.infer<typeof stringblockSchema>

export function defaultStringblock(): StringblockData {
  return { customVariation: 2 }
}
