import type { ReactElement } from 'react'
import { Autocomplete } from '@mantine/core'
import { getMaterialsForVersion } from '../domain/minecraft/materials'

interface MaterialAutocompleteProps {
  label: string
  value: string
  minecraftVersion: string
  onChange: (value: string) => void
}

export function MaterialAutocomplete({
  label,
  value,
  minecraftVersion,
  onChange
}: MaterialAutocompleteProps): ReactElement {
  return (
    <Autocomplete
      label={label}
      data={getMaterialsForVersion(minecraftVersion)}
      value={value}
      onChange={(v) => onChange(v.toUpperCase())}
      limit={20}
    />
  )
}
