import type { ReactElement } from 'react'
import { useState } from 'react'
import { ActionIcon, Button, Group, NavLink, Stack, Text, TextInput, Title } from '@mantine/core'
import { IconPlus, IconTrash } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { useProjectStore } from '../../state/projectStore'
import { ItemEditorPanel } from './ItemEditorPanel'

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_]+/g, '_')
    .replace(/^_+|_+$/g, '') || 'item'
}

export function ItemsView(): ReactElement {
  const { t } = useTranslation('items')
  const { t: tCommon } = useTranslation('common')
  const project = useProjectStore((s) => s.project)
  const selectedItemId = useProjectStore((s) => s.selectedItemId)
  const selectItem = useProjectStore((s) => s.selectItem)
  const addItem = useProjectStore((s) => s.addItem)
  const removeItem = useProjectStore((s) => s.removeItem)

  const [newItemName, setNewItemName] = useState('')

  if (!project) {
    return <Text c="dimmed">{tCommon('project.noProject')}</Text>
  }

  function handleAddItem(): void {
    const id = slugify(newItemName || 'new_item')
    addItem(id)
    setNewItemName('')
  }

  return (
    <Group align="start" gap="lg" wrap="nowrap">
      <Stack w={260} gap="xs">
        <Title order={4}>{t('title')}</Title>
        <Group gap="xs">
          <TextInput
            placeholder={t('itemId')}
            size="xs"
            value={newItemName}
            onChange={(e) => setNewItemName(e.currentTarget.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
            style={{ flex: 1 }}
          />
          <ActionIcon onClick={handleAddItem} variant="filled">
            <IconPlus size={16} />
          </ActionIcon>
        </Group>

        {project.items.length === 0 && <Text size="sm" c="dimmed">{t('noItems')}</Text>}

        <Stack gap={2}>
          {project.items.map((item) => (
            <Group key={item.id} gap={4} wrap="nowrap">
              <NavLink
                label={item.id}
                description={item.material}
                active={item.id === selectedItemId}
                onClick={() => selectItem(item.id)}
                style={{ flex: 1, borderRadius: 6 }}
              />
              <ActionIcon variant="subtle" color="red" onClick={() => removeItem(item.id)}>
                <IconTrash size={14} />
              </ActionIcon>
            </Group>
          ))}
        </Stack>
      </Stack>

      <div style={{ flex: 1, minWidth: 0 }}>
        {selectedItemId ? (
          <ItemEditorPanel itemId={selectedItemId} />
        ) : (
          <Button variant="light" onClick={handleAddItem}>{t('newItem')}</Button>
        )}
      </div>
    </Group>
  )
}
