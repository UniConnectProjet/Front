import React from 'react';
import Menu from '../../molecules/Menu/Menu';

const SideBar = () => {
    return (
        <div className="bg-gray-300 w-20 h-screen fixed">
            <Menu />
        </div>
    );
};

export default SideBar;