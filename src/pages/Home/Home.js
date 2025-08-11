import React, {useState} from 'react';
import { Image } from "../../components/atoms";
import user from "../../assets/svg/user.svg";
import { SideBar, GradeGrid, UnjustifiedAbsences, Header, NextDayCourses } from '../../components/organisms';
import { Menu as MenuIcon, X } from 'lucide-react';

const Home = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
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
                <div className='flex flex-col lg:flex-row bg-white px-4 lg:px-8 gap-4'>
                    <GradeGrid
                        grades={[
                            { title: 'Math', score: 85, total: 100 },
                            { title: 'Science', score: 90, total: 100 },
                            { title: 'History', score: 78, total: 100 },
                            { title: 'English', score: 88, total: 100 },
                            { title: 'English', score: 88, total: 100 },
                            { title: 'English', score: 88, total: 100 },
                            { title: 'English', score: 88, total: 100 },
                            { title: 'English', score: 88, total: 100 },
                            { title: 'English', score: 88, total: 100 },
                            { title: 'English', score: 88, total: 100 },
                            { title: 'English', score: 88, total: 100 },
                            { title: 'English', score: 88, total: 100 },
                            { title: 'English', score: 88, total: 100 },
                        ]}
                        className="bg-gray-100 w-full lg:w-3/5"
                    />
                    <div className="flex flex-col w-full lg:w-2/5 px-4 lg:px-20">
                        <NextDayCourses
                            events={[
                                {
                                    id: '1',
                                    title: 'Full Stack',
                                    start: '2025-05-16T08:00:00',
                                    end: '2025-05-16T12:00:00',
                                    extendedProps: {
                                        professor: 'Mme Perez',
                                        location: 'Salle 023',
                                    },
                                },
                                {
                                    id: '2',
                                    title: 'Full Stack',
                                    start: '2025-05-16T16:00:00',
                                    end: '2025-05-16T18:00:00',
                                    extendedProps: {
                                        professor: 'Mme Perez',
                                        location: 'Salle 023',
                                    },
                                },
                            ]}  
                            className="bg-gray-100"
                        />
                        <UnjustifiedAbsences/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;