import type { FurnitureData } from './schema'

const KNOWN_KEYS = new Set([
  'type', 'barrier', 'rotatable', 'restricted_rotation', 'light', 'seat', 'storage', 'drop'
])

export function furnitureToYaml(data: FurnitureData): unknown {
  const out: Record<string, unknown> = { ...(data.advanced ?? {}), type: data.type }
  if (data.barrier !== undefined) out.barrier = data.barrier
  if (data.rotatable !== undefined) out.rotatable = data.rotatable
  if (data.restrictedRotation && data.restrictedRotation !== 'NONE') {
    out.restricted_rotation = data.restrictedRotation
  }
  if (data.light !== undefined) out.light = data.light
  if (data.seatHeight !== undefined || data.seatYaw !== undefined) {
    out.seat = { height: data.seatHeight ?? 0, yaw: data.seatYaw ?? 0 }
  }
  if (data.storageEnabled) {
    out.storage = {
      type: 'STORAGE',
      rows: data.storageRows ?? 3,
      title: data.storageTitle ?? 'Storage'
    }
  }
  if (data.dropSilktouch !== undefined) {
    out.drop = { ...(out.drop as object), silktouch: data.dropSilktouch }
  }
  return out
}

export function furnitureFromYaml(raw: unknown): FurnitureData {
  const obj = (raw ?? {}) as Record<string, unknown>
  const seat = obj.seat as Record<string, unknown> | undefined
  const storage = obj.storage as Record<string, unknown> | undefined
  const drop = obj.drop as Record<string, unknown> | undefined

  const advanced: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(obj)) {
    if (!KNOWN_KEYS.has(key)) advanced[key] = value
  }

  return {
    type: (obj.type as FurnitureData['type']) ?? 'DISPLAY_ENTITY',
    barrier: typeof obj.barrier === 'boolean' ? obj.barrier : undefined,
    rotatable: typeof obj.rotatable === 'boolean' ? obj.rotatable : undefined,
    restrictedRotation:
      obj.restricted_rotation === 'STRICT' || obj.restricted_rotation === 'VERY_STRICT'
        ? obj.restricted_rotation
        : undefined,
    light: typeof obj.light === 'number' ? obj.light : undefined,
    seatHeight: typeof seat?.height === 'number' ? seat.height : undefined,
    seatYaw: typeof seat?.yaw === 'number' ? seat.yaw : undefined,
    storageEnabled: storage !== undefined,
    storageRows: typeof storage?.rows === 'number' ? storage.rows : undefined,
    storageTitle: typeof storage?.title === 'string' ? storage.title : undefined,
    dropSilktouch: typeof drop?.silktouch === 'boolean' ? drop.silktouch : undefined,
    advanced: Object.keys(advanced).length > 0 ? advanced : undefined
  }
}
