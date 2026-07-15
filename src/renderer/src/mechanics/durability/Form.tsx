import type { ReactElement } from 'react'
import { NumberInput, Stack, Switch } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import type { MechanicFormProps } from '../../domain/types/mechanics/base'
import type { DurabilityData } from './schema'

export function DurabilityForm({ value, onChange }: MechanicFormProps<DurabilityData>): ReactElement {
  const { t } = useTranslation('mechanics')

  return (
    <Stack gap="sm">
      <NumberInput
        label={t('durability.value')}
        min={1}
        value={value.value}
        onChange={(v) => onChange({ ...value, value: typeof v === 'number' ? v : value.value })}
      />
      <NumberInput
        label={t('durability.itemDamageOnHit')}
        value={value.itemDamageOnHit ?? ''}
        onChange={(v) =>
          onChange({ ...value, itemDamageOnHit: typeof v === 'number' ? v : undefined })
        }
      />
      <NumberInput
        label={t('durability.itemDamageOnBlockBreak')}
        value={value.itemDamageOnBlockBreak ?? ''}
        onChange={(v) =>
          onChange({ ...value, itemDamageOnBlockBreak: typeof v === 'number' ? v : undefined })
        }
      />
      <Switch
        label={t('durability.removeUnbreakable')}
        checked={value.removeUnbreakable ?? false}
        onChange={(e) => onChange({ ...value, removeUnbreakable: e.currentTarget.checked })}
      />
    </Stack>
  )
}
