import type { Project } from '../../types/project'
import type { ValidationIssue } from '../../types/validation'

export function checkMissingAssetReferences(project: Project): ValidationIssue[] {
  const knownRelPaths = new Set(project.assets.map((a) => a.relPath))
  const issues: ValidationIssue[] = []

  for (const item of project.items) {
    const { pack } = item
    const texturesToCheck = [
      ...(pack.textures ?? []),
      ...Object.values(pack.namedTextures ?? {}),
      ...(pack.customModel ? [pack.customModel] : []),
      ...(pack.blockingModel ? [pack.blockingModel] : [])
    ]

    for (const asset of texturesToCheck) {
      if (!knownRelPaths.has(asset.relPath)) {
        issues.push({
          id: `missing-asset:${item.id}:${asset.relPath}`,
          severity: 'error',
          messageKey: asset.kind === 'model' ? 'missingModel' : 'missingTexture',
          messageParams: { relPath: asset.relPath },
          targetType: 'item',
          targetId: item.id,
          path: ['pack']
        })
      }
    }
  }
  return issues
}
