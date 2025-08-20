import React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../_services/api";
import { refreshSession } from "../_services/auth.service";
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

  useEffect(() => {
    (async () => {
      // 1) tente /me directement (si cookie ACCESS_TOKEN encore valide)
      let me = await api.get("/me/student").then(r => r.data).catch(() => null);
      if (!me) {
        // 2) sinon, tente un refresh (cookie REFRESH_TOKEN)
        me = await refreshSession();
      }
      setUser(me ?? null);
      setLoad(false);
    })();
  }, []);

  const login = async (email, password) => {
    await api.post("/login_check", { email: email.trim(), password }); // cookies posés
    const me = await api.get("/me/student");
    setUser(me.data ?? null);
  };

  const logout = () => {
    // tu peux ajouter un endpoint pour invalider côté serveur si tu veux
    setUser(null);
  };

  return (
    <AuthCtx.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}

export function AuthConsumer({ children }) {
  const auth = useAuth();
  if (!auth) throw new Error("AuthConsumer must be used within AuthProvider");
  return children(auth);
} 
