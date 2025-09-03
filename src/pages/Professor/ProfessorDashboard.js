import React, { useState } from 'react';
import { Image } from "../../components/atoms";
import user from "../../assets/svg/user.svg";
import { SideBar, Header } from '../../components/organisms';
import { Menu as MenuIcon, X, Calendar, Users, BookOpen, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DashboardGrid, QuickActions } from '../../components/molecules';

const ProfessorDashboard = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    const dashboardCards = [
        {
            title: "Séances du jour",
            description: "Gérez vos cours et prises de présences",
            icon: Calendar,
            onClick: () => navigate("/professor/sessions"),
            color: "bg-blue-500",
            hoverColor: "hover:bg-blue-600"
        },
        {
            title: "Emploi du temps",
            description: "Consultez votre planning de la semaine",
            icon: Clock,
            onClick: () => navigate("/professor/schedule"),
            color: "bg-green-500",
            hoverColor: "hover:bg-green-600"
        },
        {
            title: "Étudiants",
            description: "Gérez les listes d'étudiants",
            icon: Users,
            onClick: () => navigate("/professor/students"),
            color: "bg-purple-500",
            hoverColor: "hover:bg-purple-600"
        },
        {
            title: "Notes",
            description: "Consultez et gérez les notes",
            icon: BookOpen,
            onClick: () => navigate("/professor/grades"),
            color: "bg-orange-500",
            hoverColor: "hover:bg-orange-600"
        }
    ];

    const quickActions = [
        {
            title: "Aujourd'hui",
            description: "Consultez vos séances du jour",
            buttonText: "Voir les séances",
            buttonClassName: "bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors",
            onClick: () => navigate('/professor/sessions')
        },
        {
            title: "Cette semaine",
            description: "Planifiez votre semaine",
            buttonText: "Voir l'emploi du temps",
            buttonClassName: "bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors",
            onClick: () => navigate('/professor/schedule')
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* SIDEBAR */}
            <SideBar />

            {/* HEADER */}
            <Header />

            {/* MAIN CONTENT */}
            <div className="ml-20 p-6">
                <div className="max-w-6xl mx-auto">
                    {/* TITRE */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Dashboard Professeur</h1>
                        <p className="text-gray-600 mt-2">Accédez à vos outils de gestion pédagogique</p>
                    </div>

                    {/* CARTES DE NAVIGATION */}
                    <DashboardGrid cards={dashboardCards} />

                    {/* SECTION RAPIDE */}
                    <div className="mt-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Actions rapides</h2>
                        <QuickActions actions={quickActions} />
                    </div>
                </div>
            </div>

            {/* MOBILE MENU */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setIsMenuOpen(false)}></div>
                    <div className="fixed top-0 left-0 w-64 h-full bg-white shadow-lg">
                        <div className="flex items-center justify-between p-4 border-b">
                            <span className="text-lg font-semibold">Menu</span>
                            <button onClick={() => setIsMenuOpen(false)}>
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        {/* Menu items ici */}
                    </div>
                </div>
            )}

            {/* MOBILE MENU BUTTON */}
            <button
                onClick={() => setIsMenuOpen(true)}
                className="lg:hidden fixed top-4 left-4 z-40 p-2 bg-white rounded-lg shadow-md"
            >
                <MenuIcon className="w-6 h-6" />
            </button>
        </div>
    );
};

export default ProfessorDashboard;
