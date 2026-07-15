import type { Project } from '../types/project'
import type { ValidationIssue } from '../types/validation'
import { checkDuplicateItemIds } from './rules/duplicateItemIds'
import { checkMissingAssetReferences } from './rules/missingAssetReferences'
import { checkInvalidMaterial } from './rules/invalidMaterial'
import { checkInvalidDisplayName } from './rules/invalidDisplayName'
import { MechanicRegistry } from '../../mechanics/registry'
import type { MechanicId } from '../types/mechanics/base'

const PROJECT_LEVEL_RULES = [
  checkDuplicateItemIds,
  checkMissingAssetReferences,
  checkInvalidMaterial,
  checkInvalidDisplayName
]

function runMechanicValidators(project: Project): ValidationIssue[] {
  const allItemsByMechanic = new Map<MechanicId, { itemId: string; data: unknown }[]>()
  for (const item of project.items) {
    for (const [mechanicId, data] of Object.entries(item.mechanics)) {
      const list = allItemsByMechanic.get(mechanicId) ?? []
      list.push({ itemId: item.id, data })
      allItemsByMechanic.set(mechanicId, list)
    }
  }

  const issues: ValidationIssue[] = []
  for (const item of project.items) {
    for (const [mechanicId, data] of Object.entries(item.mechanics)) {
      const def = MechanicRegistry.get(mechanicId)
      if (!def) continue
      issues.push(...def.validate(data, { itemId: item.id, allItemsByMechanic }))
    }
  }
  return issues
}

export function runValidation(project: Project): ValidationIssue[] {
  const issues: ValidationIssue[] = []
  for (const rule of PROJECT_LEVEL_RULES) {
    issues.push(...rule(project))
  }
  issues.push(...runMechanicValidators(project))
  return issues
}
