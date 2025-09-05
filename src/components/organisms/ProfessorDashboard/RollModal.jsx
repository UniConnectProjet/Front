import React, { useState, useEffect } from 'react';
import { X, Users, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { getSessionRoster, getSessionRoll, saveSessionRoll } from '../../../_services/professor.service';
import { useToast } from '../../molecules/ToastProvider/ToastProvider';

const RollModal = ({ session, onClose, onSuccess }) => {
    const [students, setStudents] = useState([]);
    const [attendances, setAttendances] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const { push: showToast } = useToast();

    useEffect(() => {
        loadRoster();
    }, [session.id]);

    const loadRoster = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Charger la liste des étudiants et les absences existantes en parallèle
            const [rosterData, rollData] = await Promise.all([
                getSessionRoster(session.id),
                getSessionRoll(session.id).catch(() => []) // Si pas d'absences, retourner un tableau vide
            ]);
            
            setStudents(rosterData.students || []);
            
            // Créer un map des absences existantes par studentId
            const existingRolls = {};
            if (Array.isArray(rollData)) {
                rollData.forEach(roll => {
                    if (roll.studentId) {
                        existingRolls[roll.studentId] = {
                            status: roll.status || 'PRESENT',
                            minutesLate: roll.minutesLate || 0,
                            justified: roll.justified || false,
                            note: roll.note || ''
                        };
                    }
                });
            }
            
            // Initialiser les présences (existantes ou par défaut)
            const defaultAttendances = {};
            rosterData.students?.forEach(student => {
                defaultAttendances[student.studentId] = existingRolls[student.studentId] || {
                    status: 'PRESENT',
                    minutesLate: 0,
                    justified: false,
                    note: ''
                };
            });
            setAttendances(defaultAttendances);
        } catch (err) {
            console.error('Erreur lors du chargement des données:', err);
            setError('Impossible de charger les données de la séance');
            showToast({ 
                text: 'Erreur lors du chargement des données', 
                type: 'error' 
            });
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = (studentId, status) => {
        setAttendances(prev => ({
            ...prev,
            [studentId]: {
                ...prev[studentId],
                status,
                minutesLate: status === 'LATE' ? prev[studentId]?.minutesLate || 5 : 0
            }
        }));
    };

    const handleMinutesLateChange = (studentId, minutes) => {
        const value = Math.max(0, parseInt(minutes) || 0);
        setAttendances(prev => ({
            ...prev,
            [studentId]: {
                ...prev[studentId],
                minutesLate: value
            }
        }));
    };

    const handleJustifiedChange = (studentId, justified) => {
        setAttendances(prev => ({
            ...prev,
            [studentId]: {
                ...prev[studentId],
                justified
            }
        }));
    };

    const handleNoteChange = (studentId, note) => {
        setAttendances(prev => ({
            ...prev,
            [studentId]: {
                ...prev[studentId],
                note
            }
        }));
    };

    const handleSubmit = async () => {
        try {
            setSaving(true);
            
            const attendanceData = students.map(student => ({
                studentId: student.studentId,
                userId: student.userId,
                ...attendances[student.studentId]
            }));

            await saveSessionRoll(session.id, attendanceData);
            onSuccess();
        } catch (err) {
            console.error('Erreur lors de l\'enregistrement:', err);
            showToast({ 
                text: 'Erreur lors de l\'enregistrement des présences', 
                type: 'error' 
            });
        } finally {
            setSaving(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'PRESENT':
                return <CheckCircle className="w-5 h-5 text-green-600" />;
            case 'ABSENT':
                return <XCircle className="w-5 h-5 text-red-600" />;
            case 'LATE':
                return <AlertCircle className="w-5 h-5 text-yellow-600" />;
            default:
                return <CheckCircle className="w-5 h-5 text-gray-400" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PRESENT':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'ABSENT':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'LATE':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                {/* HEADER */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center">
                        <Users className="w-6 h-6 text-blue-600 mr-3" />
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                                Prendre la présence
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
                                onClick={loadRoster}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Réessayer
                            </button>
                        </div>
                    ) : students.length === 0 ? (
                        <div className="text-center py-8">
                            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600">Aucun étudiant dans cette séance</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {students.map((student) => {
                                const attendance = attendances[student.studentId] || {};
                                const status = attendance.status || 'PRESENT';
                                
                                return (
                                    <div key={student.studentId} className="bg-gray-50 rounded-lg p-4">
                                        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                                            {/* INFO ÉTUDIANT */}
                                            <div className="flex-1">
                                                <h4 className="font-medium text-gray-900">
                                                    {student.lastname} {student.name}
                                                </h4>
                                                <p className="text-sm text-gray-600">{student.email}</p>
                                            </div>

                                            {/* STATUT */}
                                            <div className="flex flex-col sm:flex-row gap-3">
                                                {/* BOUTONS STATUT */}
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleStatusChange(student.studentId, 'PRESENT')}
                                                        className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
                                                            status === 'PRESENT' 
                                                                ? 'bg-green-100 text-green-800 border-green-200' 
                                                                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                                        }`}
                                                    >
                                                        Présent
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusChange(student.studentId, 'ABSENT')}
                                                        className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
                                                            status === 'ABSENT' 
                                                                ? 'bg-red-100 text-red-800 border-red-200' 
                                                                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                                        }`}
                                                    >
                                                        Absent
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusChange(student.studentId, 'LATE')}
                                                        className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
                                                            status === 'LATE' 
                                                                ? 'bg-yellow-100 text-yellow-800 border-yellow-200' 
                                                                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                                        }`}
                                                    >
                                                        Retard
                                                    </button>
                                                </div>

                                                {/* MINUTES DE RETARD */}
                                                {status === 'LATE' && (
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="w-4 h-4 text-gray-400" />
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            max="120"
                                                            value={attendance.minutesLate || 0}
                                                            onChange={(e) => handleMinutesLateChange(student.studentId, e.target.value)}
                                                            className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        />
                                                        <span className="text-sm text-gray-600">min</span>
                                                    </div>
                                                )}

                                                {/* JUSTIFIÉ */}
                                                <label className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={attendance.justified || false}
                                                        onChange={(e) => handleJustifiedChange(student.studentId, e.target.checked)}
                                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                    />
                                                    <span className="text-sm text-gray-600">Justifié</span>
                                                </label>
                                            </div>
                                        </div>

                                        {/* NOTE */}
                                        <div className="mt-3">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Note (optionnelle)
                                            </label>
                                            <textarea
                                                value={attendance.note || ''}
                                                onChange={(e) => handleNoteChange(student.studentId, e.target.value)}
                                                placeholder="Commentaire sur l'absence ou le retard..."
                                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                                rows="2"
                                            />
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
                            'Enregistrer les présences'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RollModal;
