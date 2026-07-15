import { describe, expect, it } from 'vitest'
import '@renderer/mechanics/registerAll'
import { runValidation } from '@renderer/domain/validation/runValidation'
import { createEmptyProject } from '@renderer/domain/types/project'
import { createEmptyItem } from '@renderer/domain/types/item'

describe('runValidation', () => {
  it('flags duplicate item ids', () => {
    const project = createEmptyProject('Test', '/tmp/test')
    project.items.push(createEmptyItem('sword'), createEmptyItem('sword'))

    const issues = runValidation(project)
    expect(issues.some((i) => i.messageKey === 'duplicateItemId')).toBe(true)
  })

  it('flags missing texture references', () => {
    const project = createEmptyProject('Test', '/tmp/test')
    const item = createEmptyItem('sword')
    item.pack.textures = [{ id: 'x.png', kind: 'texture', absPath: '', relPath: 'x.png' }]
    project.items.push(item)

    const issues = runValidation(project)
    expect(issues.some((i) => i.messageKey === 'missingTexture')).toBe(true)
  })

  it('flags duplicate custom_variation across noteblock and stringblock', () => {
    const project = createEmptyProject('Test', '/tmp/test')
    const blockA = createEmptyItem('block_a')
    blockA.mechanics.noteblock = { customVariation: 5 }
    const blockB = createEmptyItem('block_b')
    blockB.mechanics.stringblock = { customVariation: 5 }
    project.items.push(blockA, blockB)

    const issues = runValidation(project)
    expect(issues.some((i) => i.messageKey === 'customVariationDuplicate')).toBe(true)
  })

  it('produces no issues for a clean, empty project', () => {
    const project = createEmptyProject('Test', '/tmp/test')
    expect(runValidation(project)).toEqual([])
  })
})
