import { ipcMain } from 'electron'
import fs from 'node:fs'
import fsp from 'node:fs/promises'
import path from 'node:path'
import archiver from 'archiver'
import {
  IPC,
  type ExportManifestEntry,
  type ExportResult,
  type ExportToFolderRequest,
  type ExportToZipRequest
} from '@shared/ipcContract'

function reportProgress(sender: Electron.WebContents, written: number, total: number): void {
  sender.send('export:progress', written, total)
}

async function exportToFolder(
  manifest: ExportManifestEntry[],
  targetDir: string,
  sender: Electron.WebContents
): Promise<ExportResult> {
  let written = 0
  for (const entry of manifest) {
    const destPath = path.join(targetDir, ...entry.relPath.split('/'))
    await fsp.mkdir(path.dirname(destPath), { recursive: true })
    if (entry.kind === 'copyFile') {
      await fsp.copyFile(entry.sourceAbsPath, destPath)
    } else {
      await fsp.writeFile(destPath, entry.content, 'utf-8')
    }
    written += 1
    reportProgress(sender, written, manifest.length)
  }
  return { success: true, writtenFiles: written }
}

async function exportToZip(
  manifest: ExportManifestEntry[],
  targetZipPath: string,
  sender: Electron.WebContents
): Promise<ExportResult> {
  await fsp.mkdir(path.dirname(targetZipPath), { recursive: true })

  return new Promise<ExportResult>((resolve, reject) => {
    const output = fs.createWriteStream(targetZipPath)
    const archive = archiver('zip', { zlib: { level: 9 } })
    let written = 0

    output.on('close', () => resolve({ success: true, writtenFiles: written }))
    archive.on('error', (err) => reject(err))
    archive.on('entry', () => {
      written += 1
      reportProgress(sender, written, manifest.length)
    })

    archive.pipe(output)
    for (const entry of manifest) {
      if (entry.kind === 'copyFile') {
        archive.file(entry.sourceAbsPath, { name: entry.relPath })
      } else {
        archive.append(entry.content, { name: entry.relPath })
      }
    }
    archive.finalize()
  })
}

export function registerExportHandlers(): void {
  ipcMain.handle(IPC.exportToFolder, async (event, request: ExportToFolderRequest) => {
    try {
      return await exportToFolder(request.manifest, request.targetDir, event.sender)
    } catch (error) {
      return { success: false, writtenFiles: 0, error: (error as Error).message } satisfies ExportResult
    }
  })

  ipcMain.handle(IPC.exportToZip, async (event, request: ExportToZipRequest) => {
    try {
      return await exportToZip(request.manifest, request.targetZipPath, event.sender)
    } catch (error) {
      return { success: false, writtenFiles: 0, error: (error as Error).message } satisfies ExportResult
    }
  })
}
