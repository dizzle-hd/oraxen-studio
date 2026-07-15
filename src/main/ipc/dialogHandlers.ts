import { ipcMain, dialog, BrowserWindow } from 'electron'
import { IPC, type DialogSaveFileOptions } from '@shared/ipcContract'

export function registerDialogHandlers(): void {
  ipcMain.handle(IPC.dialogOpenDirectory, async (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    const options: Electron.OpenDialogOptions = { properties: ['openDirectory', 'createDirectory'] }
    const result = await (win ? dialog.showOpenDialog(win, options) : dialog.showOpenDialog(options))
    if (result.canceled || result.filePaths.length === 0) {
      return { canceled: true }
    }
    return { canceled: false, path: result.filePaths[0] }
  })

  ipcMain.handle(
    IPC.dialogOpenFiles,
    async (event, filters?: { name: string; extensions: string[] }[]) => {
      const win = BrowserWindow.fromWebContents(event.sender)
      const options: Electron.OpenDialogOptions = { properties: ['openFile', 'multiSelections'], filters }
      const result = await (win ? dialog.showOpenDialog(win, options) : dialog.showOpenDialog(options))
      if (result.canceled) {
        return { canceled: true, paths: [] }
      }
      return { canceled: false, paths: result.filePaths }
    }
  )

  ipcMain.handle(IPC.dialogSaveFile, async (event, options: DialogSaveFileOptions) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    const saveOptions = { defaultPath: options?.defaultPath, filters: options?.filters }
    const result = await (win ? dialog.showSaveDialog(win, saveOptions) : dialog.showSaveDialog(saveOptions))
    if (result.canceled || !result.filePath) {
      return { canceled: true }
    }
    return { canceled: false, path: result.filePath }
  })
}
