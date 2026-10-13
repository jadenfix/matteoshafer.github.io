import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import App from './App';

beforeEach(() => {
  window.location.hash = '';
});

test('shows portfolio navigation and opens a deep-linked research page', async () => {
  window.location.hash = '/nlp';
  render(<App />);
  expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '#/');
  expect(screen.getByRole('link', { name: 'NLP' })).toHaveAttribute('href', '#/nlp');
  expect(screen.getByRole('heading', { name: 'N-Gram Language Model for Next-Word Prediction' })).toBeInTheDocument();
  await waitFor(() => expect(document.title).toBe('NLP language model · Jaden Fix'));
});

test('exposes every checked-in research route from the archive index', () => {
  render(<App />);
  const projectIndex = screen.getByRole('heading', { name: 'Research project index' }).closest('section');
  expect(within(projectIndex).getByRole('link', { name: /Master's thesis/ })).toHaveAttribute('href', '#/masters-thesis');
  expect(within(projectIndex).getByRole('link', { name: /Predictive stochastic/ })).toHaveAttribute('href', '#/predictive-stochastic');
  expect(within(projectIndex).getByRole('link', { name: /Solana tools/ })).toHaveAttribute('href', '#/solana-tools');
  expect(within(projectIndex).getByRole('link', { name: /^NLP/ })).toHaveAttribute('href', '#/nlp');
  expect(within(projectIndex).getByRole('link', { name: /Bayesian CNN/ })).toHaveAttribute('href', '#/bayesian-cnn');
});

test('recovers an unknown saved route without a blank page', () => {
  window.location.hash = '/old-project';
  render(<App />);
  expect(screen.getByRole('heading', { name: 'This archive page does not exist' })).toBeInTheDocument();
  expect(screen.getByText('/old-project')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('link', { name: 'Return to the verified archive index' }));
  expect(screen.getByRole('heading', { name: 'Research project index' })).toBeInTheDocument();
});

test('moves focus to content after client-side navigation', async () => {
  render(<App />);
  fireEvent.click(screen.getByRole('link', { name: 'NLP' }));
  await waitFor(() => expect(document.getElementById('research-content')).toHaveFocus());
});

test('discloses the archive verification boundary', () => {
  render(<App />);
  expect(screen.getByRole('complementary', { name: 'Archive scope' })).toHaveTextContent("outside this archive's verification scope");
});
