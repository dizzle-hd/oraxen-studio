import { MechanicRegistry } from '../registry'
import { armorComponentsSchema, defaultArmorComponents } from './schema'
import { armorComponentsToYaml, armorComponentsFromYaml } from './serializer'
import { ArmorComponentsForm } from './Form'

MechanicRegistry.register({
  id: 'armor_components',
  labelKey: 'mechanics:armorComponents.label',
  yamlKey: 'armor_components',
  schema: armorComponentsSchema,
  defaultValue: defaultArmorComponents,
  FormComponent: ArmorComponentsForm,
  toYaml: armorComponentsToYaml,
  fromYaml: armorComponentsFromYaml,
  validate: () => []
})
