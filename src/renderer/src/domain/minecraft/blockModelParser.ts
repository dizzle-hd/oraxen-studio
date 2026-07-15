/**
 * Minimal parser for Minecraft block/item model JSON (as exported by
 * Blockbench). Only extracts `elements` geometry for a 3D preview -
 * full per-face UV texture mapping is a documented follow-up, the v1
 * preview renders untextured boxes so users can at least verify shape
 * and proportions of an imported custom model.
 */
export interface ParsedModelElement {
  from: [number, number, number]
  to: [number, number, number]
}

export interface ParsedModel {
  elements: ParsedModelElement[]
  textureRefs: string[]
}

export function parseBlockModel(jsonText: string): ParsedModel {
  const raw = JSON.parse(jsonText) as {
    elements?: { from: number[]; to: number[] }[]
    textures?: Record<string, string>
  }

  const elements: ParsedModelElement[] = (raw.elements ?? []).map((el) => ({
    from: [el.from[0], el.from[1], el.from[2]],
    to: [el.to[0], el.to[1], el.to[2]]
  }))

  const textureRefs = Object.values(raw.textures ?? {})

  return { elements, textureRefs }
}
