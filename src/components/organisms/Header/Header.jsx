import React, { useEffect, useState } from "react";
import axios from "axios";
import { Title, Image } from "../../atoms";
import userIcon from "../../../assets/svg/user.svg";
import { accountService } from "../../../_services/account.service";

const BASE_URL = "http://localhost:8000/api";

const Header = () => {
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    let ignore = false;

    const token =
      accountService.getToken?.() ||
      (typeof localStorage !== "undefined" ? localStorage.getItem("token") : null);
    if (!token) return;

    const auth = { headers: { Authorization: `Bearer ${token}` } };

    const pickName = (student) => {
      // le nom peut être au root ou dans student.user
      const src = student?.user ?? student ?? {};
      const first =
        src.firstName ?? src.firstname ?? src.name ?? "";
      const last =
        src.lastName ?? src.lastname ?? "";
      const display = `${first} ${last ? String(last).toUpperCase() : ""}`.trim();
      return display || "Utilisateur";
    };

    const resolveStudentId = async () => {
      const cached = accountService.getStudentId?.();
      if (cached) return cached;
      try {
        const r = await axios.get(`${BASE_URL}/me/student`, auth);
        const sid = r?.data?.id ?? null;
        if (sid) accountService.saveStudentId?.(sid);
        return sid;
      } catch {
        return null;
      }
    };

    (async () => {
      const studentId = await resolveStudentId();
      if (!studentId) return;
      try {
        const { data } = await axios.get(`${BASE_URL}/students/${studentId}`, auth);
        const student = typeof data === "string" ? JSON.parse(data) : data;
        if (!ignore) setFullName(pickName(student));
      } catch {
        if (!ignore) setFullName("Utilisateur");
      }
    })();

    return () => { ignore = true; };
  }, []);

  return (
    <div className="flex py-4 justify-between items-center ml-10">
      <Title>{fullName}</Title>
      <Image src={userIcon} alt="User" className="w-10 h-10 rounded-full hidden md:block" />
    </div>
  );
};

export default Header;