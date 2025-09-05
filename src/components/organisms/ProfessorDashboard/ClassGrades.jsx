import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Save, X } from 'lucide-react';
import { getMyClasses, getStudentsByClass, getClassCourses, saveGrades } from '../../../_services/professor.service';
import { useToast } from '../../molecules/ToastProvider/ToastProvider';

const ClassGrades = ({ className = "" }) => {
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [grades, setGrades] = useState({});
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newAssignment, setNewAssignment] = useState({
        title: '',
        maxPoints: 20,
        coefficient: 1,
        date: new Date().toISOString().split('T')[0]
    });
    const { push: showToast } = useToast();

    // Récupérer les classes au chargement
    useEffect(() => {
        loadClasses();
    }, []);

    const loadClasses = async () => {
        try {
            const data = await getMyClasses();
            setClasses(data || []);
        } catch (err) {
            console.error('Erreur lors du chargement des classes:', err);
            showToast({ 
                text: 'Erreur lors du chargement des classes', 
                type: 'error' 
            });
        }
    };

    const loadStudents = async (classId) => {
        try {
            setLoading(true);
            setError(null);
            
            // Charger les étudiants et les cours en parallèle
            const [studentsData, coursesData] = await Promise.all([
                getStudentsByClass(classId),
                getClassCourses(classId)
            ]);
            
            // Extraire les étudiants de la réponse API
            const studentsList = studentsData.students || [];
            setStudents(studentsList);
            
            // Extraire les cours de la réponse API
            const coursesList = coursesData.courses || [];
            setCourses(coursesList);
            
            // Simuler la récupération des devoirs (pour l'instant)
            const mockAssignments = [
                { id: 1, title: 'Devoir 1', maxPoints: 20, coefficient: 1, date: '2025-01-15' },
                { id: 2, title: 'Contrôle', maxPoints: 30, coefficient: 2, date: '2025-01-20' },
            ];
            setAssignments(mockAssignments);
            
            // Initialiser les notes
            const defaultGrades = {};
            studentsList.forEach(student => {
                defaultGrades[student.studentId] = {};
                mockAssignments.forEach(assignment => {
                    defaultGrades[student.studentId][assignment.id] = {
                        score: '',
                        comment: ''
                    };
                });
            });
            setGrades(defaultGrades);
        } catch (err) {
            console.error('Erreur lors du chargement des données:', err);
            setError('Impossible de charger les données');
            showToast({ 
                text: 'Erreur lors du chargement des données', 
                type: 'error' 
            });
        } finally {
            setLoading(false);
        }
    };

    const handleClassChange = (classId) => {
        const selected = classes.find(c => c.id === classId);
        setSelectedClass(selected);
        setSelectedCourse(null); // Reset course selection
        if (classId) {
            loadStudents(classId);
        } else {
            setStudents([]);
            setCourses([]);
            setAssignments([]);
            setGrades({});
        }
    };

    const handleCourseChange = (courseId) => {
        const selected = courses.find(c => c.id === courseId);
        setSelectedCourse(selected);
        // Reset assignments and grades when course changes
        setAssignments([]);
        setGrades({});
    };

    const handleGradeChange = (studentId, assignmentId, field, value) => {
        setGrades(prev => ({
            ...prev,
            [studentId]: {
                ...prev[studentId],
                [assignmentId]: {
                    ...prev[studentId][assignmentId],
                    [field]: value
                }
            }
        }));
    };

    const handleCreateAssignment = () => {
        if (!newAssignment.title.trim()) {
            showToast({ 
                text: 'Le titre du devoir est requis', 
                type: 'error' 
            });
            return;
        }

        const assignment = {
            id: Date.now(), // ID temporaire
            ...newAssignment,
            maxPoints: parseFloat(newAssignment.maxPoints),
            coefficient: parseFloat(newAssignment.coefficient)
        };

        setAssignments(prev => [...prev, assignment]);
        
        // Ajouter des colonnes vides pour tous les étudiants
        setGrades(prev => {
            const newGrades = { ...prev };
            students.forEach(student => {
                if (!newGrades[student.studentId]) {
                    newGrades[student.studentId] = {};
                }
                newGrades[student.studentId][assignment.id] = {
                    score: '',
                    comment: ''
                };
            });
            return newGrades;
        });

        setNewAssignment({
            title: '',
            maxPoints: 20,
            coefficient: 1,
            date: new Date().toISOString().split('T')[0]
        });
        setShowCreateModal(false);
        
        showToast({ 
            text: 'Devoir créé avec succès', 
            type: 'success' 
        });
    };

    const handleSaveGrades = async () => {
        if (!selectedClass) {
            showToast({ 
                text: 'Veuillez sélectionner une classe', 
                type: 'error' 
            });
            return;
        }

        if (!selectedCourse) {
            showToast({ 
                text: 'Veuillez sélectionner un cours', 
                type: 'error' 
            });
            return;
        }

        try {
            setSaving(true);
            
            // Filtrer les notes non vides
            const validGrades = {};
            Object.keys(grades).forEach(studentId => {
                const studentGrades = grades[studentId];
                const validStudentGrades = {};
                
                Object.keys(studentGrades).forEach(assignmentId => {
                    const grade = studentGrades[assignmentId];
                    if (grade.score && grade.score.trim() !== '') {
                        validStudentGrades[assignmentId] = grade;
                    }
                });
                
                if (Object.keys(validStudentGrades).length > 0) {
                    validGrades[studentId] = validStudentGrades;
                }
            });

            if (Object.keys(validGrades).length === 0) {
                showToast({ 
                    text: 'Aucune note à enregistrer', 
                    type: 'warning' 
                });
                return;
            }

            // Enregistrer les notes
            const result = await saveGrades(selectedClass.id, selectedCourse.id, assignments, validGrades);
            
            showToast({ 
                text: result.message || 'Notes enregistrées avec succès', 
                type: 'success' 
            });
            
            console.log('Notes enregistrées:', result.savedGrades);
            
        } catch (err) {
            console.error('Erreur lors de l\'enregistrement:', err);
            showToast({ 
                text: err.response?.data?.error || 'Erreur lors de l\'enregistrement des notes', 
                type: 'error' 
            });
        } finally {
            setSaving(false);
        }
    };

    const calculateClassAverage = (assignmentId) => {
        const assignment = assignments.find(a => a.id === assignmentId);
        if (!assignment) return 0;

        const validGrades = students
            .map(student => {
                const grade = grades[student.studentId]?.[assignmentId];
                return grade?.score ? parseFloat(grade.score) : null;
            })
            .filter(score => score !== null && !isNaN(score));

        if (validGrades.length === 0) return 0;
        
        const sum = validGrades.reduce((acc, score) => acc + score, 0);
        return (sum / validGrades.length).toFixed(1);
    };

    return (
        <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <BookOpen className="w-6 h-6 text-blue-600 mr-3" />
                    <h3 className="text-xl font-semibold text-gray-900">Saisie des notes</h3>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Créer un devoir
                </button>
            </div>

            {/* Sélection de classe */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sélectionner une classe
                </label>
                <select
                    value={selectedClass?.id || ''}
                    onChange={(e) => handleClassChange(parseInt(e.target.value) || null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="">Choisir une classe...</option>
                    {classes.map(classe => (
                        <option key={classe.id} value={classe.id}>
                            {classe.name}
                        </option>
                    ))}
                </select>
                
                {/* Sélection du cours */}
                {selectedClass && courses.length > 0 && (
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Sélectionner un cours
                        </label>
                        <select
                            value={selectedCourse?.id || ''}
                            onChange={(e) => handleCourseChange(parseInt(e.target.value) || null)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Choisir un cours...</option>
                            {courses.map(course => (
                                <option key={course.id} value={course.id}>
                                    {course.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {/* Grille des notes */}
            {selectedClass && selectedCourse && (
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="flex justify-center items-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    ) : error ? (
                        <div className="text-center py-8">
                            <p className="text-red-600 mb-4">{error}</p>
                            <button 
                                onClick={() => loadStudents(selectedClass.id)}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Réessayer
                            </button>
                        </div>
                    ) : students.length === 0 ? (
                        <div className="text-center py-8">
                            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600">Aucun étudiant dans cette classe</p>
                        </div>
                    ) : (
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="mb-4 flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-700">
                                    {students.length} élèves
                                </span>
                                <button
                                    onClick={handleSaveGrades}
                                    disabled={saving}
                                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                                >
                                    <Save className="w-4 h-4" />
                                    {saving ? 'Enregistrement...' : 'Enregistrer'}
                                </button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="border-b border-gray-300">
                                            <th className="text-left py-2 px-3 font-medium text-gray-700 min-w-[200px]">
                                                Étudiant
                                            </th>
                                            {assignments.map(assignment => (
                                                <th key={assignment.id} className="text-center py-2 px-3 font-medium text-gray-700 min-w-[120px]">
                                                    <div className="text-sm">
                                                        <div className="font-semibold">{assignment.title}</div>
                                                        <div className="text-xs text-gray-500">
                                                            /{assignment.maxPoints} (coef. {assignment.coefficient})
                                                        </div>
                                                    </div>
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {students.map(student => (
                                            <tr key={student.studentId} className="border-b border-gray-200">
                                                <td className="py-3 px-3">
                                                    <div>
                                                        <div className="font-medium text-gray-900">
                                                            {student.lastname} {student.name}
                                                        </div>
                                                        <div className="text-sm text-gray-500">{student.email}</div>
                                                    </div>
                                                </td>
                                                {assignments.map(assignment => (
                                                    <td key={assignment.id} className="py-3 px-3">
                                                        <div className="space-y-2">
                                                            <input
                                                                type="number"
                                                                step="0.1"
                                                                min="0"
                                                                max={assignment.maxPoints}
                                                                value={grades[student.studentId]?.[assignment.id]?.score || ''}
                                                                onChange={(e) => handleGradeChange(student.studentId, assignment.id, 'score', e.target.value)}
                                                                placeholder="Note"
                                                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                            />
                                                            <input
                                                                type="text"
                                                                value={grades[student.studentId]?.[assignment.id]?.comment || ''}
                                                                onChange={(e) => handleGradeChange(student.studentId, assignment.id, 'comment', e.target.value)}
                                                                placeholder="Commentaire"
                                                                className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                            />
                                                        </div>
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                        {/* Ligne moyenne de classe */}
                                        <tr className="bg-blue-50 font-semibold">
                                            <td className="py-3 px-3 text-gray-700">
                                                Moy. de la classe
                                            </td>
                                            {assignments.map(assignment => (
                                                <td key={assignment.id} className="py-3 px-3 text-center text-blue-700">
                                                    {calculateClassAverage(assignment.id)}
                                                </td>
                                            ))}
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Modal Créer un devoir */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">Créer un devoir</h3>
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Titre du devoir
                                </label>
                                <input
                                    type="text"
                                    value={newAssignment.title}
                                    onChange={(e) => setNewAssignment(prev => ({ ...prev, title: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Ex: Devoir 1, Contrôle, TP..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Note maximale
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        step="0.1"
                                        value={newAssignment.maxPoints}
                                        onChange={(e) => setNewAssignment(prev => ({ ...prev, maxPoints: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Coefficient
                                    </label>
                                    <input
                                        type="number"
                                        min="0.1"
                                        step="0.1"
                                        value={newAssignment.coefficient}
                                        onChange={(e) => setNewAssignment(prev => ({ ...prev, coefficient: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Date
                                </label>
                                <input
                                    type="date"
                                    value={newAssignment.date}
                                    onChange={(e) => setNewAssignment(prev => ({ ...prev, date: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleCreateAssignment}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Créer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClassGrades;