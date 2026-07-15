export type AssetKind = 'texture' | 'model' | 'sound' | 'font' | 'other'

/**
 * A texture/model/etc. tracked by the project. `relPath` mirrors the path
 * Oraxen itself expects under `pack/textures/...` or `pack/models/...`;
 * `absPath` is only used locally (asset:// preview, export copyFile source)
 * and never gets written into any exported YAML.
 */
export interface AssetReference {
  id: string
  kind: AssetKind
  relPath: string
  absPath: string
  width?: number
  height?: number
}
