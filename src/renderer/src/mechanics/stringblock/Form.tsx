import type { ReactElement } from 'react'
import { NumberInput, Stack } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import type { MechanicFormProps } from '../../domain/types/mechanics/base'
import type { StringblockData } from './schema'

export function StringblockForm({ value, onChange }: MechanicFormProps<StringblockData>): ReactElement {
  const { t } = useTranslation('mechanics')

  return (
    <Stack gap="sm">
      <NumberInput
        label={t('stringblock.customVariation')}
        description={t('stringblock.customVariationHint')}
        min={1}
        value={value.customVariation}
        onChange={(v) => onChange({ ...value, customVariation: typeof v === 'number' ? v : value.customVariation })}
      />
      <NumberInput
        label={t('stringblock.hardness')}
        value={value.hardness ?? ''}
        onChange={(v) => onChange({ ...value, hardness: typeof v === 'number' ? v : undefined })}
      />
    </Stack>
  )
}
