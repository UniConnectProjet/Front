import React from 'react';
import { SideBar, GradeGrid, UnjustifiedAbsences, Header, NextDayCourses } from '../../components/organisms';

const Home = () => {
    return (
        <div className="flex">
            <SideBar />
            <div className="flex flex-col w-full h-screen">
                <Header />
                <div className='flex bg-white px-8'>
                    <GradeGrid className="bg-gray-100"/>
                    <div className="flex flex-col px-20 w-2/5">
                        <NextDayCourses
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