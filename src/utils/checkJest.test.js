import checkJest from './checkJest';

test('Result must be "Jest is available"', () => {
  expect(checkJest()).toBe('Jest is available');
});
