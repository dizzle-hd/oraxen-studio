# Oraxen Studio

Ein Windows-Desktop-Tool zum grafischen Erstellen von Item-Packs für das Minecraft-Plugin
[Oraxen](https://docs.oraxen.com/) – ähnlich wie "Nexo Maker" für den Nexo-Fork.

Oraxen selbst generiert beim Serverstart aus einem Konfigurationsordner
(`plugins/Oraxen/`) das eigentliche Minecraft-Resourcepack. Oraxen Studio erzeugt
genau diesen Konfigurationsordner grafisch: Items (YAML), Texturen, Modelle,
Pack-Einstellungen – validiert und exportierbar als Ordner oder ZIP.

## Tech-Stack

- Electron + React + TypeScript, Build-Tooling über `electron-vite`
- UI: Mantine v7, State: zustand + immer, i18n: react-i18next (Deutsch/Englisch)
- YAML: `yaml` (eemeli) für kommentar-erhaltendes Round-Trip-Editing
- 3D-Vorschau: three.js / `@react-three/fiber` (für importierte Custom-Modelle)
- Tests: Vitest

## Entwicklung

```bash
npm install
npm run dev          # Electron-App im Dev-Modus starten
npm run typecheck    # TypeScript-Checks (main + preload + renderer)
npm test             # Vitest-Testsuite
npm run build         # Produktions-Build (out/)
npm run build:win     # Produktions-Build + Windows-Installer (nsis + portable)
npm run build:win:dir # wie build:win, aber ungepackt (dist/win-unpacked) – kein Installer
```

**Hinweis zum Windows-Build:** `build:win`/`build:win:dir` laden zur Paketierung
für die Zielplattform ein Electron-Binary von den offiziellen Electron-Release-
Servern herunter. In manchen sandboxed/CI-Umgebungen ohne Zugriff auf diese
Server (z. B. dieser Entwicklungscontainer) schlägt das fehl. Am zuverlässigsten
baut man den Windows-Installer entweder direkt auf einem Windows-Rechner oder
über eine GitHub-Actions-Pipeline mit einem `windows-latest`-Runner.

## Projektstruktur

```
src/
  main/       Electron-Hauptprozess: IPC-Handler, asset://-Protokoll, Export (fs/archiver)
  preload/    contextBridge-API (window.oraxenStudio)
  shared/     ipcContract.ts – Single Source of Truth für die IPC-Grenze
  renderer/
    src/
      domain/       reine Business-Logik (Typen, YAML-Serializer, Validierung, Minecraft-Daten)
      mechanics/    Mechanic-Registry + ein Modul pro Oraxen-Mechanik (siehe unten)
      features/     UI-Features (Projekt, Assets, Items, Pack-Settings, Export, Validierung)
      state/        zustand-Stores
      i18n/         de/en-Übersetzungen
```

### Mechanic-Registry

Jede Oraxen-Mechanik (`durability`, `furniture`, `noteblock`, `stringblock`,
Custom-Armor …) ist ein eigenständiges Modul unter `src/renderer/src/mechanics/<id>/`
mit `schema.ts` (Zod), `serializer.ts` (YAML ↔ Domain-Objekt), `Form.tsx` und optional
`validator.ts`. Registrierung erfolgt einmalig in `mechanics/registerAll.ts`. Neue
Mechaniken hinzufügen = neuer Ordner + ein Import in `registerAll.ts`, ohne bestehenden
Code anzufassen.

## Umsetzungsstand

**Fertig (produktiv nutzbarer "Walking Skeleton"):**
- Projekt anlegen / bestehenden `plugins/Oraxen`-Ordner importieren
- Asset-Bibliothek (Texturen/Modelle importieren, Vorschau)
- Item-Editor: einfache generierte 2D-Items (Textur-Layer + Canvas-Icon-Vorschau)
  und Custom-Model-Items (Import + vereinfachte 3D-Box-Vorschau, siehe unten)
- Mechaniken: `durability`, `furniture`, `noteblock`, `stringblock`,
  Custom-Armor (`armor_components`, `armor_trims` – Feldnamen als Best-Effort markiert,
  siehe Kommentare in den jeweiligen `schema.ts`)
- Pack-Einstellungen (pack.mcmeta, pack.png, Compression, Protection)
- Validierung (doppelte Item-IDs, fehlende Textur-/Modell-Referenzen, unbekannte
  Materialien, doppelte `custom_variation`, Farbcode-Syntaxcheck)
- Export als Ordner oder ZIP, YAML-Live-Vorschau je Item
- YAML-Round-Trip (Kommentare/Formatierung bleiben beim Bearbeiten importierter
  Dateien erhalten) – siehe `test/domain/itemSerializer.test.ts`

**Bekannte Lücken / nächste Schritte (siehe Plan-Datei für Details):**
- 3D-Vorschau für Custom-Modelle zeigt aktuell nur untexturierte Boxen
  (Geometrie aus `elements`), noch kein UV-Texture-Mapping
- Glyphs/Custom-Font-Editor noch nicht gebaut
- Recipes-Editor (shaped/shapeless/furnace) noch nicht gebaut
- `settings.yml`/`mechanics.yml` werden beim Import/Export noch nicht als
  Passthrough erhalten (nur `items/`, `pack/textures`, `pack/models`, `pack/pack.mcmeta`,
  `pack/pack.png`)
- Materialliste ist eine kuratierte Teilmenge (~300 Einträge), nicht der volle
  Bukkit-`Material`-Enum
- Kein Code-Signing / Auto-Update
