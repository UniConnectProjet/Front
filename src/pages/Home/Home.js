import React from 'react';
import { SideBar, GradeGrid } from '../../components/organisms';

const Home = () => {
    return (
        <div className="flex">
            <SideBar />
            <GradeGrid
                grades={[
                    { title: 'Math', score: 85, total: 100 },
                    { title: 'Science', score: 90, total: 100 },
                    { title: 'History', score: 78, total: 100 },
                    { title: 'English', score: 88, total: 100 },
                ]}
                className="bg-gray-100"
            />
        </div>
    );
};

export default Home;