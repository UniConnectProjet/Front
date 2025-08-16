import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { GradeCard } from "../../molecules";
import { Title, OverallAverage } from "../../atoms";
import { accountService } from "../../../_services/account.service";

const BASE_URL = "http://localhost:8000/api";

// parse défensif si la réponse arrive en string
const toJson = (raw) => (typeof raw === "string" ? (() => { try { return JSON.parse(raw); } catch { return null; } })() : raw);

// construit les cartes à partir de /api/students/:id/grades
// -> 1 item par cours: { title: course.name, score: course.average, total: 20 }
const buildCourseCards = (raw) => {
  const data = toJson(raw) || {};
  const grades = Array.isArray(data.grades) ? data.grades : [];

  const byCourse = new Map();
  grades.forEach(g => {
    const name = g?.course?.name;
    const avg  = Number(g?.course?.average);
    if (!name) return;
    // si plusieurs entrées pour le même cours, on garde la moyenne fournie
    if (!byCourse.has(name)) byCourse.set(name, avg);
  });

  return Array.from(byCourse.entries()).map(([name, avg]) => ({
    title: name,
    score: Number.isFinite(avg) ? avg : 0,
    total: 20,
  }));
};

// moyenne générale = moyenne des moyennes de cours
const computeOverall20 = (items) => {
  if (!items?.length) return 0;
  const m = items.reduce((a, x) => a + (x.total ? x.score / x.total : 0), 0) / items.length;
  return Number((m * 20).toFixed(2));
};

const GradeGrid = () => {
  // id depuis localStorage (sauvé au login) -> fallback route -> fallback JWT
  const { id: idFromRoute } = useParams();
  const storedId  = accountService.getUserId?.() || null;
  const jwtId     = accountService.getUserIdFromToken?.() || null;
  const studentId = storedId || idFromRoute || jwtId || null;

  const token = accountService.getToken?.() || (typeof localStorage !== "undefined" ? localStorage.getItem("token") : null);

  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) { setError("Session absente ou expirée."); return; }
    if (!studentId) { setError("Aucun étudiant identifié."); return; }

    let ignore = false;

    (async () => {
      try {
        // ✅ bon endpoint
        const res = await axios.get(`${BASE_URL}/students/${studentId}/grades`, {
          headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        });
        const cards = buildCourseCards(res?.data);
        if (!ignore) setItems(cards);
      } catch (e) {
        console.error("GET /students/:id/grades failed:", e?.response?.status, e?.response?.data);
        if (!ignore) setError("Impossible de charger les notes.");
      }
    })();

    return () => { ignore = true; };
  }, [studentId, token]);

  const overall = useMemo(() => computeOverall20(items), [items]);

  // ⚠️ TON MARKUP / CSS conservés
  return (
    <div className="flex flex-col p-4 w-3/5 bg-gray-100 rounded-lg shadow-md ml-20">
      <Title className=" text-buttonColor-500 text-lg">Notes : </Title>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      {!error && (
        <>
          <div className="grid grid-cols-2">
            {(items || []).map((grade, index) => (
              <GradeCard
                key={index}
                title={grade.title}
                score={Number(grade.score)}
                total={Number(grade.total)}
              />
            ))}
          </div>

          <OverallAverage
            score={overall}
            titleOverallAverage="Moyenne générale :"
            total={20}
            className="flex justify-between items-center border p-2 bg-white border-primary-300"
          />
        </>
      )}
    </div>
  );
};

export default GradeGrid;