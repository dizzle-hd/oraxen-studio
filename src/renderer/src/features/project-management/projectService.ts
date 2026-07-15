import { v4 as uuidv4 } from 'uuid'
import type { ImportedProjectFile } from '@shared/ipcContract'
import { itemFromYamlString } from '../../domain/yaml/itemSerializer'
import { createEmptyProject } from '../../domain/types/project'
import type { Project } from '../../domain/types/project'
import type { AssetReference, AssetKind } from '../../domain/types/asset'
import type { OraxenItem } from '../../domain/types/item'

function stripPrefix(relPath: string, prefix: string): string | null {
  return relPath.startsWith(prefix) ? relPath.slice(prefix.length) : null
}

function assetFromFile(file: ImportedProjectFile, kind: AssetKind, relPath: string): AssetReference {
  return { id: uuidv4(), kind, relPath, absPath: file.absPath }
}

/** Builds a Project by importing an existing `plugins/Oraxen`-shaped folder from disk. */
export async function importProjectFromFolder(rootDir: string, projectName: string): Promise<Project> {
  const { files } = await window.oraxenStudio.project.importFolder(rootDir)
  const project = createEmptyProject(projectName, rootDir)

  const assets: AssetReference[] = []
  const items: OraxenItem[] = []

  for (const file of files) {
    const texturePath = stripPrefix(file.relPath, 'pack/textures/')
    const modelPath = stripPrefix(file.relPath, 'pack/models/')
    const itemYamlPath = stripPrefix(file.relPath, 'items/')

    if (file.kind === 'image' && texturePath) {
      assets.push(assetFromFile(file, 'texture', texturePath))
      continue
    }
    if (file.kind === 'json' && modelPath) {
      assets.push(assetFromFile(file, 'model', modelPath))
      continue
    }
    if (file.kind === 'yaml' && itemYamlPath) {
      try {
        const text = await window.oraxenStudio.fs.readTextFile(file.absPath)
        items.push(itemFromYamlString(text))
      } catch (error) {
        console.warn(`Konnte Item-Datei nicht lesen: ${file.relPath}`, error)
      }
      continue
    }
    if (file.relPath === 'pack/pack.png') {
      project.packSettings.iconAsset = assetFromFile(file, 'other', 'pack.png')
    }
  }

  project.assets = assets
  project.items = items
  return project
}
