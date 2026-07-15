import type { ExportManifestEntry } from '@shared/ipcContract'
import type { Project } from '../../domain/types/project'
import { itemToYamlString } from '../../domain/yaml/itemSerializer'

/**
 * Builds the full `plugins/Oraxen`-shaped file manifest from project state.
 * Folder-export and zip-export both consume this same manifest so they
 * can never drift apart.
 */
export function buildExportManifest(project: Project): ExportManifestEntry[] {
  const entries: ExportManifestEntry[] = []

  for (const item of project.items) {
    entries.push({ relPath: `items/${item.id}.yml`, kind: 'writeText', content: itemToYamlString(item) })
  }

  for (const asset of project.assets) {
    if (!asset.absPath) continue
    const subDir = asset.kind === 'texture' ? 'pack/textures' : asset.kind === 'model' ? 'pack/models' : null
    if (!subDir) continue
    entries.push({ relPath: `${subDir}/${asset.relPath}`, kind: 'copyFile', sourceAbsPath: asset.absPath })
  }

  const mcmeta = {
    pack: {
      pack_format: project.packSettings.format,
      description: project.packSettings.description
    }
  }
  entries.push({ relPath: 'pack/pack.mcmeta', kind: 'writeText', content: JSON.stringify(mcmeta, null, 2) })

  if (project.packSettings.iconAsset?.absPath) {
    entries.push({ relPath: 'pack/pack.png', kind: 'copyFile', sourceAbsPath: project.packSettings.iconAsset.absPath })
  }

  return entries
}
