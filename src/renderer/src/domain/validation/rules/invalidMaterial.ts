import type { Project } from '../../types/project'
import type { ValidationIssue } from '../../types/validation'
import { isValidMaterial } from '../../minecraft/materials'

export function checkInvalidMaterial(project: Project): ValidationIssue[] {
  const issues: ValidationIssue[] = []
  for (const item of project.items) {
    if (!item.material || !isValidMaterial(item.material, project.minecraftVersion)) {
      issues.push({
        id: `invalid-material:${item.id}`,
        severity: 'warning',
        messageKey: 'invalidMaterial',
        messageParams: { material: item.material },
        targetType: 'item',
        targetId: item.id,
        path: ['material']
      })
    }
  }
  return issues
}
