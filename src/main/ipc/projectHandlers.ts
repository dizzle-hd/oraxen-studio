import { ipcMain } from 'electron'
import fs from 'node:fs/promises'
import path from 'node:path'
import { IPC, type ImportedProjectFile, type ImportFolderResult } from '@shared/ipcContract'
import { allowAssetRoot } from '../protocols/assetProtocol'

const IGNORED_DIRS = new Set(['.git', 'node_modules', '.DS_Store'])

function classify(fileName: string): ImportedProjectFile['kind'] {
  const ext = path.extname(fileName).toLowerCase()
  if (ext === '.yml' || ext === '.yaml') return 'yaml'
  if (ext === '.json' || ext === '.mcmeta') return 'json'
  if (ext === '.png' || ext === '.jpg' || ext === '.jpeg') return 'image'
  return 'other'
}

async function walk(rootDir: string, dir: string, out: ImportedProjectFile[]): Promise<void> {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    if (IGNORED_DIRS.has(entry.name)) continue
    const absPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      await walk(rootDir, absPath, out)
    } else if (entry.isFile()) {
      out.push({
        relPath: path.relative(rootDir, absPath).split(path.sep).join('/'),
        absPath,
        kind: classify(entry.name)
      })
    }
  }
}

export function registerProjectHandlers(): void {
  ipcMain.handle(IPC.projectImportFolder, async (_event, rootDir: string): Promise<ImportFolderResult> => {
    allowAssetRoot(rootDir)
    const files: ImportedProjectFile[] = []
    await walk(rootDir, rootDir, files)
    return { rootDir, files }
  })
}
