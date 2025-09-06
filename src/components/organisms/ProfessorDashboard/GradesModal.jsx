import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { X, PenTool, Star, Hash } from 'lucide-react';
import { getSessionRoster, saveSessionGrades, getCategories } from '../../../_services/professor.service';
import { useToast } from '../../molecules/ToastProvider/ToastProvider';

const GradesModal = ({ session, onClose, onSuccess }) => {
    const [students, setStudents] = useState([]);
    const [categories, setCategories] = useState([]);
    const [grades, setGrades] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const { push: showToast } = useToast();

    useEffect(() => {
        loadData();
    }, [session.id]);

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Charger les étudiants et les catégories en parallèle
            const [rosterData, categoriesData] = await Promise.all([
                getSessionRoster(session.id),
                getCategories().catch(() => []) // Si les catégories échouent, on continue sans
            ]);
            
            setStudents(rosterData.students || []);
            setCategories(categoriesData || []);
            
            // Initialiser les notes par défaut
            const defaultGrades = {};
            rosterData.students?.forEach(student => {
                defaultGrades[student.studentId] = {
                    score: '',
                    outOf: 20,
                    coefficient: 1,
                    categoryId: null,
                    comment: ''
                };
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

    const handleScoreChange = (studentId, score) => {
        const value = Math.max(0, Math.min(parseFloat(score) || 0, 20));
        setGrades(prev => ({
            ...prev,
            [studentId]: {
                ...prev[studentId],
                score: value
            }
        }));
    };

    const handleOutOfChange = (studentId, outOf) => {
        const value = Math.max(1, parseFloat(outOf) || 20);
        setGrades(prev => ({
            ...prev,
            [studentId]: {
                ...prev[studentId],
                outOf: value
            }
        }));
    };

    const handleCoefficientChange = (studentId, coefficient) => {
        const value = Math.max(0.1, parseFloat(coefficient) || 1);
        setGrades(prev => ({
            ...prev,
            [studentId]: {
                ...prev[studentId],
                coefficient: value
            }
        }));
    };

    const handleCategoryChange = (studentId, categoryId) => {
        setGrades(prev => ({
            ...prev,
            [studentId]: {
                ...prev[studentId],
                categoryId: categoryId ? parseInt(categoryId) : null
            }
        }));
    };

    const handleCommentChange = (studentId, comment) => {
        setGrades(prev => ({
            ...prev,
            [studentId]: {
                ...prev[studentId],
                comment
            }
        }));
    };

    const handleSubmit = async () => {
        try {
            setSaving(true);
            
            const gradesData = students
                .filter(student => {
                    const grade = grades[student.studentId];
                    return grade && grade.score !== '' && grade.score > 0;
                })
                .map(student => {
                    const grade = grades[student.studentId];
                    return {
                        studentId: student.studentId,
                        userId: student.userId,
                        score: parseFloat(grade.score),
                        outOf: parseFloat(grade.outOf),
                        coefficient: parseFloat(grade.coefficient),
                        categoryId: grade.categoryId,
                        comment: grade.comment || null
                    };
                });

            if (gradesData.length === 0) {
                showToast({ 
                    text: 'Aucune note à enregistrer', 
                    type: 'warning' 
                });
                return;
            }

            await saveSessionGrades(session.id, gradesData);
            onSuccess();
        } catch (err) {
            console.error('Erreur lors de l\'enregistrement:', err);
            showToast({ 
                text: 'Erreur lors de l\'enregistrement des notes', 
                type: 'error' 
            });
        } finally {
            setSaving(false);
        }
    };

    const getGradeColor = (score, outOf) => {
        if (!score || score === 0) return 'text-gray-400';
        const percentage = (score / outOf) * 100;
        if (percentage >= 80) return 'text-green-600';
        if (percentage >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getGradePercentage = (score, outOf) => {
        if (!score || score === 0) return 0;
        return Math.round((score / outOf) * 100);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
                {/* HEADER */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center">
                        <PenTool className="w-6 h-6 text-blue-600 mr-3" />
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                Saisir les notes
                            </h2>
                            <p className="text-sm text-gray-600">
                                {session.course} - {session.classe}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* CONTENU */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    ) : error ? (
                        <div className="text-center py-8">
                            <p className="text-red-600 mb-4">{error}</p>
                            <button 
                                onClick={loadData}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Réessayer
                            </button>
                        </div>
                    ) : students.length === 0 ? (
                        <div className="text-center py-8">
                            <PenTool className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600">Aucun étudiant dans cette séance</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {students.map((student) => {
                                const grade = grades[student.studentId] || {};
                                const score = parseFloat(grade.score) || 0;
                                const outOf = parseFloat(grade.outOf) || 20;
                                const percentage = getGradePercentage(score, outOf);
                                
                                return (
                                    <div key={student.studentId} className="bg-gray-50 rounded-lg p-4">
                                        <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 items-start">
                                            {/* INFO ÉTUDIANT */}
                                            <div className="lg:col-span-2">
                                                <h4 className="font-medium text-gray-900 mb-1">
                                                    {student.lastname} {student.name}
                                                </h4>
                                                <p className="text-sm text-gray-600">{student.email}</p>
                                            </div>

                                            {/* NOTE */}
                                            <div className="flex items-center gap-2">
                                                <Star className="w-4 h-4 text-gray-400" />
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="20"
                                                    step="0.1"
                                                    value={grade.score || ''}
                                                    onChange={(e) => handleScoreChange(student.studentId, e.target.value)}
                                                    placeholder="0"
                                                    className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                                <span className="text-sm text-gray-600">/</span>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max="100"
                                                    step="0.1"
                                                    value={grade.outOf || 20}
                                                    onChange={(e) => handleOutOfChange(student.studentId, e.target.value)}
                                                    className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                                {score > 0 && (
                                                    <span className={`text-sm font-medium ${getGradeColor(score, outOf)}`}>
                                                        ({percentage}%)
                                                    </span>
                                                )}
                                            </div>

                                            {/* COEFFICIENT */}
                                            <div className="flex items-center gap-2">
                                                <Hash className="w-4 h-4 text-gray-400" />
                                                <input
                                                    type="number"
                                                    min="0.1"
                                                    max="10"
                                                    step="0.1"
                                                    value={grade.coefficient || 1}
                                                    onChange={(e) => handleCoefficientChange(student.studentId, e.target.value)}
                                                    className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>

                                            {/* CATÉGORIE */}
                                            <div>
                                                <select
                                                    value={grade.categoryId || ''}
                                                    onChange={(e) => handleCategoryChange(student.studentId, e.target.value)}
                                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                >
                                                    <option value="">Aucune catégorie</option>
                                                    {categories.map(category => (
                                                        <option key={category.id} value={category.id}>
                                                            {category.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* COMMENTAIRE */}
                                            <div>
                                                <textarea
                                                    value={grade.comment || ''}
                                                    onChange={(e) => handleCommentChange(student.studentId, e.target.value)}
                                                    placeholder="Commentaire..."
                                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                                    rows="2"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* FOOTER */}
                <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={saving || loading || students.length === 0}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                    >
                        {saving ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Enregistrement...
                            </>
                        ) : (
                            'Enregistrer les notes'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

GradesModal.propTypes = {
    session: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        course: PropTypes.string.isRequired,
        classe: PropTypes.string.isRequired
    }).isRequired,
    onClose: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired
};

export default GradesModal;
