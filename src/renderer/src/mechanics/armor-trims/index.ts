import { MechanicRegistry } from '../registry'
import { armorTrimsSchema, defaultArmorTrims } from './schema'
import { armorTrimsToYaml, armorTrimsFromYaml } from './serializer'
import { ArmorTrimsForm } from './Form'

MechanicRegistry.register({
  id: 'armor_trims',
  labelKey: 'mechanics:armorTrims.label',
  yamlKey: 'armor_trims',
  schema: armorTrimsSchema,
  defaultValue: defaultArmorTrims,
  FormComponent: ArmorTrimsForm,
  toYaml: armorTrimsToYaml,
  fromYaml: armorTrimsFromYaml,
  validate: () => []
})
