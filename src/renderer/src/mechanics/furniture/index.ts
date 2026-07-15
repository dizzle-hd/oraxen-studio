import { MechanicRegistry } from '../registry'
import { furnitureSchema, defaultFurniture } from './schema'
import { furnitureToYaml, furnitureFromYaml } from './serializer'
import { FurnitureForm } from './Form'

MechanicRegistry.register({
  id: 'furniture',
  labelKey: 'mechanics:furniture.label',
  yamlKey: 'furniture',
  schema: furnitureSchema,
  defaultValue: defaultFurniture,
  FormComponent: FurnitureForm,
  toYaml: furnitureToYaml,
  fromYaml: furnitureFromYaml,
  validate: () => []
})
