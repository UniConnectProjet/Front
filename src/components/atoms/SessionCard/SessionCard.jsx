import React from 'react';
import { Clock, MapPin, Users } from 'lucide-react';

const SessionCard = ({ 
    session, 
    onRollClick, 
    onGradesClick, 
    formatTime,
    className = "" 
}) => {
    const { course, room, startAt, endAt, classe, hasRoll } = session;

    return (
        <div className={`bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow ${className}`}>
            {/* En-tête avec horaires */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center text-blue-600">
                    <Clock className="w-4 h-4 mr-2" />
                    <span className="font-medium">
                        {formatTime(startAt)} - {formatTime(endAt)}
                    </span>
                </div>
                {hasRoll && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                        Présence validée
                    </span>
                )}
            </div>

            {/* Titre du cours */}
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {course}
            </h3>

            {/* Informations de la séance */}
            <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{room || 'Salle TBD'}</span>
                </div>
                {classe && (
                    <div className="flex items-center text-gray-600">
                        <Users className="w-4 h-4 mr-2" />
                        <span>{classe}</span>
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="flex space-x-2">
                <button
                    onClick={() => onRollClick(session)}
                    className={`flex-1 px-3 py-2 rounded-lg font-medium transition-colors ${
                        hasRoll 
                            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                >
                    {hasRoll ? 'Présence validée' : 'Prendre la présence'}
                </button>
                <button
                    onClick={() => onGradesClick(session)}
                    className="flex-1 px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                    Saisir notes
                </button>
            </div>
        </div>
    );
};

export default SessionCard;
