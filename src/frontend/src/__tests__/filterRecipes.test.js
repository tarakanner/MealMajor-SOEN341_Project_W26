import { filterRecipes } from '../services/filterRecipes';

describe('filterRecipes Search Logic', () => {
  const mockRecipes = [
    {
      id: 1,
      name: 'Spaghetti Bolognese',
      ingredients: ['Pasta', 'Ground Beef', 'Tomato Sauce'],
      preparationSteps: ['Boil pasta', 'Cook beef', 'Mix'],
      dietaryTags: ['High-Protein']
    },
    {
      id: 2,
      name: 'Vegan Salad',
      ingredients: ['Lettuce', 'Tomato', 'Cucumber', 'Olive Oil'],
      preparationSteps: ['Chop vegetables', 'Mix with oil'],
      dietaryTags: ['Vegan', 'Gluten-Free']
    },
    {
      id: 3,
      name: 'Pancakes',
      ingredients: ['Flour', 'Eggs', 'Milk', 'Syrup'],
      preparationSteps: ['Mix batter', 'Cook on pan'],
      dietaryTags: ['Vegetarian']
    }
  ];

  test('returns all recipes if no search query is provided', () => {
    const result = filterRecipes(mockRecipes, '');
    expect(result.length).toBe(3);
  });

  test('filters recipes accurately by name (case-insensitive)', () => {
    // Exact partial match
    const result1 = filterRecipes(mockRecipes, 'Spaghetti');
    expect(result1.length).toBe(1);
    expect(result1[0].name).toBe('Spaghetti Bolognese');

    // Case-insensitive match
    const result2 = filterRecipes(mockRecipes, 'pancakes');
    expect(result2.length).toBe(1);
    expect(result2[0].name).toBe('Pancakes');
  });

  test('filters recipes accurately by ingredient (case-insensitive)', () => {
    const result1 = filterRecipes(mockRecipes, 'Tomato');
    // Tomato Sauce is in Spaghetti, Tomato is in Salad
    expect(result1.length).toBe(2);
    expect(result1.some(r => r.name === 'Spaghetti Bolognese')).toBe(true);
    expect(result1.some(r => r.name === 'Vegan Salad')).toBe(true);

    const result2 = filterRecipes(mockRecipes, 'eggs');
    expect(result2.length).toBe(1);
    expect(result2[0].name).toBe('Pancakes');
  });

  test('returns empty array when no recipes match the search query', () => {
    const result = filterRecipes(mockRecipes, 'NonexistentIngredient');
    expect(result.length).toBe(0);
    expect(result).toEqual([]);
  });

  test('filters accurately bridging both name and ingredients simultaneously', () => {
    // Should match Pancake (name) or Flour (ingredient)
    const result = filterRecipes(mockRecipes, 'Flour');
    expect(result.length).toBe(1);
    expect(result[0].name).toBe('Pancakes');
  });
});
