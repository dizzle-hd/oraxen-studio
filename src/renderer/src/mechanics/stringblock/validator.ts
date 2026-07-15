import type { ValidationContext } from '../../domain/types/mechanics/base'
import type { ValidationIssue } from '../../domain/types/validation'
import type { StringblockData } from './schema'
import { validateVariationUniqueness } from '../variationUniqueness'

export function validateStringblock(data: StringblockData, ctx: ValidationContext): ValidationIssue[] {
  return validateVariationUniqueness('stringblock', data.customVariation, ctx)
}
