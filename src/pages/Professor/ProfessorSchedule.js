import React, { useState, useEffect } from 'react';
import { Image } from "../../components/atoms";
import user from "../../assets/svg/user.svg";
import { SideBar, Header } from '../../components/organisms';
import { Menu as MenuIcon, X } from 'lucide-react';
import WeekSchedule from '../../components/organisms/ProfessorDashboard/WeekSchedule';

const ProfessorSchedule = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* SIDEBAR */}
            <SideBar />

            {/* HEADER */}
            <Header />

            {/* MAIN CONTENT */}
            <div className="ml-20 p-6">
                <div className="max-w-7xl mx-auto">
                    {/* TITRE */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Emploi du temps</h1>
                        <p className="text-gray-600 mt-2">Consultez votre planning de la semaine</p>
                    </div>

                    {/* EMPLOI DU TEMPS DE LA SEMAINE */}
                    <WeekSchedule />
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

export default ProfessorSchedule;
