import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TokenGatedDemoPage from './asset2page';

// Mock the next/link component
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

// Mock the react-icons
jest.mock('react-icons/fi', () => ({
  FiLock: () => <div data-testid="fi-lock-icon" />,
  FiCoffee: () => <div data-testid="fi-coffee-icon" />,
  FiArrowLeft: () => <div data-testid="fi-arrow-left-icon" />,
}));

describe('TokenGatedDemoPage', () => {
  it('renders without crashing', () => {
    render(<TokenGatedDemoPage />);
    expect(screen.getByText('Welcome to the Littefish Token Access Demo')).toBeInTheDocument();
  });

  it('displays the correct title', () => {
    render(<TokenGatedDemoPage />);
    const title = screen.getByText('Welcome to the Littefish Token Access Demo');
    expect(title).toBeInTheDocument();
    expect(title.tagName).toBe('H1');
  });

  it('displays the correct subtitle', () => {
    render(<TokenGatedDemoPage />);
    expect(screen.getByText('This page is only accessible to holders of HOSKY.')).toBeInTheDocument();
  });

  it('renders the back to home link', () => {
    render(<TokenGatedDemoPage />);
    const backLink = screen.getByText('Back to Home');
    expect(backLink).toBeInTheDocument();
    expect(backLink.closest('a')).toHaveAttribute('href', '/');
  });

  it('renders the correct number of FeatureCards', () => {
    render(<TokenGatedDemoPage />);
    const featureCards = screen.getAllByRole('heading', { level: 3 });
    expect(featureCards).toHaveLength(2);
  });

  it('renders the Exclusive Content FeatureCard', () => {
    render(<TokenGatedDemoPage />);
    expect(screen.getByText('Exclusive Content')).toBeInTheDocument();
    expect(screen.getByText("Access for token holders only. You can gate different pages based on the user's token collection.")).toBeInTheDocument();
    expect(screen.getByTestId('fi-coffee-icon')).toBeInTheDocument();
  });

  it('renders the Secure Access FeatureCard', () => {
    render(<TokenGatedDemoPage />);
    expect(screen.getByText('Secure Access')).toBeInTheDocument();
    expect(screen.getByText('Your exclusive access is secured by blockchain technology.')).toBeInTheDocument();
    expect(screen.getByTestId('fi-lock-icon')).toBeInTheDocument();
  });

  it('applies the correct CSS classes', () => {
    render(<TokenGatedDemoPage />);
    const mainDiv = screen.getByText('Welcome to the Littefish Token Access Demo').closest('div');
    expect(mainDiv).toHaveClass('text-center mb-12');
  });
});