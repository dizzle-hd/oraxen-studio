import type { ReactElement } from 'react'
import { AppShell as MantineAppShell, Group, NavLink, Select, Text, Title } from '@mantine/core'
import {
  IconFileExport,
  IconFolders,
  IconPackage,
  IconPhoto,
  IconSettings,
  IconShieldCheck
} from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { useUiStore, type ActiveView } from '../../state/uiStore'
import { useProjectStore } from '../../state/projectStore'
import { ProjectView } from '../../features/project-management/ProjectView'
import { ItemsView } from '../../features/item-editor/ItemsView'
import { AssetLibraryView } from '../../features/asset-library/AssetLibraryView'
import { PackSettingsView } from '../../features/pack-settings/PackSettingsView'
import { ValidationPanel } from '../../features/validation/ValidationPanel'
import { ExportView } from '../../features/export/ExportView'

const VIEWS: { id: ActiveView; icon: typeof IconFolders }[] = [
  { id: 'project', icon: IconFolders },
  { id: 'items', icon: IconPackage },
  { id: 'assets', icon: IconPhoto },
  { id: 'packSettings', icon: IconSettings },
  { id: 'validation', icon: IconShieldCheck },
  { id: 'export', icon: IconFileExport }
]

export function AppShell(): ReactElement {
  const { t, i18n } = useTranslation('common')
  const activeView = useUiStore((s) => s.activeView)
  const setActiveView = useUiStore((s) => s.setActiveView)
  const project = useProjectStore((s) => s.project)

  return (
    <MantineAppShell navbar={{ width: 220, breakpoint: 0 }} header={{ height: 56 }} padding="md">
      <MantineAppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <div>
            <Title order={4}>{t('app.title')}</Title>
            <Text size="xs" c="dimmed">
              {project ? project.name : t('app.subtitle')}
            </Text>
          </div>
          <Select
            w={140}
            size="xs"
            data={[
              { value: 'de', label: t('language.de') },
              { value: 'en', label: t('language.en') }
            ]}
            value={i18n.language}
            onChange={(v) => v && i18n.changeLanguage(v)}
          />
        </Group>
      </MantineAppShell.Header>

      <MantineAppShell.Navbar p="xs">
        {VIEWS.map(({ id, icon: Icon }) => (
          <NavLink
            key={id}
            label={t(`nav.${id}`)}
            leftSection={<Icon size={18} />}
            active={activeView === id}
            onClick={() => setActiveView(id)}
            style={{ borderRadius: 6 }}
          />
        ))}
      </MantineAppShell.Navbar>

      <MantineAppShell.Main>
        {activeView === 'project' && <ProjectView />}
        {activeView === 'items' && <ItemsView />}
        {activeView === 'assets' && <AssetLibraryView />}
        {activeView === 'packSettings' && <PackSettingsView />}
        {activeView === 'validation' && <ValidationPanel />}
        {activeView === 'export' && <ExportView />}
      </MantineAppShell.Main>
    </MantineAppShell>
  )
}
