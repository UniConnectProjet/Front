import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { BookOpen, Plus, X, Edit3 } from 'lucide-react';
import { getMyClasses, getStudentsByClass, getMyCourses, getCourseClassGrades, createGrade, updateGrade, saveAssignmentsAndGrades } from '../../../_services/professor.service';
import { useToast } from '../../molecules/ToastProvider/ToastProvider';

const ClassGrades = ({ className = "" }) => {
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null);
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [students, setStudents] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [grades, setGrades] = useState({});
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingGrade, setEditingGrade] = useState(null); // {studentId, assignmentId}
    const [newAssignments, setNewAssignments] = useState(new Set()); // IDs des nouveaux devoirs
    const [newAssignment, setNewAssignment] = useState({
        title: '',
        maxPoints: 20,
        coefficient: 1,
        date: new Date().toISOString().split('T')[0]
    });
    const { push: showToast } = useToast();

    const loadClasses = useCallback(async () => {
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
    }, [showToast]);

    // Récupérer les classes au chargement
    useEffect(() => {
        loadClasses();
    }, [loadClasses]);

    const loadStudents = async (classId) => {
        try {
            setLoading(true);
            setError(null);
            
            // Charger les étudiants
            const studentsData = await getStudentsByClass(classId);
            
            // Extraire les étudiants de la réponse API
            const studentsList = studentsData.students || [];
            setStudents(studentsList);
            
            // Charger tous les cours du professeur
            const allCourses = await getMyCourses();
            setCourses(allCourses || []);
            
            // Initialiser les notes vides
            const defaultGrades = {};
            studentsList.forEach(student => {
                defaultGrades[student.studentId] = {};
            });
            setGrades(defaultGrades);
            setAssignments([]);
            
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

    const loadCourseGrades = async (courseId, classId) => {
        try {
            setLoading(true);
            setError(null);
            
            // Charger les notes pour ce cours et cette classe
            const gradesData = await getCourseClassGrades(courseId, classId);
            
            // Transformer les données pour l'affichage
            const controls = gradesData.controls || [];
            
            const transformedAssignments = controls.map(control => ({
                id: `${control.title}_${control.createdAt}`,
                title: control.title,
                maxPoints: control.divisor,
                coefficient: 1, // Par défaut, on peut ajuster plus tard
                date: control.createdAt.split('T')[0],
                average: control.average,
                count: control.count
            }));
            
            setAssignments(transformedAssignments);
            
            // Transformer les notes des étudiants
            const transformedGrades = {};
            // Utiliser les étudiants de l'état local
            students.forEach(student => {
                transformedGrades[student.studentId] = {};
                controls.forEach(control => {
                    const studentGrade = control.grades.find(g => g.studentId === student.studentId);
                    transformedGrades[student.studentId][`${control.title}_${control.createdAt}`] = {
                        score: studentGrade ? studentGrade.grade.toString() : '',
                        comment: studentGrade ? studentGrade.comment || '' : '',
                        gradeId: studentGrade ? studentGrade.id : null
                    };
                });
            });
            
            setGrades(transformedGrades);
            
        } catch (err) {
            console.error('Erreur lors du chargement des notes:', err);
            setError('Impossible de charger les notes');
            showToast({ 
                text: 'Erreur lors du chargement des notes', 
                type: 'error' 
            });
        } finally {
            setLoading(false);
        }
    };

    const handleClassChange = (classId) => {
        const selected = classes.find(c => c.id === classId);
        setSelectedClass(selected);
        setSelectedCourse(null);
        if (classId) {
            loadStudents(classId);
        } else {
            setStudents([]);
            setAssignments([]);
            setGrades({});
            setCourses([]);
        }
    };

    const handleCourseChange = (courseId) => {
        const selected = courses.find(c => c.id === courseId);
        setSelectedCourse(selected);
        if (courseId && selectedClass) {
            loadCourseGrades(courseId, selectedClass.id);
        } else {
            setAssignments([]);
            setGrades({});
        }
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

    const handleEditGrade = (studentId, assignmentId) => {
        setEditingGrade({ studentId, assignmentId });
    };

    const handleCancelEdit = () => {
        setEditingGrade(null);
    };

    const handleSaveSingleGrade = async (studentId, assignmentId) => {
        try {
            setSaving(true);
            const grade = grades[studentId][assignmentId];
            const assignment = assignments.find(a => a.id === assignmentId);
            
            if (!grade.score || grade.score.trim() === '') {
                showToast({ 
                    text: 'Veuillez saisir une note', 
                    type: 'warning' 
                });
                return;
            }

            const gradeData = {
                grade: parseFloat(grade.score),
                dividor: assignment.maxPoints,
                title: assignment.title,
                course: selectedCourse.id,
                studentId: parseInt(studentId)
            };

            if (grade.gradeId) {
                // Mettre à jour une note existante
                await updateGrade(grade.gradeId, gradeData);
            } else {
                // Créer une nouvelle note
                const result = await createGrade(gradeData);
                if (result && result.gradeId) {
                    setGrades(prev => ({
                        ...prev,
                        [studentId]: {
                            ...prev[studentId],
                            [assignmentId]: {
                                ...prev[studentId][assignmentId],
                                gradeId: result.gradeId
                            }
                        }
                    }));
                }
            }

            showToast({ 
                text: 'Note enregistrée avec succès', 
                type: 'success' 
            });
            
            setEditingGrade(null);
            
            // Retirer le devoir de la liste des nouveaux devoirs s'il était nouveau
            setNewAssignments(prev => {
                const newSet = new Set(prev);
                newSet.delete(assignmentId);
                return newSet;
            });
            
            // Recharger les données pour afficher les moyennes mises à jour
            await loadCourseGrades(selectedCourse.id, selectedClass.id);
            
        } catch (err) {
            console.error('Erreur lors de l\'enregistrement:', err);
            showToast({ 
                text: 'Erreur lors de l\'enregistrement de la note', 
                type: 'error' 
            });
        } finally {
            setSaving(false);
        }
    };

    const handleCreateAssignment = async () => {
        if (!newAssignment.title.trim()) {
            showToast({ 
                text: 'Le titre du devoir est requis', 
                type: 'error' 
            });
            return;
        }

        if (!selectedCourse || !selectedClass) {
            showToast({ 
                text: 'Veuillez sélectionner une classe et un cours', 
                type: 'error' 
            });
            return;
        }

        try {
            setSaving(true);
            

            const assignment = {
                id: `${newAssignment.title}_${Date.now()}`,
                title: newAssignment.title,
                maxPoints: parseFloat(newAssignment.maxPoints),
                coefficient: parseFloat(newAssignment.coefficient),
                date: newAssignment.date
            };

            // Ajouter le devoir à la liste locale
            const updatedAssignments = [...assignments, assignment];
            setAssignments(updatedAssignments);
            
            // Marquer ce devoir comme nouveau
            setNewAssignments(prev => new Set([...prev, assignment.id]));
            
            // Ajouter des colonnes vides pour tous les étudiants
            const updatedGrades = { ...grades };
            students.forEach(student => {
                if (!updatedGrades[student.studentId]) {
                    updatedGrades[student.studentId] = {};
                }
                updatedGrades[student.studentId][assignment.id] = {
                    score: '',
                    comment: ''
                };
            });
            setGrades(updatedGrades);

            // Sauvegarder en base de données
            await saveAssignmentsAndGrades(
                selectedClass.id,
                selectedCourse.id,
                updatedAssignments,
                updatedGrades
            );

            setNewAssignment({
                title: '',
                maxPoints: 20,
                coefficient: 1,
                date: new Date().toISOString().split('T')[0]
            });
            setShowCreateModal(false);
            
            showToast({ 
                text: 'Devoir créé et sauvegardé avec succès', 
                type: 'success' 
            });
        } catch (err) {
            console.error('Erreur lors de la création du devoir:', err);
            showToast({ 
                text: 'Erreur lors de la création du devoir', 
                type: 'error' 
            });
        } finally {
            setSaving(false);
        }
    };


    const calculateClassAverage = (assignmentId) => {
        const assignment = assignments.find(a => a.id === assignmentId);
        if (!assignment) return 0;

        // Si on a déjà la moyenne de l'API, l'utiliser
        if (assignment.average !== undefined) {
            return assignment.average.toFixed(1);
        }

        // Sinon, calculer manuellement
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

            {/* Sélection de classe et cours */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
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
                </div>
                
                {selectedClass && (
                    <div>
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
            {selectedClass && (
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
                                <div className="text-sm text-gray-500">
                                    {newAssignments.size > 0 
                                        ? "Saisissez directement les notes pour les nouveaux devoirs" 
                                        : "Cliquez sur l'icône crayon pour éditer une note"
                                    }
                                </div>
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
                                                {assignments.map(assignment => {
                                                    const isEditing = editingGrade?.studentId === student.studentId && editingGrade?.assignmentId === assignment.id;
                                                    const isNewAssignment = newAssignments.has(assignment.id);
                                                    const grade = grades[student.studentId]?.[assignment.id];
                                                    
                                                    return (
                                                        <td key={assignment.id} className="py-3 px-3">
                                                            {isNewAssignment ? (
                                                                // Vue d'édition directe pour les nouveaux devoirs
                                                                <div className="space-y-2">
                                                                    <input
                                                                        type="number"
                                                                        step="0.1"
                                                                        min="0"
                                                                        max={assignment.maxPoints}
                                                                        value={grade?.score || ''}
                                                                        onChange={(e) => handleGradeChange(student.studentId, assignment.id, 'score', e.target.value)}
                                                                        placeholder="Note"
                                                                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                                    />
                                                                    <input
                                                                        type="text"
                                                                        value={grade?.comment || ''}
                                                                        onChange={(e) => handleGradeChange(student.studentId, assignment.id, 'comment', e.target.value)}
                                                                        placeholder="Commentaire"
                                                                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                                    />
                                                                    <div className="flex gap-1">
                                                                        <button
                                                                            onClick={() => handleSaveSingleGrade(student.studentId, assignment.id)}
                                                                            disabled={saving}
                                                                            className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 disabled:opacity-50"
                                                                        >
                                                                            ✓
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            ) : isEditing ? (
                                                                <div className="space-y-2">
                                                                    <input
                                                                        type="number"
                                                                        step="0.1"
                                                                        min="0"
                                                                        max={assignment.maxPoints}
                                                                        value={grade?.score || ''}
                                                                        onChange={(e) => handleGradeChange(student.studentId, assignment.id, 'score', e.target.value)}
                                                                        placeholder="Note"
                                                                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                                    />
                                                                    <input
                                                                        type="text"
                                                                        value={grade?.comment || ''}
                                                                        onChange={(e) => handleGradeChange(student.studentId, assignment.id, 'comment', e.target.value)}
                                                                        placeholder="Commentaire"
                                                                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                                    />
                                                                    <div className="flex gap-1">
                                                                        <button
                                                                            onClick={() => handleSaveSingleGrade(student.studentId, assignment.id)}
                                                                            disabled={saving}
                                                                            className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 disabled:opacity-50"
                                                                        >
                                                                            ✓
                                                                        </button>
                                                                        <button
                                                                            onClick={handleCancelEdit}
                                                                            className="px-2 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600"
                                                                        >
                                                                            ✕
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className="space-y-2">
                                                                    <div className="flex items-center justify-between">
                                                                        <span className="text-sm font-medium">
                                                                            {grade?.score ? `${grade.score}/${assignment.maxPoints}` : '-'}
                                                                        </span>
                                                                        <button
                                                                            onClick={() => handleEditGrade(student.studentId, assignment.id)}
                                                                            className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                                                                            title="Modifier la note"
                                                                        >
                                                                            <Edit3 className="w-4 h-4" />
                                                                        </button>
                                                                    </div>
                                                                    {grade?.comment && (
                                                                        <div className="text-xs text-gray-600 italic">
                                                                            {grade.comment}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </td>
                                                    );
                                                })}
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

ClassGrades.propTypes = {
    className: PropTypes.string
};

export default ClassGrades;