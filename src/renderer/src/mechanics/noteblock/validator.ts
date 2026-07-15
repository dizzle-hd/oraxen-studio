import type { ValidationContext } from '../../domain/types/mechanics/base'
import type { ValidationIssue } from '../../domain/types/validation'
import type { NoteblockData } from './schema'
import { validateVariationUniqueness } from '../variationUniqueness'

export function validateNoteblock(data: NoteblockData, ctx: ValidationContext): ValidationIssue[] {
  return validateVariationUniqueness('noteblock', data.customVariation, ctx)
}
