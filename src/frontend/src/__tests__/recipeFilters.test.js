import { filterRecipes } from '../services/filterRecipes';

describe('filterRecipes Filters Logic', () => {
  const mockRecipes = [
    {
      id: 1,
      name: 'Quick Salad',
      prepTime: '15 mins',
      difficulty: 'Easy',
      cost: 5,
      dietaryTags: ['Vegan', 'Gluten-Free']
    },
    {
      id: 2,
      name: 'Medium Pasta',
      prepTime: '45 mins',
      difficulty: 'Medium',
      cost: 15,
      dietaryTags: ['Vegetarian']
    },
    {
      id: 3,
      name: 'Complex Roast',
      prepTime: '2 hours',
      difficulty: 'Hard',
      cost: 35,
      dietaryTags: ['High-Protein']
    },
    {
      id: 4,
      name: 'Cheap Snack',
      prepTime: '5 mins',
      difficulty: 'Easy',
      cost: '$2', // testing string parsing
      dietaryTags: ['Vegan']
    }
  ];

  test('filters by prep time accurately', () => {
    // lt30
    const lt30 = filterRecipes(mockRecipes, '', 'lt30', '', '', []);
    expect(lt30.length).toBe(2);
    expect(lt30.some(r => r.name === 'Quick Salad')).toBe(true);
    expect(lt30.some(r => r.name === 'Cheap Snack')).toBe(true);

    // lt60
    const lt60 = filterRecipes(mockRecipes, '', 'lt60', '', '', []);
    expect(lt60.length).toBe(3);
    
    // gt60
    const gt60 = filterRecipes(mockRecipes, '', 'gt60', '', '', []);
    expect(gt60.length).toBe(1);
    expect(gt60[0].name).toBe('Complex Roast');
  });

  test('filters by difficulty accurately', () => {
    const easy = filterRecipes(mockRecipes, '', '', 'easy', '', []);
    expect(easy.length).toBe(2);

    const hard = filterRecipes(mockRecipes, '', '', 'Hard', '', []);
    expect(hard.length).toBe(1);
    expect(hard[0].name).toBe('Complex Roast');
  });

  test('filters by cost accurately', () => {
    // under10 ($5 and $2)
    const under10 = filterRecipes(mockRecipes, '', '', '', 'under10', []);
    expect(under10.length).toBe(2);

    // under20
    const under20 = filterRecipes(mockRecipes, '', '', '', 'under20', []);
    expect(under20.length).toBe(3);

    // under30
    const under30 = filterRecipes(mockRecipes, '', '', '', 'under30', []);
    expect(under30.length).toBe(3);
  });

  test('filters by dietary tags accurately', () => {
    const vegan = filterRecipes(mockRecipes, '', '', '', '', ['Vegan']);
    expect(vegan.length).toBe(2);

    const intersection = filterRecipes(mockRecipes, '', '', '', '', ['Vegan', 'Gluten-Free']);
    expect(intersection.length).toBe(1);
    expect(intersection[0].name).toBe('Quick Salad');
  });

  test('combines multiple filters correctly', () => {
    // easy + vegan + lt30 -> Quick Salad and Cheap Snack
    const combined = filterRecipes(mockRecipes, '', 'lt30', 'easy', '', ['Vegan']);
    expect(combined.length).toBe(2);

    // medium + vegetarian -> Medium Pasta
    const combined2 = filterRecipes(mockRecipes, '', '', 'medium', 'under20', ['Vegetarian']);
    expect(combined2.length).toBe(1);
    expect(combined2[0].name).toBe('Medium Pasta');
  });

  test('returns empty array when no recipes match the combined filters', () => {
    const noMatch = filterRecipes(mockRecipes, '', 'lt30', 'hard', '', []);
    expect(noMatch.length).toBe(0);
  });
});
