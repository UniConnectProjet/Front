import React from 'react';
import { SideBar, GradeGrid, UnjustifiedAbsences, Header, NextDayCourses } from '../../components/organisms';

const Home = () => {
    return (
        <div className="flex">
            <SideBar />
            <div className="flex flex-col w-full h-screen">
                <Header />
                <div className='flex bg-white px-8'>
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
                        className="bg-gray-100"
                    />
                    <div className="flex flex-col px-20 w-2/5">
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