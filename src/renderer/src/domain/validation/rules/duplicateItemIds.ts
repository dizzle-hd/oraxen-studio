import type { Project } from '../../types/project'
import type { ValidationIssue } from '../../types/validation'

export function checkDuplicateItemIds(project: Project): ValidationIssue[] {
  const seen = new Map<string, number>()
  for (const item of project.items) {
    seen.set(item.id, (seen.get(item.id) ?? 0) + 1)
  }

  const issues: ValidationIssue[] = []
  for (const [id, count] of seen) {
    if (count > 1) {
      issues.push({
        id: `duplicate-item-id:${id}`,
        severity: 'error',
        messageKey: 'duplicateItemId',
        messageParams: { id },
        targetType: 'item',
        targetId: id
      })
    }
  }
  return issues
}
