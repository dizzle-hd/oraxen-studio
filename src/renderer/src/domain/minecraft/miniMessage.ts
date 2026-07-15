/**
 * Minimal validator for display-name color formatting, not a renderer.
 * Accepts legacy `&`/`§` codes and a small allowlist of MiniMessage
 * tags Oraxen commonly supports. Good enough to flag obvious typos
 * (unclosed tags, unknown tag names) without reimplementing MiniMessage.
 */
const KNOWN_TAGS = new Set([
  'black', 'dark_blue', 'dark_green', 'dark_aqua', 'dark_red', 'dark_purple', 'gold', 'gray', 'dark_gray',
  'blue', 'green', 'aqua', 'red', 'light_purple', 'yellow', 'white',
  'bold', 'b', 'italic', 'i', 'em', 'underlined', 'u', 'strikethrough', 'st', 'obfuscated', 'obf', 'reset',
  'color', 'c', 'gradient', 'rainbow', 'hover', 'click', 'font', 'shadow'
])

const LEGACY_CODE = /[&§][0-9a-fk-orA-FK-OR]/g

export interface MiniMessageIssue {
  message: string
  index: number
}

export function validateDisplayName(text: string): MiniMessageIssue[] {
  const issues: MiniMessageIssue[] = []
  const withoutLegacy = text.replace(LEGACY_CODE, '')

  const tagPattern = /<\/?([a-z_]+)(:[^>]*)?>/gi
  const openTags: string[] = []
  let match: RegExpExecArray | null

  while ((match = tagPattern.exec(withoutLegacy)) !== null) {
    const isClosing = match[0].startsWith('</')
    const tagName = match[1].toLowerCase()

    if (!KNOWN_TAGS.has(tagName)) {
      issues.push({ message: `Unbekanntes Tag <${tagName}>`, index: match.index })
      continue
    }
    if (isClosing) {
      const lastOpen = openTags.pop()
      if (lastOpen !== tagName) {
        issues.push({ message: `Schließendes Tag </${tagName}> ohne passendes öffnendes Tag`, index: match.index })
      }
    } else if (!match[0].endsWith('/>')) {
      openTags.push(tagName)
    }
  }

  if (openTags.length > 0) {
    issues.push({ message: `Nicht geschlossene Tags: ${openTags.join(', ')}`, index: withoutLegacy.length })
  }

  return issues
}
