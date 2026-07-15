import { contextBridge, ipcRenderer } from 'electron'
import {
  IPC,
  type DialogSaveFileOptions,
  type ExportToFolderRequest,
  type ExportToZipRequest,
  type OraxenStudioApi
} from '@shared/ipcContract'

const api: OraxenStudioApi = {
  dialog: {
    openDirectory: () => ipcRenderer.invoke(IPC.dialogOpenDirectory),
    openFiles: (filters) => ipcRenderer.invoke(IPC.dialogOpenFiles, filters),
    saveFile: (options: DialogSaveFileOptions) => ipcRenderer.invoke(IPC.dialogSaveFile, options)
  },
  fs: {
    readTextFile: (absPath) => ipcRenderer.invoke(IPC.fsReadTextFile, absPath),
    writeTextFile: (absPath, content) => ipcRenderer.invoke(IPC.fsWriteTextFile, absPath, content),
    pathExists: (absPath) => ipcRenderer.invoke(IPC.fsPathExists, absPath),
    copyFile: (sourceAbsPath, destAbsPath) => ipcRenderer.invoke(IPC.fsCopyFile, sourceAbsPath, destAbsPath)
  },
  project: {
    importFolder: (rootDir) => ipcRenderer.invoke(IPC.projectImportFolder, rootDir)
  },
  export: {
    toFolder: (request: ExportToFolderRequest) => ipcRenderer.invoke(IPC.exportToFolder, request),
    toZip: (request: ExportToZipRequest) => ipcRenderer.invoke(IPC.exportToZip, request),
    onProgress: (listener) => {
      const handler = (_event: Electron.IpcRendererEvent, written: number, total: number): void =>
        listener(written, total)
      ipcRenderer.on('export:progress', handler)
      return () => ipcRenderer.removeListener('export:progress', handler)
    }
  },
  assetUrl: (absPath: string) => `asset://${encodeURIComponent(absPath)}`
}

contextBridge.exposeInMainWorld('oraxenStudio', api)
