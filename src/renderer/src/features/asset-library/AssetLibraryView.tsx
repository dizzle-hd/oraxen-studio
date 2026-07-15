import type { ReactElement } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Button, Group, Image, Paper, SimpleGrid, Stack, Text, Title } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { useProjectStore } from '../../state/projectStore'
import type { AssetKind, AssetReference } from '../../domain/types/asset'
import { basename, extname, joinPath } from './pathUtils'

function kindForExt(ext: string): AssetKind | null {
  if (ext === '.png' || ext === '.jpg' || ext === '.jpeg') return 'texture'
  if (ext === '.json') return 'model'
  return null
}

export function AssetLibraryView(): ReactElement {
  const { t } = useTranslation('common')
  const project = useProjectStore((s) => s.project)
  const addAssets = useProjectStore((s) => s.addAssets)

  async function handleImport(): Promise<void> {
    if (!project) return
    const result = await window.oraxenStudio.dialog.openFiles([
      { name: 'Oraxen Assets', extensions: ['png', 'jpg', 'jpeg', 'json'] }
    ])
    if (result.canceled) return

    const newAssets: AssetReference[] = []
    for (const sourcePath of result.paths) {
      const ext = extname(sourcePath)
      const kind = kindForExt(ext)
      if (!kind) continue

      const fileName = basename(sourcePath)
      const subDir = kind === 'texture' ? 'pack/textures' : 'pack/models'
      const destAbsPath = joinPath(project.rootDir, subDir, fileName)

      await window.oraxenStudio.fs.copyFile(sourcePath, destAbsPath)
      newAssets.push({ id: uuidv4(), kind, relPath: fileName, absPath: destAbsPath })
    }
    addAssets(newAssets)
  }

  if (!project) {
    return <Text c="dimmed">{t('project.noProject')}</Text>
  }

  return (
    <Stack gap="md">
      <Group justify="space-between">
        <Title order={3}>{t('assets.title')}</Title>
        <Button onClick={handleImport}>{t('assets.import')}</Button>
      </Group>

      {project.assets.length === 0 ? (
        <Text c="dimmed">{t('assets.noAssets')}</Text>
      ) : (
        <SimpleGrid cols={{ base: 3, sm: 4, md: 6 }} spacing="sm">
          {project.assets.map((asset) => (
            <Paper key={asset.id} withBorder p="xs" radius="md">
              {asset.kind === 'texture' ? (
                <Image src={window.oraxenStudio.assetUrl(asset.absPath)} alt={asset.relPath} h={64} fit="contain" />
              ) : (
                <Text ta="center" py="lg" size="xs" c="dimmed">
                  {t('assets.model')}
                </Text>
              )}
              <Text size="xs" mt={4} truncate>{asset.relPath}</Text>
            </Paper>
          ))}
        </SimpleGrid>
      )}
    </Stack>
  )
}
