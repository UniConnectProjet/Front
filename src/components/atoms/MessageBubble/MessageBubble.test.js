import React from 'react';
import { render, screen } from '@testing-library/react';
import MessageBubble from './MessageBubble';

const mockMessage = {
  id: 1,
  content: 'Hello world!',
  createdAt: '2023-01-01T12:00:00Z',
  sender: {
    id: 1,
    name: 'John',
    lastname: 'Doe'
  }
};

describe('MessageBubble', () => {
  it('renders message content', () => {
    render(<MessageBubble message={mockMessage} />);
    expect(screen.getByText('Hello world!')).toBeInTheDocument();
  });

  it('renders sender name for other messages', () => {
    render(<MessageBubble message={mockMessage} isOwn={false} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('renders time in correct format', () => {
    render(<MessageBubble message={mockMessage} />);
    expect(screen.getByText('12:00')).toBeInTheDocument();
  });

  it('applies correct styling for own messages', () => {
    render(<MessageBubble message={mockMessage} isOwn={true} />);
    const messageContainer = screen.getByText('Hello world!').closest('div');
    expect(messageContainer).toHaveClass('bg-blue-500', 'text-white');
  });

  it('applies correct styling for other messages', () => {
    render(<MessageBubble message={mockMessage} isOwn={false} />);
    const messageContainer = screen.getByText('Hello world!').closest('div');
    expect(messageContainer).toHaveClass('bg-gray-100', 'text-gray-900');
  });

  it('sanitizes dangerous content', () => {
    const dangerousMessage = {
      ...mockMessage,
      content: '<script>alert("xss")</script>Hello'
    };
    
    render(<MessageBubble message={dangerousMessage} />);
    expect(screen.getByText(/&lt;script&gt;alert/)).toBeInTheDocument();
    expect(screen.queryByText('<script>')).not.toBeInTheDocument();
  });

  it('shows avatar for other messages when showAvatar is true', () => {
    render(<MessageBubble message={mockMessage} isOwn={false} showAvatar={true} />);
    expect(screen.getByText('J')).toBeInTheDocument(); // Initiale du prénom
  });

  it('hides avatar for own messages', () => {
    render(<MessageBubble message={mockMessage} isOwn={true} showAvatar={true} />);
    expect(screen.queryByText('J')).not.toBeInTheDocument();
  });
});
