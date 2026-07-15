import type { AssetReference } from './asset'

export interface GlyphDefinition {
  id: string
  /** Unicode codepoint (Private Use Area), auto-assigned but user-overridable. */
  unicode: string
  texture: AssetReference
  ascent: number
  height: number
  permission?: string
}
