import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ConversationItem from './ConversationItem';

const mockConversation = {
  id: 1,
  title: 'Test Conversation',
  participants: [
    {
      id: 2,
      name: 'Jane',
      lastname: 'Smith',
      avatar: 'avatar.jpg'
    }
  ],
  lastMessage: {
    content: 'Hello there!',
    createdAt: '2023-01-01T12:00:00Z'
  },
  unreadCount: 2
};

describe('ConversationItem', () => {
  it('renders conversation title', () => {
    render(<ConversationItem conversation={mockConversation} />);
    expect(screen.getByText('Test Conversation')).toBeInTheDocument();
  });

  it('renders last message content', () => {
    render(<ConversationItem conversation={mockConversation} />);
    expect(screen.getByText('Hello there!')).toBeInTheDocument();
  });

  it('renders unread count badge', () => {
    render(<ConversationItem conversation={mockConversation} />);
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('applies active styling when isActive is true', () => {
    render(<ConversationItem conversation={mockConversation} isActive={true} />);
    const item = screen.getByText('Test Conversation').closest('div');
    expect(item).toHaveClass('bg-blue-50', 'border-l-4', 'border-l-blue-500');
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<ConversationItem conversation={mockConversation} onClick={handleClick} />);
    
    fireEvent.click(screen.getByText('Test Conversation'));
    expect(handleClick).toHaveBeenCalledWith(mockConversation);
  });

  it('renders participant name when no title', () => {
    const conversationWithoutTitle = {
      ...mockConversation,
      title: null
    };
    
    render(<ConversationItem conversation={conversationWithoutTitle} />);
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('renders "Aucun message" when no last message', () => {
    const conversationWithoutMessage = {
      ...mockConversation,
      lastMessage: null
    };
    
    render(<ConversationItem conversation={conversationWithoutMessage} />);
    expect(screen.getByText('Aucun message')).toBeInTheDocument();
  });

  it('truncates long messages', () => {
    const longMessage = {
      ...mockConversation,
      lastMessage: {
        content: 'This is a very long message that should be truncated because it exceeds the maximum length allowed for display in the conversation list',
        createdAt: '2023-01-01T12:00:00Z'
      }
    };
    
    render(<ConversationItem conversation={longMessage} />);
    const messageText = screen.getByText(/This is a very long message/);
    expect(messageText.textContent).toContain('...');
  });
});
