import type { ReactElement } from 'react'
import { Button, Menu } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { MechanicRegistry } from '../../mechanics/registry'

interface MechanicPickerProps {
  existingMechanicIds: string[]
  onAdd: (mechanicId: string) => void
}

export function MechanicPicker({ existingMechanicIds, onAdd }: MechanicPickerProps): ReactElement {
  const { t } = useTranslation('items')
  const available = MechanicRegistry.list().filter((m) => !existingMechanicIds.includes(m.id))

  return (
    <Menu>
      <Menu.Target>
        <Button size="xs" variant="light" leftSection={<IconPlus size={14} />} disabled={available.length === 0}>
          {t('mechanics.addMechanic')}
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        {available.map((mechanic) => (
          <Menu.Item key={mechanic.id} onClick={() => onAdd(mechanic.id)}>
            {t(mechanic.labelKey)}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  )
}
