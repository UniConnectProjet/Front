import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import PropTypes from "prop-types";

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
  roles: PropTypes.arrayOf(PropTypes.string),
};
export default function PrivateRoute({ children, roles }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  const normalize = (val) => {
    const out = new Set();
    if (!val) return out;
    const push = (s) => {
      if (typeof s !== "string") return;
      const clean = s.trim().toUpperCase();
      if (!clean) return;
      out.add(clean);
      out.add(clean.replace(/^ROLE_/, ""));
    };
    if (Array.isArray(val)) {
      val.forEach((v) => {
        if (typeof v === "string") push(v);
        else if (v && typeof v === "object") {
          if (typeof v.authority === "string") push(v.authority);
          else if (typeof v.name === "string") push(v.name);
          else if (typeof v.role === "string") push(v.role);
        }
      });
    } else if (typeof val === "object") {
      if (typeof val.role === "string") push(val.role);
      if (typeof val.name === "string") push(val.name);
      if (Array.isArray(val.authorities)) {
        const nested = normalize(val.authorities);
        nested.forEach((x) => out.add(x));
      }
    } else if (typeof val === "string") {
      val.split(/[,\s]+/).forEach(push);
    }
    return out;
  };

  const allUserRoles = new Set();
  [user?.roles, user?.authorities, user?.permissions, user?.role].forEach((r) => {
    const s = normalize(r);
    s.forEach((x) => allUserRoles.add(x));
  });

  const requiredRoles = normalize(roles);

  if (loading) return null;

  if (!user) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  if (requiredRoles.size > 0) {
    const hasSome = Array.from(requiredRoles).some((r) => allUserRoles.has(r));
    if (!hasSome) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
}
