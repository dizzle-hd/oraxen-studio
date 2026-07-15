import type { ReactElement } from 'react'
import { NumberInput, Select, Stack, Switch, TextInput } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import type { MechanicFormProps } from '../../domain/types/mechanics/base'
import type { FurnitureData } from './schema'

export function FurnitureForm({ value, onChange }: MechanicFormProps<FurnitureData>): ReactElement {
  const { t } = useTranslation('mechanics')

  return (
    <Stack gap="sm">
      <Select
        label={t('furniture.type')}
        data={['ITEM_FRAME', 'DISPLAY_ENTITY', 'GLOWING_ITEM_FRAME']}
        value={value.type}
        onChange={(v) => v && onChange({ ...value, type: v as FurnitureData['type'] })}
      />
      <Switch
        label={t('furniture.rotatable')}
        checked={value.rotatable ?? false}
        onChange={(e) => onChange({ ...value, rotatable: e.currentTarget.checked })}
      />
      <Select
        label={t('furniture.restrictedRotation')}
        data={['NONE', 'STRICT', 'VERY_STRICT']}
        value={value.restrictedRotation ?? 'NONE'}
        onChange={(v) => v && onChange({ ...value, restrictedRotation: v as FurnitureData['restrictedRotation'] })}
      />
      <Switch
        label={t('furniture.barrier')}
        checked={value.barrier ?? false}
        onChange={(e) => onChange({ ...value, barrier: e.currentTarget.checked })}
      />
      <NumberInput
        label={t('furniture.light')}
        min={0}
        max={15}
        value={value.light ?? ''}
        onChange={(v) => onChange({ ...value, light: typeof v === 'number' ? v : undefined })}
      />
      <NumberInput
        label={t('furniture.seatHeight')}
        step={0.1}
        value={value.seatHeight ?? ''}
        onChange={(v) => onChange({ ...value, seatHeight: typeof v === 'number' ? v : undefined })}
      />
      <Switch
        label={t('furniture.storageEnabled')}
        checked={value.storageEnabled ?? false}
        onChange={(e) => onChange({ ...value, storageEnabled: e.currentTarget.checked })}
      />
      {value.storageEnabled && (
        <>
          <NumberInput
            label={t('furniture.storageRows')}
            min={1}
            max={6}
            value={value.storageRows ?? 3}
            onChange={(v) => onChange({ ...value, storageRows: typeof v === 'number' ? v : 3 })}
          />
          <TextInput
            label={t('furniture.storageTitle')}
            value={value.storageTitle ?? ''}
            onChange={(e) => onChange({ ...value, storageTitle: e.currentTarget.value })}
          />
        </>
      )}
    </Stack>
  )
}
