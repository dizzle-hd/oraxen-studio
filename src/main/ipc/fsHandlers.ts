import { ipcMain } from 'electron'
import fs from 'node:fs/promises'
import path from 'node:path'
import { IPC } from '@shared/ipcContract'

export function registerFsHandlers(): void {
  ipcMain.handle(IPC.fsReadTextFile, async (_event, absPath: string) => {
    return fs.readFile(absPath, 'utf-8')
  })

  ipcMain.handle(IPC.fsWriteTextFile, async (_event, absPath: string, content: string) => {
    await fs.mkdir(path.dirname(absPath), { recursive: true })
    await fs.writeFile(absPath, content, 'utf-8')
  })

  ipcMain.handle(IPC.fsPathExists, async (_event, absPath: string) => {
    try {
      await fs.access(absPath)
      return true
    } catch {
      return false
    }
  })

  ipcMain.handle(IPC.fsCopyFile, async (_event, sourceAbsPath: string, destAbsPath: string) => {
    await fs.mkdir(path.dirname(destAbsPath), { recursive: true })
    await fs.copyFile(sourceAbsPath, destAbsPath)
  })
}
