export type ValidationSeverity = 'error' | 'warning' | 'info'

export type ValidationTargetType = 'item' | 'glyph' | 'recipe' | 'pack' | 'asset'

export interface ValidationIssue {
  id: string
  severity: ValidationSeverity
  messageKey: string
  messageParams?: Record<string, unknown>
  targetType: ValidationTargetType
  targetId?: string
  path?: string[]
}
