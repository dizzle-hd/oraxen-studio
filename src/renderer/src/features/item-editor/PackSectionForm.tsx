import type { ReactElement } from 'react'
import { Group, MultiSelect, Select, Stack, Text, TextInput } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { useProjectStore } from '../../state/projectStore'
import type { PackSection } from '../../domain/types/item'
import { ItemIconPreview } from './ItemIconPreview'
import { ModelPreview3D } from './ModelPreview3D'

interface PackSectionFormProps {
  value: PackSection
  onChange: (value: PackSection) => void
}

export function PackSectionForm({ value, onChange }: PackSectionFormProps): ReactElement {
  const { t } = useTranslation('items')
  const assets = useProjectStore((s) => s.project?.assets ?? [])
  const textureAssets = assets.filter((a) => a.kind === 'texture')
  const modelAssets = assets.filter((a) => a.kind === 'model')

  return (
    <Stack gap="sm">
      <Select
        label={t('pack.mode')}
        data={[
          { value: 'generated', label: t('pack.modeGenerated') },
          { value: 'custom_model', label: t('pack.modeCustomModel') },
          { value: 'none', label: t('pack.modeNone') }
        ]}
        value={value.mode}
        onChange={(v) => v && onChange({ ...value, mode: v as PackSection['mode'] })}
      />

      {value.mode === 'generated' && (
        <>
          <TextInput
            label={t('pack.parentModel')}
            placeholder="item/generated"
            value={value.parentModel ?? ''}
            onChange={(e) => onChange({ ...value, parentModel: e.currentTarget.value })}
          />
          <MultiSelect
            label={t('pack.textures')}
            data={textureAssets.map((a) => ({ value: a.relPath, label: a.relPath }))}
            value={(value.textures ?? []).map((a) => a.relPath)}
            onChange={(relPaths) =>
              onChange({
                ...value,
                textures: relPaths
                  .map((rp) => textureAssets.find((a) => a.relPath === rp))
                  .filter((a): a is NonNullable<typeof a> => Boolean(a))
              })
            }
          />
          <Group>
            <Text size="sm" c="dimmed">{t('pack.iconPreview')}</Text>
            <ItemIconPreview textures={value.textures ?? []} />
          </Group>
        </>
      )}

      {value.mode === 'custom_model' && (
        <>
          <Select
            label={t('pack.customModel')}
            data={modelAssets.map((a) => ({ value: a.relPath, label: a.relPath }))}
            value={value.customModel?.relPath ?? null}
            onChange={(rp) => {
              const asset = modelAssets.find((a) => a.relPath === rp)
              onChange({ ...value, customModel: asset })
            }}
          />
          {value.customModel?.absPath && <ModelPreview3D modelAbsPath={value.customModel.absPath} />}
        </>
      )}
    </Stack>
  )
}
