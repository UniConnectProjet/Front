import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { GradeCard } from "../../molecules";
import { Title, OverallAverage } from "../../atoms";
import { accountService } from "../../../_services/account.service";

const BASE_URL = "http://localhost:8000/api";

// parse défensif si la réponse arrive en string
const toJson = (raw) =>
  typeof raw === "string"
    ? (() => {
        try {
          return JSON.parse(raw);
        } catch {
          return null;
        }
      })()
    : raw;

const buildCourseCards = (raw) => {
  const data = toJson(raw) || {};
  const grades = Array.isArray(data.grades) ? data.grades : [];

  const byCourse = new Map();
  grades.forEach((g) => {
    const name = g?.course?.name;
    const avg = Number(g?.course?.average);
    if (!name) return;
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
  const m =
    items.reduce((a, x) => a + (x.total ? x.score / x.total : 0), 0) /
    items.length;
  return Number((m * 20).toFixed(2));
};

const GradeGrid = () => {
  // id depuis localStorage (sauvé au login) -> fallback route -> fallback JWT
  const { id: idFromRoute } = useParams();
  const storedId = accountService.getUserId?.() || null;
  const jwtId = accountService.getUserIdFromToken?.() || null;
  const studentId = storedId || idFromRoute || jwtId || null;

  const token =
    accountService.getToken?.() ||
    (typeof localStorage !== "undefined"
      ? localStorage.getItem("token")
      : null);

  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setError("Session absente ou expirée.");
      setLoading(false);
      return;
    }
    if (!studentId) {
      setError("Aucun étudiant identifié.");
      setLoading(false);
      return;
    }

    let ignore = false;

    (async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${BASE_URL}/students/${studentId}/grades`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );
        const cards = buildCourseCards(res?.data);
        if (!ignore) setItems(cards);
      } catch (e) {
        console.error(
          "GET /students/:id/grades failed:",
          e?.response?.status,
          e?.response?.data
        );
        if (!ignore) setError("Impossible de charger les notes.");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, [studentId, token]);

  const overall = useMemo(() => computeOverall20(items), [items]);
  return (
    <div className="flex flex-col w-full lg:w-3/5 p-4 bg-gray-100 rounded-lg shadow-md">
      <Title className="text-buttonColor-500 text-lg mb-2">Notes :</Title>

      {loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse h-28 bg-gray-200 rounded-lg" />
          ))}
        </div>
      )}

      {error && <p className="text-red-600 text-sm">{error}</p>}

      {!error && !loading && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(items || []).map((grade, index) => (
              <GradeCard
                key={index}
                title={grade.title}
                score={Number(grade.score)}
                total={Number(grade.total)}
              />
            ))}
          </div>

          <div className="mt-4">
            <OverallAverage
              score={overall}
              titleOverallAverage="Moyenne générale :"
              total={20}
              className="flex justify-between items-center border p-2 bg-white border-primary-300"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default GradeGrid;