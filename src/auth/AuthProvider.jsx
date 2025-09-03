import React from "react";
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { api, setLogoutCallback } from "../_services/api";
import { refreshSession } from "../_services/auth.service";
import { useToast } from "../components/molecules/ToastProvider/ToastProvider";
import { PropTypes } from "prop-types";

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

AuthProvider.propTypes = {
  children: PropTypes.node,
};
AuthConsumer.propTypes = {
  children: PropTypes.func.isRequired,
};
export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoad] = useState(true);
  const navigate = useNavigate();
  const { push: showToast } = useToast();

  // Fonction simple de déconnexion
  const handleLogout = useCallback(() => {
    setUser(null);
    showToast({ text: "Session expirée. Veuillez vous reconnecter.", type: "warning", duration: 5000 });
    navigate('/', { replace: true });
  }, [showToast, navigate]);

  // Enregistrer le callback de déconnexion pour l'intercepteur API
  useEffect(() => {
    setLogoutCallback(handleLogout);
  }, [handleLogout]);

  useEffect(() => {
    (async () => {
      try {
        // 1) Tenter de récupérer les informations de base avec les rôles
        let basicUser = await api.get("/me").then(r => r.data).catch(() => null);
        
        // 2) Si pas d'utilisateur de base, tenter un refresh
        if (!basicUser) {
          basicUser = await refreshSession();
        }
        
        // 3) Si on a un utilisateur, récupérer les informations spécifiques selon le rôle
        let me = basicUser;
        if (basicUser && basicUser.roles) {
          if (basicUser.roles.includes('ROLE_STUDENT')) {
            me = await api.get("/me/student").then(r => r.data).catch(() => basicUser);
          } else if (basicUser.roles.includes('ROLE_PROFESSOR')) {
            me = await api.get("/professors/me").then(r => r.data).catch(() => basicUser);
          }
        }
        
        setUser(me ?? null);
      } catch (error) {
        // En cas d'erreur, rediriger vers la connexion
        setUser(null);
      } finally {
        setLoad(false);
      }
    })();
  }, []);

  const login = async (email, password) => {
    try {
      await api.post("/login_check", { email: email.trim(), password }); // cookies posés
      
      // 1) Récupérer les informations de base avec les rôles
      const basicUser = await api.get("/me").then(r => r.data);
      
      // 2) Selon le rôle, récupérer les informations spécifiques
      let me = basicUser;
      if (basicUser.roles && basicUser.roles.includes('ROLE_STUDENT')) {
        me = await api.get("/me/student").then(r => r.data);
      } else if (basicUser.roles && basicUser.roles.includes('ROLE_PROFESSOR')) {
        me = await api.get("/professors/me").then(r => r.data);
      }
      
      setUser(me ?? null);
      showToast({ text: "Connexion réussie", type: "success" });
    } catch (error) {
      showToast({ text: "Erreur de connexion", type: "error" });
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    showToast({ text: "Déconnexion réussie", type: "info" });
    navigate('/', { replace: true });
  };

  return (
    <AuthCtx.Provider value={{ user, loading, login, logout, handleLogout }}>
      {children}
    </AuthCtx.Provider>
  );
}

export function AuthConsumer({ children }) {
  const auth = useAuth();
  if (!auth) throw new Error("AuthConsumer must be used within AuthProvider");
  return children(auth);
} 
