import { describe, expect, it } from 'vitest'
import '@renderer/mechanics/registerAll'
import { buildExportManifest } from '@renderer/features/export/buildExportManifest'
import { createEmptyProject } from '@renderer/domain/types/project'
import { createEmptyItem } from '@renderer/domain/types/item'

describe('buildExportManifest', () => {
  it('emits one yml entry per item and copyFile entries for assets', () => {
    const project = createEmptyProject('Test', '/tmp/test')
    project.items.push(createEmptyItem('sword'))
    project.assets.push({ id: 'a1', kind: 'texture', relPath: 'sword.png', absPath: '/tmp/test/sword.png' })

    const manifest = buildExportManifest(project)

    expect(manifest).toContainEqual(
      expect.objectContaining({ relPath: 'items/sword.yml', kind: 'writeText' })
    )
    expect(manifest).toContainEqual({
      relPath: 'pack/textures/sword.png',
      kind: 'copyFile',
      sourceAbsPath: '/tmp/test/sword.png'
    })
    expect(manifest).toContainEqual(
      expect.objectContaining({ relPath: 'pack/pack.mcmeta', kind: 'writeText' })
    )
  })
})
