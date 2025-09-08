import React from 'react';
import PropTypes from 'prop-types';
import { Calendar, Filter } from 'lucide-react';

const AttendanceFilters = ({ filters, onFilterChange }) => {
  const handleDateChange = (field, value) => {
    onFilterChange({ [field]: value });
  };

  const handleSelectChange = (field, value) => {
    onFilterChange({ [field]: value === '' ? null : parseInt(value) });
  };

  const handleGroupByChange = (value) => {
    onFilterChange({ groupBy: value });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Période - Date de début */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Calendar className="h-4 w-4 inline mr-1" />
          Date de début
        </label>
        <input
          type="date"
          value={filters.startDate}
          onChange={(e) => handleDateChange('startDate', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Période - Date de fin */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Calendar className="h-4 w-4 inline mr-1" />
          Date de fin
        </label>
        <input
          type="date"
          value={filters.endDate}
          onChange={(e) => handleDateChange('endDate', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* GroupBy */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Filter className="h-4 w-4 inline mr-1" />
          Grouper par
        </label>
        <select
          value={filters.groupBy}
          onChange={(e) => handleGroupByChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="week">Semaine</option>
          <option value="month">Mois</option>
          <option value="semester">Semestre</option>
        </select>
      </div>

      {/* Classe */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Classe
        </label>
        <select
          value={filters.classId || ''}
          onChange={(e) => handleSelectChange('classId', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Toutes les classes</option>
          {/* TODO: Charger les classes depuis l'API */}
          <option value="1">Classe A</option>
          <option value="2">Classe B</option>
          <option value="3">Classe C</option>
        </select>
      </div>

      {/* Cours */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cours
        </label>
        <select
          value={filters.courseId || ''}
          onChange={(e) => handleSelectChange('courseId', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Tous les cours</option>
          {/* TODO: Charger les cours depuis l'API */}
          <option value="1">Mathématiques</option>
          <option value="2">Physique</option>
          <option value="3">Chimie</option>
        </select>
      </div>
    </div>
  );
};

AttendanceFilters.propTypes = {
  filters: PropTypes.shape({
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string.isRequired,
    groupBy: PropTypes.string.isRequired,
    classId: PropTypes.number,
    courseId: PropTypes.number
  }).isRequired,
  onFilterChange: PropTypes.func.isRequired
};

export default AttendanceFilters;
