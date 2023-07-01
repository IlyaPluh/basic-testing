import { simpleCalculator, Action } from './index';

describe('simpleCalculator tests', () => {
  const testCases = [
    { a: 4, b: 2, action: Action.Add, expected: 6 },
    { a: 4, b: 2, action: Action.Subtract, expected: 2 },
    { a: 4, b: 2, action: Action.Multiply, expected: 8 },
    { a: 4, b: 2, action: Action.Divide, expected: 2 },
    { a: 4, b: 2, action: Action.Exponentiate, expected: 16 },
    { a: 5, b: 3, action: 'InvalidAction' as Action, expected: null },
    { a: '5', b: 3, action: Action.Add, expected: null },
  ];

  testCases.forEach(({ a, b, action, expected }) => {
    test(`should ${a} and ${b} to be ${expected}`, () => {
      const input = { a, b, action };
      const result = simpleCalculator(input);
      expect(result).toBe(expected);
    });
  });
});
