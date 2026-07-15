import type { ValidationContext } from '../../domain/types/mechanics/base'
import type { ValidationIssue } from '../../domain/types/validation'
import type { DurabilityData } from './schema'

export function validateDurability(data: DurabilityData, ctx: ValidationContext): ValidationIssue[] {
  const issues: ValidationIssue[] = []
  if (data.value <= 0) {
    issues.push({
      id: `${ctx.itemId}:durability:value`,
      severity: 'error',
      messageKey: 'durability.valueMustBePositive',
      targetType: 'item',
      targetId: ctx.itemId,
      path: ['mechanics', 'durability', 'value']
    })
  }
  return issues
}
