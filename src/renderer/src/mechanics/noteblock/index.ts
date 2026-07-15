import { MechanicRegistry } from '../registry'
import { noteblockSchema, defaultNoteblock } from './schema'
import { noteblockToYaml, noteblockFromYaml } from './serializer'
import { NoteblockForm } from './Form'
import { validateNoteblock } from './validator'

MechanicRegistry.register({
  id: 'noteblock',
  labelKey: 'mechanics:noteblock.label',
  yamlKey: 'noteblock',
  schema: noteblockSchema,
  defaultValue: defaultNoteblock,
  FormComponent: NoteblockForm,
  toYaml: noteblockToYaml,
  fromYaml: noteblockFromYaml,
  validate: validateNoteblock,
  variationNamespace: 'block'
})
