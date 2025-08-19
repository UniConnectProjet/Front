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
        const r = await api.get("/me");
        const d = typeof r.data === "string" ? JSON.parse(r.data) : r.data;

        const first = d?.firstName ?? d?.firstname ?? d?.name ?? null;    
        const last  = d?.lastName  ?? d?.lastname  ?? null;

        let name = [first, last].filter(Boolean).join(" ").trim();
        if (!name) {
          const email = d?.email || "";
          name = email.includes("@") ? email.split("@")[0] : "Utilisateur";
        }
        if (alive) setFullName(name);
      } catch {
        if (alive) setFullName("Utilisateur");
      }
    })();
    return () => { alive = false; };
  }, []);

  return (
    <div className="flex py-4 justify-between items-center ml-10">
      <Title>{fullName}</Title>
      <Image src={userIcon} alt="User" className="w-10 h-10 rounded-full hidden md:block" />
    </div>
  );
}