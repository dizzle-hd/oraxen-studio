import type { MechanicDefinition, MechanicId } from '../domain/types/mechanics/base'

class MechanicRegistryImpl {
  private mechanics = new Map<MechanicId, MechanicDefinition<any>>()

  register<TData>(def: MechanicDefinition<TData>): void {
    if (this.mechanics.has(def.id)) {
      throw new Error(`Mechanic "${def.id}" ist bereits registriert`)
    }
    this.mechanics.set(def.id, def)
  }

  get<TData = unknown>(id: MechanicId): MechanicDefinition<TData> | undefined {
    return this.mechanics.get(id) as MechanicDefinition<TData> | undefined
  }

  list(): MechanicDefinition<any>[] {
    return [...this.mechanics.values()]
  }

  /** Clears all registrations - test-only, so each test file starts from a clean registry. */
  __reset(): void {
    this.mechanics.clear()
  }
}

export const MechanicRegistry = new MechanicRegistryImpl()
