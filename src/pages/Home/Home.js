import React, {useState, useEffect} from 'react';
import { Image } from "../../components/atoms";
import user from "../../assets/svg/user.svg";
import { SideBar, GradeGrid, UnjustifiedAbsences, Header, NextDayCourses, DailyCourses } from '../../components/organisms';
import { Menu as MenuIcon, X } from 'lucide-react';
import { useAuth } from '../../auth/AuthProvider';
import WeekSchedule from '../../components/organisms/ProfessorDashboard/WeekSchedule';


const Home = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user } = useAuth();

    return (
        <div className="flex">
            {/* SIDEBAR - affichée uniquement si isMenuOpen ou en grand écran */}
            <div className={`
                fixed md:static z-50 bg-white h-screen transition-transform duration-300
                ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
                md:translate-x-0 w-20
            `}>
                <SideBar />
            </div>

            {/* OVERLAY (noir) mobile uniquement */}
            {isMenuOpen && (
                <div
                onClick={() => setIsMenuOpen(false)}
                className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                />
            )}

            {/* CONTENU PRINCIPAL */}
            <div className="flex flex-col w-full h-screen overflow-x-hidden">
                {/* HEADER MOBILE */}
                <div className="md:hidden flex justify-between items-center p-4 bg-white shadow z-30">
                <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? <X size={28} /> : <MenuIcon size={28} />}
                </button>
                <Image src={user} alt="User" className="w-10 h-10 rounded-full mx-auto md:hidden" />

                </div>

                <Header />
                
                {/* Contenu conditionnel selon le rôle */}
                {user?.roles?.includes('ROLE_PROFESSOR') ? (
                    // Interface professeur
                    <div className="flex-1 bg-gray-50 p-4 lg:p-8 overflow-y-auto">
                        <div className="max-w-6xl mx-auto">
                                                            {/* TITRE */}
                                <div className="mb-8">
                                    <h1 className="text-3xl font-bold text-gray-900">Dashboard Professeur</h1>
                                    <p className="text-gray-600 mt-2">Accédez à vos outils de gestion pédagogique</p>
                                </div>

                                {/* COURS DU JOUR */}
                                <div className="mb-8">
                                    <DailyCourses />
                                </div>

                            {/* EMPLOI DU TEMPS DE LA SEMAINE */}
                            <WeekSchedule />
                        </div>
                    </div>
                ) : (
                    // Interface étudiant (comportement par défaut)
                    <div className='flex flex-col lg:flex-row bg-white px-4 lg:px-8 gap-4'>
                        <GradeGrid className="bg-gray-100 w-full lg:w-3/5"/>
                         <div className="flex flex-col w-full lg:w-2/5 px-4 lg:px-20">
                            <NextDayCourses
                                className="bg-gray-100 w-full mb-4"
                            />
                            <UnjustifiedAbsences/>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;