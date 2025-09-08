import React, { useState, useEffect } from 'react';
import { AlertTriangle, Users, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { getProfessorClassView } from '../../../_services/class-student.service';

const ProfessorClassView = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getProfessorClassView();
      setClasses(data);
      if (data.length > 0) {
        setSelectedClass(data[0].classId);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des données:', err);
      setError('Impossible de charger les données');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Bon': return 'text-green-600 bg-green-50';
      case 'Attention': return 'text-yellow-600 bg-yellow-50';
      case 'Problématique': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Bon': return <CheckCircle className="w-4 h-4" />;
      case 'Attention': return <AlertTriangle className="w-4 h-4" />;
      case 'Problématique': return <XCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-600 text-lg mb-4">{error}</p>
        <button 
          onClick={loadData}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Réessayer
        </button>
      </div>
    );
  }

  const currentClass = classes.find(c => c.classId === selectedClass);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Suivi des Absences - Vue Professeur
        </h1>
        <p className="text-gray-600">
          Vue simplifiée pour le suivi pratique de vos cours
        </p>
      </div>

      {/* Sélection de classe */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sélectionner une classe
        </label>
        <select
          value={selectedClass || ''}
          onChange={(e) => setSelectedClass(parseInt(e.target.value))}
          className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {classes.map(classe => (
            <option key={classe.classId} value={classe.classId}>
              {classe.className} ({classe.totalStudents} étudiants)
            </option>
          ))}
        </select>
      </div>

      {currentClass && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* En-tête de la classe */}
          <div className="bg-blue-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Users className="w-5 h-5 text-blue-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">
                  {currentClass.className}
                </h2>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>{currentClass.totalStudents} étudiants</span>
                {currentClass.studentsWithAlerts > 0 && (
                  <span className="flex items-center text-red-600">
                    <AlertTriangle className="w-4 h-4 mr-1" />
                    {currentClass.studentsWithAlerts} alertes
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Tableau des étudiants */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Étudiant
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Absences
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Justifiées
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Non Justifiées
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dernière Absence
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentClass.students.map((student) => (
                  <tr 
                    key={student.studentId} 
                    className={student.hasAlert ? 'bg-red-50' : 'hover:bg-gray-50'}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">
                              {student.studentName.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {student.studentName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {student.studentEmail}
                          </div>
                        </div>
                        {student.hasAlert && (
                          <AlertTriangle className="w-5 h-5 text-red-500 ml-2" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                      {student.totalAbsences}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-green-600">
                      {student.justifiedAbsences}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-red-600">
                      {student.unjustifiedAbsences}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                      <div className="flex items-center justify-center">
                        <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                        {student.lastAbsenceDate}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}>
                        {getStatusIcon(student.status)}
                        <span className="ml-1">{student.status}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Résumé de la classe */}
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
            <div className="flex justify-between text-sm text-gray-600">
              <span>
                Total: {currentClass.students.reduce((sum, s) => sum + s.totalAbsences, 0)} absences
              </span>
              <span>
                Justifiées: {currentClass.students.reduce((sum, s) => sum + s.justifiedAbsences, 0)} | 
                Non justifiées: {currentClass.students.reduce((sum, s) => sum + s.unjustifiedAbsences, 0)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default ProfessorClassView;
