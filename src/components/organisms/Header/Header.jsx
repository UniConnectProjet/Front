import React, { useEffect, useState } from "react";
import { Title, Image } from "../../atoms";
import userIcon from "../../../assets/svg/user.svg";
import { api } from "../../../_services/api";

export default function Header() {
  const [fullName, setFullName] = useState("Utilisateur");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const meResponse = await api.get("/me");
        const meData = typeof meResponse.data === "string" ? JSON.parse(meResponse.data) : (meResponse.data || {});
        let endpoint = "/me";
        if (meData.roles && Array.isArray(meData.roles)) {
          if (meData.roles.includes("ROLE_STUDENT")) {
            endpoint = "/me/student";
          } else if (meData.roles.includes("ROLE_PROFESSOR")) {
            endpoint = "/me/professor";
          }
        }
        const r = await api.get(endpoint);
        const d = typeof r.data === "string" ? JSON.parse(r.data) : (r.data || {});

        const safe = (v) => (typeof v === "string" && v.trim().length ? v.trim() : null);
        const byEmail = () => {
          const e = safe(d.email);
          return e && e.includes("@") ? e.split("@")[0] : null;
        };

        const display =
          safe([safe(d.name), safe(d.lastname)].filter(Boolean).join(" ")) ||
          safe(d.displayName) ||
          safe(d.fullName) ||
          byEmail() ||
          "Utilisateur";
        if (alive) setFullName(display);
      } catch {
        if (alive) setFullName("Utilisateur");
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="flex py-4 justify-between items-center ml-10">
      <Title>{fullName}</Title>
      <Image src={userIcon} alt="User" className="w-10 h-10 rounded-full hidden md:block" />
    </div>
  );
}