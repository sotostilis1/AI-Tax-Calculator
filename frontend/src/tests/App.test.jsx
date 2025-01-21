import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';

test('renders the App component', () => {
  render(<App />);
  expect(screen.getByText(/welcome/i)).toBeInTheDocument();
});