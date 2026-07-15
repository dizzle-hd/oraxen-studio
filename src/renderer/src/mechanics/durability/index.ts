import { MechanicRegistry } from '../registry'
import { durabilitySchema, defaultDurability } from './schema'
import { durabilityToYaml, durabilityFromYaml } from './serializer'
import { DurabilityForm } from './Form'
import { validateDurability } from './validator'

MechanicRegistry.register({
  id: 'durability',
  labelKey: 'mechanics:durability.label',
  yamlKey: 'durability',
  schema: durabilitySchema,
  defaultValue: defaultDurability,
  FormComponent: DurabilityForm,
  toYaml: durabilityToYaml,
  fromYaml: durabilityFromYaml,
  validate: validateDurability
})
