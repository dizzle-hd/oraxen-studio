import type { ReactElement } from 'react'
import { MantineProvider, createTheme } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { AppShell } from './layout/AppShell'

const theme = createTheme({
  primaryColor: 'violet',
  defaultRadius: 'md',
  fontFamily: 'Inter, system-ui, sans-serif'
})

export function App(): ReactElement {
  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <Notifications position="bottom-right" />
      <AppShell />
    </MantineProvider>
  )
}
