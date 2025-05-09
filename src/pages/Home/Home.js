import React from 'react';
import { SideBar, GradeGrid, UnjustifiedAbsences } from '../../components/organisms';

const Home = () => {
    return (
        <div className="flex">
            <SideBar />
            <div className='flex bg-white p-10 w-full'>
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
                <UnjustifiedAbsences
                    absences={[
                        { title: 'Absence 1', date: '2023-10-01' },
                        { title: 'Absence 2', date: '2023-10-02' },
                        { title: 'Absence 3', date: '2023-10-03' },
                    ]}
                    className="bg-gray-100"
                />
            </div>
        </div>
    );
};

export default Home;