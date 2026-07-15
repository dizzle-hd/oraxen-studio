import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import type { Project } from '../domain/types/project'
import type { OraxenItem } from '../domain/types/item'
import type { AssetReference } from '../domain/types/asset'
import { createEmptyProject } from '../domain/types/project'
import { createEmptyItem } from '../domain/types/item'

interface ProjectState {
  project: Project | null
  selectedItemId: string | null

  setProject: (project: Project) => void
  closeProject: () => void

  addItem: (id: string) => void
  updateItem: (id: string, updater: (item: OraxenItem) => void) => void
  removeItem: (id: string) => void
  selectItem: (id: string | null) => void

  addAssets: (assets: AssetReference[]) => void
  removeAsset: (assetId: string) => void
}

export const useProjectStore = create<ProjectState>()(
  immer((set) => ({
    project: null,
    selectedItemId: null,

    setProject: (project) =>
      set((state) => {
        state.project = project
        state.selectedItemId = project.items[0]?.id ?? null
      }),

    closeProject: () =>
      set((state) => {
        state.project = null
        state.selectedItemId = null
      }),

    addItem: (id) =>
      set((state) => {
        if (!state.project) return
        if (state.project.items.some((i) => i.id === id)) return
        state.project.items.push(createEmptyItem(id))
        state.selectedItemId = id
        state.project.meta.updatedAt = new Date().toISOString()
      }),

    updateItem: (id, updater) =>
      set((state) => {
        if (!state.project) return
        const item = state.project.items.find((i) => i.id === id)
        if (!item) return
        updater(item)
        state.project.meta.updatedAt = new Date().toISOString()
      }),

    removeItem: (id) =>
      set((state) => {
        if (!state.project) return
        state.project.items = state.project.items.filter((i) => i.id !== id)
        if (state.selectedItemId === id) {
          state.selectedItemId = state.project.items[0]?.id ?? null
        }
        state.project.meta.updatedAt = new Date().toISOString()
      }),

    selectItem: (id) =>
      set((state) => {
        state.selectedItemId = id
      }),

    addAssets: (assets) =>
      set((state) => {
        if (!state.project) return
        for (const asset of assets) {
          if (!state.project.assets.some((a) => a.relPath === asset.relPath)) {
            state.project.assets.push(asset)
          }
        }
        state.project.meta.updatedAt = new Date().toISOString()
      }),

    removeAsset: (assetId) =>
      set((state) => {
        if (!state.project) return
        state.project.assets = state.project.assets.filter((a) => a.id !== assetId)
      })
  }))
)

export { createEmptyProject }
