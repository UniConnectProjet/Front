import { 
  sanitizeText, 
  sanitizeHtml, 
  validateMessageContent, 
  validateConversationData,
  validateNotificationData 
} from './sanitization';

describe('sanitization utils', () => {
  describe('sanitizeText', () => {
    it('escapes HTML characters', () => {
      expect(sanitizeText('<script>alert("xss")</script>')).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
    });

    it('handles empty string', () => {
      expect(sanitizeText('')).toBe('');
    });

    it('handles non-string input', () => {
      expect(sanitizeText(null)).toBe('');
      expect(sanitizeText(undefined)).toBe('');
      expect(sanitizeText(123)).toBe('');
    });
  });

  describe('sanitizeHtml', () => {
    it('allows safe HTML tags', () => {
      const input = '<p>Hello <strong>world</strong>!</p>';
      const result = sanitizeHtml(input);
      expect(result).toContain('<p>');
      expect(result).toContain('<strong>');
      expect(result).toContain('Hello world!');
    });

    it('removes dangerous tags', () => {
      const input = '<script>alert("xss")</script><p>Hello</p>';
      const result = sanitizeHtml(input);
      expect(result).not.toContain('<script>');
      expect(result).toContain('<p>Hello</p>');
    });

    it('handles empty input', () => {
      expect(sanitizeHtml('')).toBe('');
      expect(sanitizeHtml(null)).toBe('');
    });
  });

  describe('validateMessageContent', () => {
    it('validates correct message content', () => {
      const result = validateMessageContent('Hello world!');
      expect(result.isValid).toBe(true);
    });

    it('rejects empty content', () => {
      const result = validateMessageContent('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Le message ne peut pas être vide');
    });

    it('rejects content that is too long', () => {
      const longContent = 'a'.repeat(2001);
      const result = validateMessageContent(longContent);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Le message ne peut pas dépasser 2000 caractères');
    });

    it('rejects content with script tags', () => {
      const result = validateMessageContent('<script>alert("xss")</script>');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Le message contient du contenu non autorisé');
    });

    it('rejects non-string input', () => {
      const result = validateMessageContent(123);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Le contenu doit être une chaîne de caractères');
    });
  });

  describe('validateConversationData', () => {
    it('validates correct conversation data', () => {
      const data = {
        participantIds: [1, 2],
        title: 'Test Conversation'
      };
      const result = validateConversationData(data);
      expect(result.isValid).toBe(true);
    });

    it('rejects empty participantIds', () => {
      const data = {
        participantIds: [],
        title: 'Test'
      };
      const result = validateConversationData(data);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Au moins un participant est requis');
    });

    it('rejects invalid title type', () => {
      const data = {
        participantIds: [1, 2],
        title: 123
      };
      const result = validateConversationData(data);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Le titre doit être une chaîne de caractères');
    });

    it('rejects title that is too long', () => {
      const data = {
        participantIds: [1, 2],
        title: 'a'.repeat(256)
      };
      const result = validateConversationData(data);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Le titre ne peut pas dépasser 255 caractères');
    });
  });

  describe('validateNotificationData', () => {
    it('validates correct notification data', () => {
      const data = {
        title: 'Test Notification',
        content: 'Test content'
      };
      const result = validateNotificationData(data);
      expect(result.isValid).toBe(true);
    });

    it('rejects empty title', () => {
      const data = {
        title: '',
        content: 'Test content'
      };
      const result = validateNotificationData(data);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Le titre de la notification est requis');
    });

    it('rejects title that is too long', () => {
      const data = {
        title: 'a'.repeat(256),
        content: 'Test content'
      };
      const result = validateNotificationData(data);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Le titre ne peut pas dépasser 255 caractères');
    });
  });
});
