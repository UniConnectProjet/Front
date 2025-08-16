// Vérifie si localStorage est disponible
const isLocalStorageAvailable = () => {
    try {
        localStorage.setItem('_test', '_test');
        localStorage.removeItem('_test');
        return true;
    } catch (e) {
        return false;
    }
};

let saveToken = (token) => {
    if (isLocalStorageAvailable()) {
        localStorage.setItem('token', token);
    } else {
        console.error('localStorage is not available.');
    }
};

let saveRefreshToken = (refreshToken) => {
    if (isLocalStorageAvailable()) {
        localStorage.setItem('refreshToken', refreshToken);
    } else {
        console.error('localStorage is not available.');
    }
};

let logout = () => {
    if (isLocalStorageAvailable()) {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
    } else {
        console.error('localStorage is not available.');
    }
};

let isLogged = () => {
    if (isLocalStorageAvailable()) {
        let token = localStorage.getItem('token');
        // !! transforme n'importe quelle variable en un boolean
        return !!token;
    } else {
        console.error('localStorage is not available.');
        return false;
    }
};

let getToken = () => {
  if (isLocalStorageAvailable()) return localStorage.getItem('token') || null;
  return null;
};

// Decode très simple du payload JWT (base64url)
let getTokenPayload = () => {
  const t = getToken();
  if (!t) return null;
  const parts = t.split('.');
  if (parts.length < 2) return null;
  try {
    const json = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json);
  } catch {
    return null;
  }
};

// Essaye différents champs usuels: id | userId | sub
let getUserIdFromToken = () => {
  const p = getTokenPayload();
  if (!p) return null;
  return p.id ?? p.userId ?? p.sub ?? null;
};

let saveUserId = (id) => {
  if (isLocalStorageAvailable()) localStorage.setItem('userId', String(id));
};

let getUserId = () => {
  if (isLocalStorageAvailable()) return localStorage.getItem('userId');
  return null;
};

// (optionnel mais utile) si sub du JWT est un email, on l’ignore
let getUserIdFromTokenSafe = () => {
  const p = getTokenPayload();
  if (!p) return null;
  const maybe = p.id ?? p.userId ?? p.uid ?? p.user?.id ?? p.sub;
  return /^\d+$/.test(String(maybe)) ? String(maybe) : null;
};

export const accountService = {
    saveToken,
    saveRefreshToken,
    logout,
    isLogged,
    getToken,        
    getTokenPayload,  
    getUserIdFromToken,
    saveUserId,
    getUserId,
    getUserIdFromTokenSafe,
};