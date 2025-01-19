import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App'; // Adjust the path if necessary

test('renders the App component', () => {
  render(<App />);
  expect(screen.getByText(/welcome/i)).toBeInTheDocument(); // Adjust based on actual text in App
});