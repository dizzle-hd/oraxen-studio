/**
 * Single source of truth for the IPC boundary between main and renderer.
 * Imported by main, preload and renderer - must never import from either
 * `electron` or React, so it stays usable on both sides of the bridge.
 */

export const IPC = {
  dialogOpenDirectory: 'dialog:openDirectory',
  dialogOpenFiles: 'dialog:openFiles',
  dialogSaveFile: 'dialog:saveFile',

  fsReadTextFile: 'fs:readTextFile',
  fsWriteTextFile: 'fs:writeTextFile',
  fsPathExists: 'fs:pathExists',
  fsCopyFile: 'fs:copyFile',

  projectImportFolder: 'project:importFolder',

  exportToFolder: 'export:toFolder',
  exportToZip: 'export:toZip'
} as const

export type IpcChannel = (typeof IPC)[keyof typeof IPC]

export interface DialogOpenDirectoryResult {
  canceled: boolean
  path?: string
}

export interface DialogOpenFilesResult {
  canceled: boolean
  paths: string[]
}

export interface DialogSaveFileOptions {
  defaultPath?: string
  filters?: { name: string; extensions: string[] }[]
}

export interface DialogSaveFileResult {
  canceled: boolean
  path?: string
}

/** A file discovered while walking an existing `plugins/Oraxen`-shaped folder. */
export interface ImportedProjectFile {
  /** Path relative to the imported root, POSIX separators. */
  relPath: string
  /** Absolute path on disk. */
  absPath: string
  kind: 'yaml' | 'json' | 'image' | 'other'
}

export interface ImportFolderResult {
  rootDir: string
  files: ImportedProjectFile[]
}

/** One entry of an export manifest built by the renderer's domain layer. */
export type ExportManifestEntry =
  | { relPath: string; kind: 'copyFile'; sourceAbsPath: string }
  | { relPath: string; kind: 'writeText'; content: string }

export interface ExportToFolderRequest {
  manifest: ExportManifestEntry[]
  targetDir: string
}

export interface ExportToZipRequest {
  manifest: ExportManifestEntry[]
  targetZipPath: string
}

export interface ExportResult {
  success: boolean
  writtenFiles: number
  error?: string
}

/**
 * The API surface exposed on `window.oraxenStudio` by the preload script.
 * Kept here so renderer code can import a typed shape without reaching
 * into preload internals.
 */
export interface OraxenStudioApi {
  dialog: {
    openDirectory: () => Promise<DialogOpenDirectoryResult>
    openFiles: (filters?: { name: string; extensions: string[] }[]) => Promise<DialogOpenFilesResult>
    saveFile: (options: DialogSaveFileOptions) => Promise<DialogSaveFileResult>
  }
  fs: {
    readTextFile: (absPath: string) => Promise<string>
    writeTextFile: (absPath: string, content: string) => Promise<void>
    pathExists: (absPath: string) => Promise<boolean>
    copyFile: (sourceAbsPath: string, destAbsPath: string) => Promise<void>
  }
  project: {
    importFolder: (rootDir: string) => Promise<ImportFolderResult>
  }
  export: {
    toFolder: (request: ExportToFolderRequest) => Promise<ExportResult>
    toZip: (request: ExportToZipRequest) => Promise<ExportResult>
    onProgress: (listener: (written: number, total: number) => void) => () => void
  }
  assetUrl: (absPath: string) => string
}
