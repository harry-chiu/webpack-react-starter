import * as React from 'react';
import { render } from '@testing-library/react';
import App from './index';
import '@testing-library/jest-dom';

test('Show "Webpack React Template"', () => {
  const { queryByText } = render(<App />);

  expect(queryByText('Webpack React Template')).toBeInTheDocument();
});
