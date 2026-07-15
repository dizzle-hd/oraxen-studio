import type { ReactElement } from 'react'
import { Alert, Stack, TextInput } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import type { MechanicFormProps } from '../../domain/types/mechanics/base'
import type { ArmorComponentsData } from './schema'

export function ArmorComponentsForm({ value, onChange }: MechanicFormProps<ArmorComponentsData>): ReactElement {
  const { t } = useTranslation('mechanics')

  return (
    <Stack gap="sm">
      <Alert color="yellow" variant="light">
        {t('armorComponents.experimentalNote')}
      </Alert>
      <TextInput
        label={t('armorComponents.color')}
        placeholder="#AABBCC"
        value={value.color ?? ''}
        onChange={(e) => onChange({ ...value, color: e.currentTarget.value })}
      />
      <TextInput
        label={t('armorComponents.trimMaterial')}
        value={value.trimMaterial ?? ''}
        onChange={(e) => onChange({ ...value, trimMaterial: e.currentTarget.value })}
      />
      <TextInput
        label={t('armorComponents.trimPattern')}
        value={value.trimPattern ?? ''}
        onChange={(e) => onChange({ ...value, trimPattern: e.currentTarget.value })}
      />
    </Stack>
  )
}
