import React from 'react';
import SessionCard from '../../atoms/SessionCard';
import { EmptyState } from '../../atoms';
import { BookOpen } from 'lucide-react';

const DailySessions = ({ 
    sessions, 
    onRollClick, 
    onGradesClick, 
    formatTime,
    isToday = false,
    selectedDateFormatted = "",
    className = "" 
}) => {
    if (sessions.length === 0) {
        return (
            <EmptyState
                icon={BookOpen}
                title={isToday ? 'Aucun cours aujourd\'hui' : 'Aucun cours ce jour'}
                description={
                    isToday 
                        ? 'Vous n\'avez pas de séances programmées pour aujourd\'hui.'
                        : 'Vous n\'avez pas de séances programmées pour cette date.'
                }
                className={className}
            />
        );
    }

    return (
        <div className={`space-y-4 ${className}`}>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {isToday ? 'Cours du jour' : 'Cours du ' + selectedDateFormatted} ({sessions.length})
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sessions.map((session) => (
                    <SessionCard
                        key={session.id}
                        session={session}
                        onRollClick={onRollClick}
                        onGradesClick={onGradesClick}
                        formatTime={formatTime}
                    />
                ))}
            </div>
        </div>
    );
};

export default DailySessions;
