import React, { useState, useEffect } from 'react';
import { getProfessorSessions } from '../../../_services/professor.service';
import { useToast } from '../../molecules/ToastProvider/ToastProvider';
import { DateNavigation, LoadingSpinner } from '../../atoms';
import { DailySessions } from '../../molecules';

import RollModal from '../ProfessorDashboard/RollModal';
import GradesModal from '../ProfessorDashboard/GradesModal';

const DailyCourses = ({ className = "" }) => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSession, setSelectedSession] = useState(null);
    const [modalType, setModalType] = useState(null); // 'roll' ou 'grades'
    const [selectedDate, setSelectedDate] = useState(new Date());
    const { push: showToast } = useToast();

    const loadSessionsForDate = async (date) => {
        try {
            setLoading(true);
            setError(null);
            const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
            const data = await getProfessorSessions({ from: dateStr, to: dateStr });
            setSessions(data || []);
        } catch (err) {
            console.error('❌ DailyCourses: Erreur lors du chargement des séances:', err);
            setError('Impossible de charger les séances');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSessionsForDate(selectedDate);
    }, [selectedDate]);

    const handleRollClick = (session) => {
        setSelectedSession(session);
        setModalType('roll');
    };


    const handleModalClose = () => {
        setSelectedSession(null);
        setModalType(null);
    };

    const handleRollSuccess = () => {
        showToast({ text: "Présences enregistrées", type: "success" });
        loadSessionsForDate(selectedDate); // Recharger les données
    };

    const handleGradesSuccess = () => {
        showToast({ text: "Notes enregistrées", type: "success" });
        loadSessionsForDate(selectedDate); // Recharger les données
    };

    const handlePreviousDay = () => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() - 1);
        setSelectedDate(newDate);
    };

    const handleNextDay = () => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() + 1);
        setSelectedDate(newDate);
    };

    const handleToday = () => {
        setSelectedDate(new Date());
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('fr-FR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('fr-FR', { 
            weekday: 'long', 
            day: 'numeric', 
            month: 'long' 
        });
    };

    const isToday = selectedDate.toDateString() === new Date().toDateString();
    const selectedDateFormatted = formatDate(selectedDate);

    return (
        <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
            <h3 className="text-lg font-semibold mb-4">Cours du jour</h3>
            
            {/* Navigation par date */}
            <DateNavigation
                selectedDate={selectedDate}
                onPreviousDay={handlePreviousDay}
                onNextDay={handleNextDay}
                onToday={handleToday}
                isToday={isToday}
                className="mb-6"
            />

            {/* Contenu principal */}
            {loading ? (
                <LoadingSpinner size="medium" text="Chargement des séances..." />
            ) : error ? (
                <div className="text-center py-8">
                    <p className="text-red-600 mb-4">{error}</p>
                    <button 
                        onClick={() => loadSessionsForDate(selectedDate)}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Réessayer
                    </button>
                </div>
            ) : (
                <DailySessions
                    sessions={sessions}
                    onRollClick={handleRollClick}
                    formatTime={formatTime}
                    isToday={isToday}
                    selectedDateFormatted={selectedDateFormatted}
                />
            )}

            {/* Modals */}
            {selectedSession && modalType === 'roll' && (
                <RollModal
                    session={selectedSession}
                    onClose={handleModalClose}
                    onSuccess={handleRollSuccess}
                />
            )}

            {selectedSession && modalType === 'grades' && (
                <GradesModal
                    session={selectedSession}
                    onClose={handleModalClose}
                    onSuccess={handleGradesSuccess}
                />
            )}
        </div>
    );
};

export default DailyCourses;
