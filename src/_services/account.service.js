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

export const accountService = {
    saveToken,
    saveRefreshToken,
    logout,
    isLogged,
};