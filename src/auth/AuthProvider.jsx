import React from "react";
import { createContext, useContext, useEffect, useState } from "react";
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
  const handleLogout = () => {
    setUser(null);
    showToast({ text: "Session expirée. Veuillez vous reconnecter.", type: "warning", duration: 5000 });
    navigate('/', { replace: true });
  };

  // Enregistrer le callback de déconnexion pour l'intercepteur API
  useEffect(() => {
    setLogoutCallback(handleLogout);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        // 1) tente /me directement (si cookie ACCESS_TOKEN encore valide)
        let me = await api.get("/me/student").then(r => r.data).catch(() => null);
        if (!me) {
          // 2) sinon, tente un refresh (cookie REFRESH_TOKEN)
          me = await refreshSession();
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
      const me = await api.get("/me/student");
      setUser(me.data ?? null);
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
