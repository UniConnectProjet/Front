import React from 'react';
import { Clock, MapPin } from 'lucide-react';

const WeekScheduleGrid = ({ sessions, className = "" }) => {
    // Grouper les sessions par jour (sans weekends)
    const groupSessionsByDay = (sessions) => {
        const grouped = {};
        const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
        
        // Initialiser tous les jours
        days.forEach(day => {
            grouped[day] = [];
        });

        sessions.forEach(session => {
            const date = new Date(session.startAt);
            const dayOfWeek = date.getDay();
            
            // Ignorer les weekends
            if (dayOfWeek === 0 || dayOfWeek === 6) {
                return;
            }
            
            const dayName = days[dayOfWeek - 1];
            if (grouped[dayName]) {
                grouped[dayName].push(session);
            }
        });

        // Trier les sessions par heure pour chaque jour
        Object.keys(grouped).forEach(day => {
            grouped[day].sort((a, b) => new Date(a.startAt) - new Date(b.startAt));
        });

        return grouped;
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('fr-FR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    };

    const groupedSessions = groupSessionsByDay(sessions);
    const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];

    return (
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 ${className}`}>
            {days.map(day => (
                <div key={day} className="border rounded-lg p-3">
                    <h4 className="font-medium text-sm text-gray-700 mb-3 border-b pb-2">
                        {day}
                    </h4>
                    <div className="space-y-2">
                        {groupedSessions[day].length === 0 ? (
                            <p className="text-xs text-gray-500 text-center py-2">
                                Aucune séance
                            </p>
                        ) : (
                            groupedSessions[day].map(session => (
                                <div key={session.id} className="bg-blue-50 rounded p-2 text-xs">
                                    <div className="flex items-center mb-1">
                                        <Clock className="h-3 w-3 text-blue-600 mr-1" />
                                        <span className="font-medium">
                                            {formatTime(session.startAt)}
                                        </span>
                                    </div>
                                    <div className="font-medium text-gray-800 mb-1">
                                        {session.course}
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <MapPin className="h-3 w-3 mr-1" />
                                        <span>{session.room || 'Salle TBD'}</span>
                                    </div>
                                    {session.classe && (
                                        <div className="text-gray-600 mt-1">
                                            {session.classe}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default WeekScheduleGrid;
