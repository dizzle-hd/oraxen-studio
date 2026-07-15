import { protocol, net } from 'electron'
import { pathToFileURL } from 'node:url'
import path from 'node:path'

/**
 * `asset://<url-encoded-absolute-path>` lets the renderer display local PNGs
 * and load JSON models without ever piping binary bytes through IPC.
 * The allowlist keeps a compromised renderer from reading arbitrary files -
 * only paths inside directories registered via `allowRoot` are servable.
 */
const allowedRoots = new Set<string>()

export function allowAssetRoot(rootDir: string): void {
  allowedRoots.add(path.resolve(rootDir))
}

function isPathAllowed(resolved: string): boolean {
  for (const root of allowedRoots) {
    const relative = path.relative(root, resolved)
    if (relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative))) {
      return true
    }
  }
  return false
}

export function registerAssetProtocol(): void {
  protocol.handle('asset', (request) => {
    const encodedPath = request.url.replace(/^asset:\/\//, '')
    const decodedPath = decodeURIComponent(encodedPath)
    const resolved = path.resolve(decodedPath)

    if (!isPathAllowed(resolved)) {
      return new Response('Forbidden: path outside allowed project roots', { status: 403 })
    }

    return net.fetch(pathToFileURL(resolved).toString())
  })
}
