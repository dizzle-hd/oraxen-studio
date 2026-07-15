import type { ReactElement } from 'react'
import { useState } from 'react'
import { Button, Group, Select, Stack, Text, TextInput, Title } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useTranslation } from 'react-i18next'
import { useProjectStore, createEmptyProject } from '../../state/projectStore'
import { importProjectFromFolder } from './projectService'
import { getMaterialsForVersion } from '../../domain/minecraft/materials'

export function ProjectView(): ReactElement {
  const { t } = useTranslation('common')
  const project = useProjectStore((s) => s.project)
  const setProject = useProjectStore((s) => s.setProject)

  const [newProjectName, setNewProjectName] = useState('Mein Oraxen Pack')
  const [newProjectDir, setNewProjectDir] = useState<string | null>(null)
  const [importing, setImporting] = useState(false)

  async function pickFolder(): Promise<string | undefined> {
    const result = await window.oraxenStudio.dialog.openDirectory()
    return result.canceled ? undefined : result.path
  }

  async function handleCreateNewProject(): Promise<void> {
    const dir = newProjectDir ?? (await pickFolder())
    if (!dir) return
    // Registers `dir` as an allowed asset:// root, even though there's nothing to import yet.
    await window.oraxenStudio.project.importFolder(dir)
    setProject(createEmptyProject(newProjectName, dir))
  }

  async function handleImportExisting(): Promise<void> {
    const dir = await pickFolder()
    if (!dir) return
    setImporting(true)
    try {
      const imported = await importProjectFromFolder(dir, dir.split(/[\\/]/).pop() ?? 'Oraxen Pack')
      setProject(imported)
      notifications.show({
        message: t('project.importedFilesCount', { count: imported.items.length + imported.assets.length }),
        color: 'green'
      })
    } catch (error) {
      notifications.show({ message: String(error), color: 'red' })
    } finally {
      setImporting(false)
    }
  }

  return (
    <Stack gap="xl" maw={640}>
      <div>
        <Title order={3}>{t('project.newProject')}</Title>
        <Stack gap="sm" mt="sm">
          <TextInput
            label={t('project.name')}
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.currentTarget.value)}
          />
          <Group align="end">
            <Button
              variant="light"
              onClick={async () => setNewProjectDir((await pickFolder()) ?? null)}
            >
              {t('project.chooseFolder')}
            </Button>
            {newProjectDir && <Text size="sm" c="dimmed">{newProjectDir}</Text>}
          </Group>
          <Button onClick={handleCreateNewProject}>{t('project.createButton')}</Button>
        </Stack>
      </div>

      <div>
        <Title order={3}>{t('project.openProject')}</Title>
        <Text size="sm" c="dimmed" mt={4}>
          {t('project.noProjectHint')}
        </Text>
        <Button mt="sm" variant="outline" loading={importing} onClick={handleImportExisting}>
          {t('project.importButton')}
        </Button>
      </div>

      {project && (
        <div>
          <Title order={4}>{project.name}</Title>
          <Text size="sm" c="dimmed">{project.rootDir}</Text>
          <Select
            mt="sm"
            label={t('project.minecraftVersion')}
            data={['1.21']}
            value={project.minecraftVersion}
            onChange={(v) => {
              if (!v) return
              useProjectStore.setState((state) => {
                if (state.project) state.project.minecraftVersion = v
              })
            }}
          />
          <Text size="xs" c="dimmed" mt={4}>
            {getMaterialsForVersion(project.minecraftVersion).length} Materialien bekannt
          </Text>
        </div>
      )}
    </Stack>
  )
}
