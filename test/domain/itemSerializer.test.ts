import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import '@renderer/mechanics/registerAll'
import { itemFromYamlString, itemToYamlString } from '@renderer/domain/yaml/itemSerializer'

const ONYX_AXE_FIXTURE = readFileSync(
  resolve(__dirname, '../fixtures/oraxen-docs/onyx_axe.yml'),
  'utf-8'
)

describe('itemSerializer', () => {
  it('parses the onyx_axe docs example into the expected domain shape', () => {
    const item = itemFromYamlString(ONYX_AXE_FIXTURE)

    expect(item.id).toBe('onyx_axe')
    expect(item.displayName).toBe('<black>Onyx Axe')
    expect(item.material).toBe('DIAMOND_AXE')
    expect(item.pack).toEqual({
      mode: 'generated',
      parentModel: 'item/handheld',
      textures: [{ id: 'onyx_axe.png', kind: 'texture', absPath: '', relPath: 'onyx_axe.png' }]
    })
    expect(item.mechanics.durability).toEqual({ value: 20000 })
  })

  it('round-trips: parse -> serialize -> parse again yields the same domain object', () => {
    const parsedOnce = itemFromYamlString(ONYX_AXE_FIXTURE)
    const serialized = itemToYamlString(parsedOnce)
    const parsedTwice = itemFromYamlString(serialized)

    expect(parsedTwice).toEqual(parsedOnce)
  })

  it('serializes a domain item built from scratch to valid, re-parseable YAML', () => {
    const item = {
      id: 'test_sword',
      displayName: '<red>Test Sword',
      material: 'DIAMOND_SWORD',
      pack: {
        mode: 'generated' as const,
        parentModel: 'item/handheld',
        textures: [{ id: 'test_sword.png', kind: 'texture' as const, absPath: '', relPath: 'test_sword.png' }]
      },
      mechanics: { durability: { value: 500 } }
    }

    const yamlText = itemToYamlString(item)
    expect(yamlText).toContain('test_sword:')
    expect(yamlText).toContain('displayname: <red>Test Sword')
    expect(yamlText).toContain('material: DIAMOND_SWORD')

    const reparsed = itemFromYamlString(yamlText)
    expect(reparsed).toEqual(item)
  })
})
