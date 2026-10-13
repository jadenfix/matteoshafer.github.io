import { render, screen } from '@testing-library/react';
import App from './App';

test('shows portfolio navigation and opens research pages', () => {
  window.location.hash = '/nlp';
  render(<App />);
  expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '#/');
  expect(screen.getByRole('link', { name: 'NLP' })).toHaveAttribute('href', '#/nlp');
  expect(screen.getByRole('heading', { name: 'N-Gram Language Model for Next-Word Prediction' })).toBeInTheDocument();
});
