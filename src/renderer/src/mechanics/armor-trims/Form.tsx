import type { ReactElement } from 'react'
import { Alert, Stack, TextInput } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import type { MechanicFormProps } from '../../domain/types/mechanics/base'
import type { ArmorTrimsData } from './schema'

export function ArmorTrimsForm({ value, onChange }: MechanicFormProps<ArmorTrimsData>): ReactElement {
  const { t } = useTranslation('mechanics')

  return (
    <Stack gap="sm">
      <Alert color="yellow" variant="light">
        {t('armorTrims.experimentalNote')}
      </Alert>
      <TextInput
        label={t('armorTrims.baseArmorMaterial')}
        value={value.baseArmorMaterial ?? ''}
        onChange={(e) => onChange({ ...value, baseArmorMaterial: e.currentTarget.value })}
      />
      <TextInput
        label={t('armorTrims.trimMaterial')}
        value={value.trimMaterial ?? ''}
        onChange={(e) => onChange({ ...value, trimMaterial: e.currentTarget.value })}
      />
      <TextInput
        label={t('armorTrims.trimPattern')}
        value={value.trimPattern ?? ''}
        onChange={(e) => onChange({ ...value, trimPattern: e.currentTarget.value })}
      />
    </Stack>
  )
}
