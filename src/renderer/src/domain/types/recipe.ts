export type RecipeType = 'shaped' | 'shapeless' | 'furnace' | 'blasting' | 'smoking' | 'campfire' | 'stonecutting'

export interface RecipeIngredientRef {
  itemId?: string
  material?: string
}

export interface RecipeResult {
  itemId: string
  amount: number
}

export type RecipeDefinition =
  | { type: 'shaped'; id: string; result: RecipeResult; grid: (RecipeIngredientRef | null)[][]; permission?: string }
  | {
      type: 'shapeless'
      id: string
      result: RecipeResult
      ingredients: RecipeIngredientRef[]
      permission?: string
    }
  | {
      type: 'furnace' | 'blasting' | 'smoking' | 'campfire'
      id: string
      result: RecipeResult
      input: RecipeIngredientRef
      experience: number
      cookingTime: number
      permission?: string
    }
