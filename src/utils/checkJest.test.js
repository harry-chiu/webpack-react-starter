import checkJest from './checkJest';
import '@testing-library/jest-dom';

test('Result must be "Jest is available"', () => {
  expect(checkJest()).toBe('Jest is available');
});
