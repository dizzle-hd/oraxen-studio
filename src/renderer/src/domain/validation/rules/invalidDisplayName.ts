import type { Project } from '../../types/project'
import type { ValidationIssue } from '../../types/validation'
import { validateDisplayName } from '../../minecraft/miniMessage'

export function checkInvalidDisplayName(project: Project): ValidationIssue[] {
  const issues: ValidationIssue[] = []
  for (const item of project.items) {
    const problems = validateDisplayName(item.displayName)
    for (const problem of problems) {
      issues.push({
        id: `invalid-displayname:${item.id}:${problem.index}`,
        severity: 'warning',
        messageKey: 'invalidDisplayName',
        messageParams: { message: problem.message },
        targetType: 'item',
        targetId: item.id,
        path: ['displayName']
      })
    }
  }
  return issues
}
