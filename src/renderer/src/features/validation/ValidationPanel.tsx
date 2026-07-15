import type { ReactElement } from 'react'
import { useMemo } from 'react'
import { Alert, Stack, Text, Title } from '@mantine/core'
import { IconAlertTriangle, IconCircleCheck, IconInfoCircle } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { useProjectStore } from '../../state/projectStore'
import { runValidation } from '../../domain/validation/runValidation'
import type { ValidationIssue } from '../../domain/types/validation'

export function useProjectValidation(): ValidationIssue[] {
  const project = useProjectStore((s) => s.project)
  return useMemo(() => (project ? runValidation(project) : []), [project])
}

const ICONS = { error: IconAlertTriangle, warning: IconAlertTriangle, info: IconInfoCircle }
const COLORS = { error: 'red', warning: 'yellow', info: 'blue' }

export function ValidationPanel(): ReactElement {
  const { t } = useTranslation('common')
  const { t: tValidation } = useTranslation('validation')
  const project = useProjectStore((s) => s.project)
  const issues = useProjectValidation()

  if (!project) {
    return <Text c="dimmed">{t('project.noProject')}</Text>
  }

  return (
    <Stack gap="sm" maw={720}>
      <Title order={3}>{t('nav.validation')}</Title>
      {issues.length === 0 && (
        <Alert color="green" icon={<IconCircleCheck size={18} />}>
          Keine Probleme gefunden
        </Alert>
      )}
      {issues.map((issue) => {
        const Icon = ICONS[issue.severity]
        return (
          <Alert key={issue.id} color={COLORS[issue.severity]} icon={<Icon size={18} />}>
            {tValidation(issue.messageKey, issue.messageParams)}
          </Alert>
        )
      })}
    </Stack>
  )
}
