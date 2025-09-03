import React, { useState, useEffect } from 'react';
import { Image } from "../../components/atoms";
import user from "../../assets/svg/user.svg";
import { SideBar, Header } from '../../components/organisms';
import { Menu as MenuIcon, X, BookOpen } from 'lucide-react';
import { getProfessorSessions } from '../../_services/professor.service';
import { useToast } from '../../components/molecules/ToastProvider/ToastProvider';
import SessionRow from '../../components/organisms/ProfessorDashboard/SessionRow';
import RollModal from '../../components/organisms/ProfessorDashboard/RollModal';
import GradesModal from '../../components/organisms/ProfessorDashboard/GradesModal';
import { DateNavigation, LoadingSpinner, EmptyState } from '../../components/atoms';

const ProfessorSessions = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
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
            console.error('Erreur lors du chargement des séances:', err);
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

    const handleGradesClick = (session) => {
        setSelectedSession(session);
        setModalType('grades');
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
        <div className="min-h-screen bg-gray-50">
            {/* SIDEBAR */}
            <SideBar />

            {/* HEADER */}
            <Header />

            {/* MAIN CONTENT */}
            <div className="ml-20 p-6">
                <div className="max-w-4xl mx-auto">
                    {/* TITRE */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Séances</h1>
                        <p className="text-gray-600 mt-2">Gérez vos cours et prises de présences</p>
                    </div>

                    {/* NAVIGATION PAR DATE */}
                    <DateNavigation
                        selectedDate={selectedDate}
                        onPreviousDay={handlePreviousDay}
                        onNextDay={handleNextDay}
                        onToday={handleToday}
                        isToday={isToday}
                        className="mb-6"
                    />

                    {/* CONTENU PRINCIPAL */}
                    {loading ? (
                        <LoadingSpinner size="large" />
                    ) : error ? (
                        <EmptyState
                            title="Erreur de chargement"
                            description={error}
                            action={
                                <button 
                                    onClick={() => loadSessionsForDate(selectedDate)}
                                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    Réessayer
                                </button>
                            }
                        />
                    ) : sessions.length === 0 ? (
                        <EmptyState
                            icon={BookOpen}
                            title={isToday ? 'Aucun cours aujourd\'hui' : 'Aucun cours ce jour'}
                            description={
                                isToday 
                                    ? 'Vous n\'avez pas de séances programmées pour aujourd\'hui.'
                                    : 'Vous n\'avez pas de séances programmées pour cette date.'
                            }
                        />
                    ) : (
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                {isToday ? 'Cours du jour' : 'Cours du ' + selectedDateFormatted} ({sessions.length})
                            </h2>
                            
                            {sessions.map((session) => (
                                <SessionRow
                                    key={session.id}
                                    session={session}
                                    onRollClick={() => handleRollClick(session)}
                                    onGradesClick={() => handleGradesClick(session)}
                                    formatTime={formatTime}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* MODALS */}
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

            {/* MOBILE MENU */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setIsMenuOpen(false)}></div>
                    <div className="fixed top-0 left-0 w-64 h-full bg-white shadow-lg">
                        <div className="flex items-center justify-between p-4 border-b">
                            <span className="text-lg font-semibold">Menu</span>
                            <button onClick={() => setIsMenuOpen(false)}>
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        {/* Menu items ici */}
                    </div>
                </div>
            )}

            {/* MOBILE MENU BUTTON */}
            <button
                onClick={() => setIsMenuOpen(true)}
                className="lg:hidden fixed top-4 left-4 z-40 p-2 bg-white rounded-lg shadow-md"
            >
                <MenuIcon className="w-6 h-6" />
            </button>
        </div>
    );
};

export default ProfessorSessions;
