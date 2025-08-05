import React, { useState } from "react";
import { Image } from "../../components/atoms";
import user from "../../assets/svg/user.svg";
import { SideBar, InjustifiedAbsences } from "../../components/organisms";
import { Menu, X } from "lucide-react"; // Ou un autre menu si tu veux

const Absences = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex">
      {/* SIDEBAR RESPONSIVE */}
      <div className={`
        fixed z-50 md:static transition-transform duration-300 bg-white h-screen
        ${menuOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 w-20
      `}>
        <SideBar />
      </div>

      {/* OVERLAY NOIR */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* MAIN CONTENT */}
      <div className="flex flex-col w-full h-screen overflow-x-hidden">
        {/* BARRE SUP MOBILE */}
        <div className="md:hidden flex items-center justify-between p-4 bg-white shadow z-30">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
          <Image src={user} alt="User" className="w-10 h-10 rounded-full mx-auto md:hidden" />
        </div>

        {/* CONTENU */}
        <div className="flex flex-col w-full bg-white px-4 md:px-8 mt-4">
          <InjustifiedAbsences />
        </div>
      </div>
    </div>
  );
};

export default Absences;
