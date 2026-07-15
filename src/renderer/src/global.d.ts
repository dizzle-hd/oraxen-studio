import type { OraxenStudioApi } from '@shared/ipcContract'

declare global {
  interface Window {
    oraxenStudio: OraxenStudioApi
  }
}

export {}
