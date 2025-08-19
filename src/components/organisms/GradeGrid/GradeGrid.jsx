import React, { useEffect, useMemo, useState } from "react";
import { GradeCard } from "../../molecules";
import { Title, OverallAverage } from "../../atoms";
import { api } from "../../../_services/api";

const toJson = (raw) =>
  typeof raw === "string"
    ? (() => { try { return JSON.parse(raw); } catch { return null; } })()
    : raw;

const buildCourseCards = (raw) => {
  const data = toJson(raw) || {};
  const grades = Array.isArray(data.grades) ? data.grades : [];
  const byCourse = new Map();
  grades.forEach((g) => {
    const name = g?.course?.name;
    const avg  = Number(g?.course?.average);
    if (!name) return;
    if (!byCourse.has(name)) byCourse.set(name, avg);
  });
  return Array.from(byCourse.entries()).map(([name, avg]) => ({
    title: name,
    score: Number.isFinite(avg) ? avg : 0,
    total: 20,
  }));
};

const computeOverall20 = (items) =>
  !items?.length
    ? 0
    : Number(((items.reduce((a,x)=>a+(x.total?x.score/x.total:0),0)/items.length)*20).toFixed(2));

export default function GradeGrid() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    (async () => {
      setLoading(true); setError(null);
      try {
        const res = await api.get('/me/grades');
        if (!ignore) setItems(buildCourseCards(res?.data));
      } catch (e) {
        if (!ignore) setError("Impossible de charger les notes.");
        console.error("GET /me/grades", e?.response?.status, e?.response?.data);
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, []);

  const overall = useMemo(() => computeOverall20(items), [items]);

  return (
    <div className="flex flex-col w-full lg:w-3/5 p-4 bg-gray-100 rounded-lg shadow-md">
      <Title className="text-buttonColor-500 text-lg mb-2">Notes :</Title>
      {loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="animate-pulse h-28 bg-gray-200 rounded-lg" />)}
        </div>
      )}
      {error && <p className="text-red-600 text-sm">{error}</p>}
      {!error && !loading && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(items || []).map((g,i) => (
              <GradeCard key={i} title={g.title} score={+g.score} total={+g.total} />
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
}