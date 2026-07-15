import { create } from 'zustand'

export type ActiveView = 'project' | 'items' | 'assets' | 'packSettings' | 'validation' | 'export'

interface UiState {
  activeView: ActiveView
  setActiveView: (view: ActiveView) => void
}

export const useUiStore = create<UiState>((set) => ({
  activeView: 'project',
  setActiveView: (view) => set({ activeView: view })
}))
