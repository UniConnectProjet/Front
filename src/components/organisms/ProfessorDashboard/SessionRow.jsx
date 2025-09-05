import React from 'react';
import { Clock, MapPin, BookOpen, CheckCircle, Users } from 'lucide-react';

const SessionRow = ({ session, onRollClick, formatTime }) => {
    const startTime = formatTime(session.startAt);
    const endTime = formatTime(session.endAt);
    const room = session.room || 'Non spécifiée';
    const course = session.course || 'Cours';
    const classe = session.classe || 'Classe';

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* INFORMATIONS PRINCIPALES */}
                <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                            <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
                            {course}
                        </h3>
                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                            {classe}
                        </span>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            <span>{startTime} - {endTime}</span>
                        </div>
                        <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2" />
                            <span>{room}</span>
                        </div>
                    </div>
                </div>

                {/* ACTIONS */}
                <div className="flex justify-center">
                    {/* BOUTON PRÉSENCE */}
                    <button
                        onClick={onRollClick}
                        className={`
                            flex items-center justify-center px-6 py-2 rounded-lg font-medium transition-colors
                            ${session.hasRoll 
                                ? 'bg-green-100 text-green-700 border border-green-200' 
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            }
                        `}
                    >
                        {session.hasRoll ? (
                            <>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Présence validée
                            </>
                        ) : (
                            <>
                                <Users className="w-4 h-4 mr-2" />
                                Prendre la présence
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SessionRow;
