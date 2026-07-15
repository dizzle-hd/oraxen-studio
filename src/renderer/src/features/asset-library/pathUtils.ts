/** Renderer has no Node `path` module (sandboxed, no nodeIntegration) - tiny local helpers instead. */
export function basename(filePath: string): string {
  const normalized = filePath.replace(/\\/g, '/')
  return normalized.slice(normalized.lastIndexOf('/') + 1)
}

export function extname(filePath: string): string {
  const name = basename(filePath)
  const dotIndex = name.lastIndexOf('.')
  return dotIndex <= 0 ? '' : name.slice(dotIndex).toLowerCase()
}

export function joinPath(...segments: string[]): string {
  return segments
    .map((s) => s.replace(/[\\/]+$/, ''))
    .join('/')
    .replace(/\\/g, '/')
}
