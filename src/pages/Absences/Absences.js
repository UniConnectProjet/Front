import React from "react";
import { SideBar, InjustifiedAbsences } from "../../components/organisms";

const Absences = () => {
    return (
        <div className="flex">
            <SideBar />
            <div className="flex flex-col w-full h-screen">
                <div className="flex w-full bg-white px-8">
                    <InjustifiedAbsences />
                </div>
            </div>
        </div>
    );
}

export default Absences;