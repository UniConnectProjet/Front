import React from 'react';
import PropTypes from 'prop-types';
import SessionCard from '../../atoms/SessionCard';
import { EmptyState } from '../../atoms';
import { BookOpen } from 'lucide-react';

const DailySessions = ({ 
    sessions, 
    onRollClick, 
    formatTime,
    isToday = false,
    selectedDateFormatted = "",
    className = "" 
}) => {
    if (sessions.length === 0) {
        return (
            <EmptyState
                icon={BookOpen}
                title={isToday ? 'Aucun cours aujourd&apos;hui' : 'Aucun cours ce jour'}
                description={
                    isToday 
                        ? 'Vous n&apos;avez pas de séances programmées pour aujourd&apos;hui.'
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
                        formatTime={formatTime}
                    />
                ))}
            </div>
        </div>
    );
};

DailySessions.propTypes = {
    sessions: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        course: PropTypes.string.isRequired,
        room: PropTypes.string,
        startAt: PropTypes.string.isRequired,
        endAt: PropTypes.string.isRequired,
        classe: PropTypes.string,
        hasRoll: PropTypes.bool
    })).isRequired,
    onRollClick: PropTypes.func.isRequired,
    formatTime: PropTypes.func.isRequired,
    isToday: PropTypes.bool,
    selectedDateFormatted: PropTypes.string,
    className: PropTypes.string
};

export default DailySessions;
