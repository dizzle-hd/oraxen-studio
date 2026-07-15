import type { ReactElement } from 'react'
import { useState } from 'react'
import { Alert, Button, Group, Progress, Stack, Text, Title } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useTranslation } from 'react-i18next'
import { useProjectStore } from '../../state/projectStore'
import { useProjectValidation } from '../validation/ValidationPanel'
import { buildExportManifest } from './buildExportManifest'
import { joinPath } from '../asset-library/pathUtils'

export function ExportView(): ReactElement {
  const { t } = useTranslation('common')
  const project = useProjectStore((s) => s.project)
  const issues = useProjectValidation()
  const errorCount = issues.filter((i) => i.severity === 'error').length

  const [allowExportAnyway, setAllowExportAnyway] = useState(false)
  const [progress, setProgress] = useState<{ written: number; total: number } | null>(null)

  if (!project) {
    return <Text c="dimmed">{t('project.noProject')}</Text>
  }

  const blocked = errorCount > 0 && !allowExportAnyway

  async function runExport(kind: 'folder' | 'zip'): Promise<void> {
    if (!project) return
    const manifest = buildExportManifest(project)
    setProgress({ written: 0, total: manifest.length })
    const unsubscribe = window.oraxenStudio.export.onProgress((written, total) =>
      setProgress({ written, total })
    )

    try {
      if (kind === 'folder') {
        const dir = await window.oraxenStudio.dialog.openDirectory()
        if (dir.canceled || !dir.path) return
        const result = await window.oraxenStudio.export.toFolder({ manifest, targetDir: dir.path })
        if (!result.success) throw new Error(result.error)
        notifications.show({ message: t('export.success', { count: result.writtenFiles }), color: 'green' })
      } else {
        const saveResult = await window.oraxenStudio.dialog.saveFile({
          defaultPath: joinPath(project.rootDir, `${project.name}.zip`),
          filters: [{ name: 'ZIP', extensions: ['zip'] }]
        })
        if (saveResult.canceled || !saveResult.path) return
        const result = await window.oraxenStudio.export.toZip({ manifest, targetZipPath: saveResult.path })
        if (!result.success) throw new Error(result.error)
        notifications.show({ message: t('export.success', { count: result.writtenFiles }), color: 'green' })
      }
    } catch (error) {
      notifications.show({ message: t('export.error', { error: String(error) }), color: 'red' })
    } finally {
      unsubscribe()
      setProgress(null)
    }
  }

  return (
    <Stack gap="md" maw={520}>
      <Title order={3}>{t('export.title')}</Title>

      {errorCount > 0 && (
        <Alert color="red" title={t('export.blockedByErrors')}>
          {errorCount} Fehler in der Validierung
        </Alert>
      )}

      {progress && (
        <Progress value={(progress.written / Math.max(progress.total, 1)) * 100} animated />
      )}

      <Group>
        <Button disabled={blocked} onClick={() => runExport('folder')}>
          {t('export.exportFolder')}
        </Button>
        <Button disabled={blocked} variant="light" onClick={() => runExport('zip')}>
          {t('export.exportZip')}
        </Button>
      </Group>

      {errorCount > 0 && !allowExportAnyway && (
        <Button variant="subtle" color="red" size="xs" onClick={() => setAllowExportAnyway(true)}>
          {t('export.exportAnyway')}
        </Button>
      )}
    </Stack>
  )
}
