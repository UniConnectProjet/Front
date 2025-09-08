import React from 'react';
import PropTypes from 'prop-types';
import { Eye, User, Calendar, AlertTriangle } from 'lucide-react';

const TopAbsenteesTable = ({ data }) => {

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-gray-500">
        Aucune donnée disponible
      </div>
    );
  }

  const handleViewDetails = (student) => {
    // TODO: Implémenter l'ouverture du drawer/modal avec les détails
    console.log('View details for student:', student);
  };

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <User className="h-4 w-4 inline mr-1" />
                Étudiant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Classe
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <AlertTriangle className="h-4 w-4 inline mr-1" />
                Total absences
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Justifiées
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Non-justifiées
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <Calendar className="h-4 w-4 inline mr-1" />
                Dernière absence
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((student, index) => (
              <tr key={student.studentId} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {student.studentName} {student.studentLastname}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {student.studentId}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {student.className}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900">
                      {student.totalAbsences}
                    </span>
                    {index < 3 && (
                      <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Top {index + 1}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-green-600 font-medium">
                    {student.justifiedAbsences}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-red-600 font-medium">
                    {student.unjustifiedAbsences}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {student.lastAbsenceDate ? 
                    new Date(student.lastAbsenceDate).toLocaleDateString('fr-FR') : 
                    'N/A'
                  }
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleViewDetails(student)}
                    className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                  >
                    <Eye className="h-4 w-4" />
                    Voir détails
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination ou info sur le nombre d'éléments */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div className="flex-1 flex justify-between sm:hidden">
          <span className="text-sm text-gray-700">
            Affichage de {data.length} élève{data.length > 1 ? 's' : ''}
          </span>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Affichage de <span className="font-medium">{data.length}</span> élève{data.length > 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

TopAbsenteesTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    studentId: PropTypes.number,
    studentName: PropTypes.string,
    studentLastname: PropTypes.string,
    className: PropTypes.string,
    totalAbsences: PropTypes.number,
    justifiedAbsences: PropTypes.number,
    unjustifiedAbsences: PropTypes.number,
    lastAbsenceDate: PropTypes.string
  }))
};

export default TopAbsenteesTable;
