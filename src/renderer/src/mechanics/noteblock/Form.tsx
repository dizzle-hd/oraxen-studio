import type { ReactElement } from 'react'
import { NumberInput, Stack, Switch } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import type { MechanicFormProps } from '../../domain/types/mechanics/base'
import type { NoteblockData } from './schema'

export function NoteblockForm({ value, onChange }: MechanicFormProps<NoteblockData>): ReactElement {
  const { t } = useTranslation('mechanics')

  return (
    <Stack gap="sm">
      <NumberInput
        label={t('noteblock.customVariation')}
        description={t('noteblock.customVariationHint')}
        min={1}
        value={value.customVariation}
        onChange={(v) => onChange({ ...value, customVariation: typeof v === 'number' ? v : value.customVariation })}
      />
      <NumberInput
        label={t('noteblock.hardness')}
        value={value.hardness ?? ''}
        onChange={(v) => onChange({ ...value, hardness: typeof v === 'number' ? v : undefined })}
      />
      <NumberInput
        label={t('noteblock.light')}
        min={0}
        max={15}
        value={value.light ?? ''}
        onChange={(v) => onChange({ ...value, light: typeof v === 'number' ? v : undefined })}
      />
      <Switch
        label={t('noteblock.isFalling')}
        checked={value.isFalling ?? false}
        onChange={(e) => onChange({ ...value, isFalling: e.currentTarget.checked })}
      />
    </Stack>
  )
}
