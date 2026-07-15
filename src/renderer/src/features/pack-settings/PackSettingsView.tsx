import type { ReactElement } from 'react'
import { Button, Group, Image, NumberInput, Select, Stack, Switch, Text, Textarea, Title } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { useProjectStore } from '../../state/projectStore'
import { basename, joinPath } from '../asset-library/pathUtils'

export function PackSettingsView(): ReactElement {
  const { t } = useTranslation('common')
  const project = useProjectStore((s) => s.project)

  if (!project) {
    return <Text c="dimmed">{t('project.noProject')}</Text>
  }

  const { packSettings } = project

  function update(updater: (draft: typeof packSettings) => void): void {
    useProjectStore.setState((state) => {
      if (!state.project) return
      updater(state.project.packSettings)
      state.project.meta.updatedAt = new Date().toISOString()
    })
  }

  async function handlePickIcon(): Promise<void> {
    if (!project) return
    const result = await window.oraxenStudio.dialog.openFiles([{ name: 'PNG', extensions: ['png'] }])
    if (result.canceled || result.paths.length === 0) return
    const source = result.paths[0]
    const destAbsPath = joinPath(project.rootDir, 'pack', 'pack.png')
    await window.oraxenStudio.fs.copyFile(source, destAbsPath)
    update((draft) => {
      draft.iconAsset = { id: 'pack-icon', kind: 'other', relPath: 'pack.png', absPath: destAbsPath }
    })
  }

  return (
    <Stack gap="md" maw={520}>
      <Title order={3}>{t('nav.packSettings')}</Title>

      <Textarea
        label="pack.mcmeta description"
        value={packSettings.description}
        onChange={(e) => update((draft) => { draft.description = e.currentTarget.value })}
      />

      <NumberInput
        label="pack.mcmeta format"
        value={packSettings.format}
        onChange={(v) => update((draft) => { draft.format = typeof v === 'number' ? v : draft.format })}
      />

      <Select
        label="Compression"
        data={['none', 'zip', 'gzip']}
        value={packSettings.compression}
        onChange={(v) => v && update((draft) => { draft.compression = v as typeof draft.compression })}
      />

      <Switch
        label="Protection (Obfuskierung)"
        checked={packSettings.protectionEnabled}
        onChange={(e) => update((draft) => { draft.protectionEnabled = e.currentTarget.checked })}
      />

      <Group>
        <Button variant="light" onClick={handlePickIcon}>pack.png wählen</Button>
        {packSettings.iconAsset && (
          <>
            <Image src={window.oraxenStudio.assetUrl(packSettings.iconAsset.absPath)} w={48} h={48} fit="contain" />
            <Text size="sm" c="dimmed">{basename(packSettings.iconAsset.absPath)}</Text>
          </>
        )}
      </Group>
    </Stack>
  )
}
