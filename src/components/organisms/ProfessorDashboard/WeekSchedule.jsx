import React, { useState, useEffect } from 'react';
import { BookOpen } from 'lucide-react';
import { getWeekSessions } from '../../../_services/professor.service';
import { LoadingSpinner, EmptyState } from '../../atoms';
import { WeekScheduleGrid } from '../../molecules';

const WeekSchedule = () => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadWeekSessions();
    }, []);

    const loadWeekSessions = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getWeekSessions();
            setSessions(data || []);
        } catch (err) {
            console.error('Erreur lors du chargement des séances de la semaine:', err);
            setError('Impossible de charger l\'emploi du temps');
        } finally {
            setLoading(false);
        }
    };



    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Emploi du temps de la semaine</h3>
                <LoadingSpinner size="medium" text="Chargement..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Emploi du temps de la semaine</h3>
                <EmptyState
                    title="Erreur de chargement"
                    description={error}
                    action={
                        <button 
                            onClick={loadWeekSessions}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Réessayer
                        </button>
                    }
                />
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Emploi du temps de la semaine</h3>
            
            {sessions.length === 0 ? (
                <EmptyState
                    icon={BookOpen}
                    title="Aucune séance programmée"
                    description="Aucune séance programmée cette semaine"
                />
            ) : (
                <WeekScheduleGrid sessions={sessions} />
            )}
        </div>
    );
};

export default WeekSchedule;
