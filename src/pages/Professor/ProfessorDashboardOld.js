import React, { useState } from 'react';
import { Image } from "../../components/atoms";
import user from "../../assets/svg/user.svg";
import { SideBar, Header } from '../../components/organisms';
import { Menu as MenuIcon, X, Calendar, Users, BookOpen, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProfessorDashboard = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

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
            showToast({ 
                text: 'Erreur lors du chargement des séances', 
                type: 'error' 
            });
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
        showToast({ 
            text: 'Présences enregistrées avec succès', 
            type: 'success' 
        });
        // Mise à jour optimiste - marquer la séance comme ayant la présence validée
        setSessions(prev => prev.map(s => 
            s.id === selectedSession.id 
                ? { ...s, hasRoll: true }
                : s
        ));
        handleModalClose();
    };

    const handleGradesSuccess = () => {
        showToast({ 
            text: 'Notes enregistrées avec succès', 
            type: 'success' 
        });
        handleModalClose();
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
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleTimeString('fr-FR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', { 
            weekday: 'long',
            day: 'numeric',
            month: 'long'
        });
    };

    const today = new Date();
    const todayFormatted = today.toLocaleDateString('fr-FR', { 
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    });

    const selectedDateFormatted = selectedDate.toLocaleDateString('fr-FR', { 
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    });

    const isToday = selectedDate.toDateString() === today.toDateString();

    return (
        <div className="flex">
            {/* SIDEBAR */}
            <div className={`
                fixed md:static z-50 bg-white h-screen transition-transform duration-300
                ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
                md:translate-x-0 w-20
            `}>
                <SideBar />
            </div>

            {/* OVERLAY mobile */}
            {isMenuOpen && (
                <div
                    onClick={() => setIsMenuOpen(false)}
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                />
            )}

            {/* CONTENU PRINCIPAL */}
            <div className="flex flex-col w-full h-screen overflow-x-hidden">
                {/* HEADER MOBILE */}
                <div className="md:hidden flex justify-between items-center p-4 bg-white shadow z-30">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X size={28} /> : <MenuIcon size={28} />}
                    </button>
                    <Image src={user} alt="User" className="w-10 h-10 rounded-full mx-auto md:hidden" />
                </div>

                <Header />

                {/* CONTENU DASHBOARD */}
                <div className="flex-1 bg-gray-50 p-4 lg:p-8 overflow-y-auto">
                    <div className="max-w-6xl mx-auto">
                        {/* TITRE */}
                        <div className="mb-6">
                            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                                Dashboard Professeur
                            </h1>
                            
                            {/* NAVIGATION PAR DATE */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center text-gray-600">
                                        <Calendar className="w-5 h-5 mr-2" />
                                        <span className="text-lg font-medium">{selectedDateFormatted}</span>
                                        {isToday && (
                                            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                                Aujourd'hui
                                            </span>
                                        )}
                                    </div>
                                    
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={handlePreviousDay}
                                            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                                            title="Jour précédent"
                                        >
                                            <ChevronLeft className="w-5 h-5" />
                                        </button>
                                        
                                        <button
                                            onClick={handleToday}
                                            className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                                                isToday 
                                                    ? 'bg-blue-600 text-white' 
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                        >
                                            Aujourd'hui
                                        </button>
                                        
                                        <button
                                            onClick={handleNextDay}
                                            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                                            title="Jour suivant"
                                        >
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* CONTENU PRINCIPAL */}
                        {loading ? (
                            <div className="flex justify-center items-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            </div>
                        ) : error ? (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                                <p className="text-red-600 mb-4">{error}</p>
                                <button 
                                    onClick={() => loadSessionsForDate(selectedDate)}
                                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    Réessayer
                                </button>
                            </div>
                        ) : sessions.length === 0 ? (
                            <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    {isToday ? 'Aucun cours aujourd\'hui' : 'Aucun cours ce jour'}
                                </h3>
                                <p className="text-gray-600">
                                    {isToday 
                                        ? 'Vous n\'avez pas de séances programmées pour aujourd\'hui.'
                                        : 'Vous n\'avez pas de séances programmées pour cette date.'
                                    }
                                </p>
                            </div>
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

                {/* EMPLOI DU TEMPS DE LA SEMAINE */}
                <div className="mt-8">
                    <WeekSchedule />
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
        </div>
    );
};

export default ProfessorDashboard;
