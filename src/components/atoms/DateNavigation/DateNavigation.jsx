import React from 'react';
import PropTypes from 'prop-types';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

const DateNavigation = ({ 
    selectedDate, 
    onPreviousDay, 
    onNextDay, 
    onToday, 
    isToday = false,
    className = "" 
}) => {
    const formatDate = (date) => {
        return date.toLocaleDateString('fr-FR', { 
            weekday: 'long', 
            day: 'numeric', 
            month: 'long' 
        });
    };

    return (
        <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Calendar className="w-5 h-5 text-gray-600" />
                    <span className="text-lg font-medium text-gray-900">
                        {formatDate(selectedDate)}
                    </span>
                    {isToday && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                            Aujourd&apos;hui
                        </span>
                    )}
                </div>
                
                <div className="flex items-center space-x-2">
                    <button
                        onClick={onPreviousDay}
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Jour précédent"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    
                    <button
                        onClick={onToday}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            isToday 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        Aujourd&apos;hui
                    </button>
                    
                    <button
                        onClick={onNextDay}
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Jour suivant"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

DateNavigation.propTypes = {
    selectedDate: PropTypes.instanceOf(Date).isRequired,
    onPreviousDay: PropTypes.func.isRequired,
    onNextDay: PropTypes.func.isRequired,
    onToday: PropTypes.func.isRequired,
    isToday: PropTypes.bool,
    className: PropTypes.string
};

export default DateNavigation;
