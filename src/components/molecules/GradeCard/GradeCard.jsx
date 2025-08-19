// src/components/molecules/GradeCard/GradeCard.jsx
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { Grade, Average } from '../../atoms';
import { api } from '../../../_services/api';
import { useAuth } from '../../../auth/AuthProvider';

const GradeCard = ({ title, score, total, idStudent, className = '' }) => {
  const { id: idFromRoute } = useParams();
  const { user } = useAuth();

  // états UI
  const [scoreValue, setScoreValue] = useState(score ?? null);
  const [totalValue, setTotalValue] = useState(total ?? 20);
  const [titleGradeValue, setTitleGradeValue] = useState(title ?? '');
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // priorité: prop -> route -> user (si dispo) -> /me/student
  const preferedId = idStudent ?? idFromRoute ?? user?.studentId ?? null;

  useEffect(() => {
    let cancelled = false;

    const resolveStudentId = async () => {
      if (preferedId) return String(preferedId);
      try {
        const r = await api.get('/me/student');
        return r?.data?.id ? String(r.data.id) : null;
      } catch {
        return null;
      }
    };

    (async () => {
      setIsLoading(true);
      setError(null);

      const sid = await resolveStudentId();
      if (!sid) {
        if (!cancelled) { setError("Aucun étudiant identifié."); setIsLoading(false); }
        return;
      }

      try {
        const res = await api.get(`/me/grades`);
        const data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
        const all  = Array.isArray(data?.grades) ? data.grades : [];

        const lcTitle = String(title).toLowerCase();
        const matches = all.filter(
          g => String(g?.course?.name ?? '').toLowerCase() === lcTitle
        );

        const evals = matches.map(g => ({
          label: g?.title ?? 'Évaluation',
          score: Number(g?.grade ?? 0),
          total: Number(g?.dividor ?? 20),
        }));

        const avg20 =
          matches[0]?.course?.average != null
            ? Number(matches[0].course.average)
            : (evals.length
                ? Number(
                    (
                      evals.reduce((a, x) => a + (x.total ? x.score / x.total : 0), 0) /
                      evals.length
                    ) * 20
                  .toFixed(2))
                : 0);

        if (!cancelled) {
          setRows(evals);
          if (score == null) setScoreValue(avg20);
          if (total == null) setTotalValue(20);
          setTitleGradeValue(title);
        }
      } catch (e) {
        if (!cancelled) setError("Impossible de récupérer les notes");
        console.error('GradeCard fetch error:', e?.response?.status, e?.response?.data);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [preferedId, title, score, total]);

  return (
    <div className={`flex flex-col w-2/3 p-2 ${className}`}>
      {isLoading && (
        <>
          <div className="animate-pulse h-6 w-1/2 bg-gray-200 mb-2" />
          <div className="animate-pulse h-16 bg-gray-100" />
        </>
      )}
      {!isLoading && error && <p className="text-red-600 text-sm">{error}</p>}
      {!isLoading && !error && (
        <>
          <Average
            score={Number(scoreValue ?? 0)}
            titleAverage={titleGradeValue || title}
            total={Number(totalValue ?? 20)}
            className="flex justify-between items-center pb-2 border-b border-black"
          />
          <div className="mt-2">
            {rows.map((r, i) => (
              <Grade
                key={`${title}-${i}`}
                titleGrade={r.label}
                score={r.score}
                total={r.total}
                className="flex items-center p-4 justify-between"
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

GradeCard.propTypes = {
  title: PropTypes.string.isRequired,
  score: PropTypes.number,
  total: PropTypes.number,
  idStudent: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  className: PropTypes.string,
};

export default GradeCard;