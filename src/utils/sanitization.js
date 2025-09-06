// Utilitaire de sanitization pour prévenir les attaques XSS
export const sanitizeHtml = (html) => {
  if (typeof html !== 'string') return '';
  
  // Liste des balises autorisées
  const allowedTags = ['p', 'br', 'strong', 'em', 'u', 'span'];
  const allowedAttributes = ['class', 'style'];
  
  // Créer un élément temporaire pour parser le HTML
  const temp = document.createElement('div');
  temp.innerHTML = html;
  
  // Fonction récursive pour nettoyer les éléments
  const cleanElement = (element) => {
    if (element.nodeType === Node.TEXT_NODE) {
      return element.textContent;
    }
    
    if (element.nodeType === Node.ELEMENT_NODE) {
      const tagName = element.tagName.toLowerCase();
      
      if (!allowedTags.includes(tagName)) {
        // Remplacer par du texte simple
        return element.textContent;
      }
      
      // Nettoyer les attributs
      const cleanAttrs = {};
      allowedAttributes.forEach(attr => {
        if (element.hasAttribute(attr)) {
          cleanAttrs[attr] = element.getAttribute(attr);
        }
      });
      
      // Créer un nouvel élément propre
      const cleanElement = document.createElement(tagName);
      Object.entries(cleanAttrs).forEach(([key, value]) => {
        cleanElement.setAttribute(key, value);
      });
      
      // Nettoyer les enfants
      Array.from(element.childNodes).forEach(child => {
        const cleanChild = cleanElement(child);
        if (cleanChild) {
          cleanElement.appendChild(cleanChild);
        }
      });
      
      return cleanElement;
    }
    
    return null;
  };
  
  // Nettoyer tous les éléments
  const cleanNodes = Array.from(temp.childNodes).map(cleanElement).filter(Boolean);
  
  // Créer un nouveau conteneur
  const cleanContainer = document.createElement('div');
  cleanNodes.forEach(node => {
    if (typeof node === 'string') {
      cleanContainer.appendChild(document.createTextNode(node));
    } else {
      cleanContainer.appendChild(node);
    }
  });
  
  return cleanContainer.innerHTML;
};

// Sanitization simple pour les messages texte
export const sanitizeText = (text) => {
  if (typeof text !== 'string') return '';
  
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

// Validation du contenu des messages
export const validateMessageContent = (content) => {
  if (typeof content !== 'string') {
    return { isValid: false, error: 'Le contenu doit être une chaîne de caractères' };
  }
  
  if (content.trim().length === 0) {
    return { isValid: false, error: 'Le message ne peut pas être vide' };
  }
  
  if (content.length > 2000) {
    return { isValid: false, error: 'Le message ne peut pas dépasser 2000 caractères' };
  }
  
  // Vérifier les patterns suspects
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
    /<link/i,
    /<meta/i
  ];
  
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(content)) {
      return { isValid: false, error: 'Le message contient du contenu non autorisé' };
    }
  }
  
  return { isValid: true };
};

// Nettoyage des URLs
export const sanitizeUrl = (url) => {
  if (typeof url !== 'string') return '';
  
  try {
    const parsedUrl = new URL(url);
    
    // Vérifier que c'est un protocole autorisé
    const allowedProtocols = ['http:', 'https:', 'mailto:'];
    if (!allowedProtocols.includes(parsedUrl.protocol)) {
      return '';
    }
    
    return parsedUrl.toString();
  } catch {
    return '';
  }
};

// Échapper les caractères spéciaux pour les expressions régulières
export const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// Validation des données de conversation
export const validateConversationData = (data) => {
  const errors = [];
  
  if (!Array.isArray(data.participantIds) || data.participantIds.length === 0) {
    errors.push('Au moins un participant est requis');
  }
  
  if (data.title && typeof data.title !== 'string') {
    errors.push('Le titre doit être une chaîne de caractères');
  }
  
  if (data.title && data.title.length > 255) {
    errors.push('Le titre ne peut pas dépasser 255 caractères');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Validation des données de notification
export const validateNotificationData = (data) => {
  const errors = [];
  
  if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
    errors.push('Le titre de la notification est requis');
  }
  
  if (data.title && data.title.length > 255) {
    errors.push('Le titre ne peut pas dépasser 255 caractères');
  }
  
  if (data.content && typeof data.content !== 'string') {
    errors.push('Le contenu doit être une chaîne de caractères');
  }
  
  if (data.content && data.content.length > 1000) {
    errors.push('Le contenu ne peut pas dépasser 1000 caractères');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
