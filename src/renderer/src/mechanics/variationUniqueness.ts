import type { ValidationContext } from '../domain/types/mechanics/base'
import type { ValidationIssue } from '../domain/types/validation'
import { MechanicRegistry } from './registry'

/**
 * `custom_variation` must be unique across all items sharing a
 * `variationNamespace` (noteblock and stringblock share one pool in
 * vanilla Oraxen). Checks the calling item's value against every other
 * item's value for every mechanic registered under the same namespace.
 */
export function validateVariationUniqueness(
  mechanicId: string,
  customVariation: number,
  ctx: ValidationContext
): ValidationIssue[] {
  const def = MechanicRegistry.get(mechanicId)
  const namespace = def?.variationNamespace ?? mechanicId
  const sameNamespaceMechanicIds = MechanicRegistry.list()
    .filter((m) => (m.variationNamespace ?? m.id) === namespace)
    .map((m) => m.id)

  for (const otherMechanicId of sameNamespaceMechanicIds) {
    const entries = ctx.allItemsByMechanic.get(otherMechanicId) ?? []
    for (const entry of entries) {
      if (entry.itemId === ctx.itemId) continue
      const otherVariation = (entry.data as { customVariation?: number }).customVariation
      if (otherVariation === customVariation) {
        return [
          {
            id: `${ctx.itemId}:${mechanicId}:custom_variation`,
            severity: 'error',
            messageKey: 'customVariationDuplicate',
            messageParams: { otherItemId: entry.itemId, value: customVariation },
            targetType: 'item',
            targetId: ctx.itemId,
            path: ['mechanics', mechanicId, 'customVariation']
          }
        ]
      }
    }
  }
  return []
}
