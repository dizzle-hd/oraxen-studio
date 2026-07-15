import { MechanicRegistry } from '../registry'
import { stringblockSchema, defaultStringblock } from './schema'
import { stringblockToYaml, stringblockFromYaml } from './serializer'
import { StringblockForm } from './Form'
import { validateStringblock } from './validator'

MechanicRegistry.register({
  id: 'stringblock',
  labelKey: 'mechanics:stringblock.label',
  yamlKey: 'stringblock',
  schema: stringblockSchema,
  defaultValue: defaultStringblock,
  FormComponent: StringblockForm,
  toYaml: stringblockToYaml,
  fromYaml: stringblockFromYaml,
  validate: validateStringblock,
  variationNamespace: 'block'
})
