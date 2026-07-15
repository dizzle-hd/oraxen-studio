import type { ReactElement } from 'react'
import { useMemo } from 'react'
import { ActionIcon, Group, Paper, Stack, Text, TextInput, Title } from '@mantine/core'
import { IconTrash } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { useProjectStore } from '../../state/projectStore'
import { MaterialAutocomplete } from '../../components/MaterialAutocomplete'
import { PackSectionForm } from './PackSectionForm'
import { MechanicPicker } from './MechanicPicker'
import { MechanicRegistry } from '../../mechanics/registry'
import { itemToYamlString } from '../../domain/yaml/itemSerializer'

interface ItemEditorPanelProps {
  itemId: string
}

export function ItemEditorPanel({ itemId }: ItemEditorPanelProps): ReactElement | null {
  const { t } = useTranslation('items')
  const project = useProjectStore((s) => s.project)
  const updateItem = useProjectStore((s) => s.updateItem)

  const item = project?.items.find((i) => i.id === itemId)
  const yamlPreview = useMemo(() => (item ? itemToYamlString(item) : ''), [item])

  if (!project || !item) return null

  return (
    <Stack gap="md">
      <Group grow align="start">
        <Stack gap="sm">
          <TextInput
            label={t('displayName')}
            value={item.displayName}
            onChange={(e) =>
              updateItem(itemId, (draft) => {
                draft.displayName = e.currentTarget.value
              })
            }
          />
          <MaterialAutocomplete
            label={t('material')}
            value={item.material}
            minecraftVersion={project.minecraftVersion}
            onChange={(v) =>
              updateItem(itemId, (draft) => {
                draft.material = v
              })
            }
          />
          <TextInput
            label={t('permission')}
            value={item.permission ?? ''}
            onChange={(e) =>
              updateItem(itemId, (draft) => {
                draft.permission = e.currentTarget.value || undefined
              })
            }
          />

          <Title order={5} mt="sm">{t('pack.title')}</Title>
          <PackSectionForm
            value={item.pack}
            onChange={(pack) =>
              updateItem(itemId, (draft) => {
                draft.pack = pack
              })
            }
          />

          <Group justify="space-between" mt="sm">
            <Title order={5}>{t('mechanics.title')}</Title>
            <MechanicPicker
              existingMechanicIds={Object.keys(item.mechanics)}
              onAdd={(mechanicId) =>
                updateItem(itemId, (draft) => {
                  const def = MechanicRegistry.get(mechanicId)
                  draft.mechanics[mechanicId] = def?.defaultValue()
                })
              }
            />
          </Group>
          {Object.entries(item.mechanics).map(([mechanicId, data]) => {
            const def = MechanicRegistry.get(mechanicId)
            if (!def) return null
            const FormComponent = def.FormComponent
            return (
              <Paper key={mechanicId} withBorder p="sm" radius="md">
                <Group justify="space-between" mb="xs">
                  <Text fw={600} size="sm">{t(def.labelKey)}</Text>
                  <ActionIcon
                    variant="subtle"
                    color="red"
                    onClick={() =>
                      updateItem(itemId, (draft) => {
                        delete draft.mechanics[mechanicId]
                      })
                    }
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>
                <FormComponent
                  value={data}
                  onChange={(newData) =>
                    updateItem(itemId, (draft) => {
                      draft.mechanics[mechanicId] = newData
                    })
                  }
                />
              </Paper>
            )
          })}
        </Stack>

        <Stack gap="xs">
          <Title order={5}>{t('yamlView.title')}</Title>
          <Paper withBorder p="sm" radius="md" bg="dark.8">
            <Text component="pre" size="xs" style={{ whiteSpace: 'pre-wrap', margin: 0 }}>
              {yamlPreview}
            </Text>
          </Paper>
        </Stack>
      </Group>
    </Stack>
  )
}
