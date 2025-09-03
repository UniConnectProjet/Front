import React from "react";
import { Title, Image } from "../../atoms";
import userIcon from "../../../assets/svg/user.svg";
import { useAuth } from "../../../auth/AuthProvider";

export default function Header() {
  const { user } = useAuth();

  // Fonction pour construire le nom d'affichage
  const getDisplayName = () => {
    if (!user) return "Utilisateur";

    const safe = (v) => (typeof v === "string" && v.trim().length ? v.trim() : null);
    const byEmail = () => {
      const e = safe(user.email);
      return e && e.includes("@") ? e.split("@")[0] : null;
    };

    return (
      safe([safe(user.name), safe(user.lastname)].filter(Boolean).join(" ")) ||
      safe(user.displayName) ||
      safe(user.fullName) ||
      byEmail() ||
      "Utilisateur"
    );
  };

  return (
    <div className="flex py-4 justify-between items-center ml-10">
      <Title>{getDisplayName()}</Title>
      <Image src={userIcon} alt="User" className="w-10 h-10 rounded-full hidden md:block" />
    </div>
  );
}