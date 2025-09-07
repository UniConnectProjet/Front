import React from 'react';
import { render, screen } from '@testing-library/react';
import Avatar from './Avatar';

describe('Avatar', () => {
  it('renders with fallback text when no src provided', () => {
    render(<Avatar fallback="AB" />);
    expect(screen.getByText('AB')).toBeInTheDocument();
  });

  it('renders with image when src provided', () => {
    render(<Avatar src="test.jpg" alt="Test" />);
    const img = screen.getByAltText('Test');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'test.jpg');
  });

  it('applies correct size classes', () => {
    const { rerender } = render(<Avatar size="sm" />);
    expect(screen.getByRole('button')).toHaveClass('w-8', 'h-8');

    rerender(<Avatar size="lg" />);
    expect(screen.getByRole('button')).toHaveClass('w-12', 'h-12');
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Avatar onClick={handleClick} />);
    
    screen.getByRole('button').click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows fallback when image fails to load', () => {
    render(<Avatar src="invalid.jpg" fallback="FB" />);
    
    // Simuler l'erreur de chargement d'image
    const img = screen.getByAltText('');
    img.dispatchEvent(new Event('error'));
    
    expect(screen.getByText('FB')).toBeInTheDocument();
  });
});
