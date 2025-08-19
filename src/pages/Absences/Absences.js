import React, { useEffect, useState } from "react";
import { Image } from "../../components/atoms";
import user from "../../assets/svg/user.svg";
import { SideBar, InjustifiedAbsences } from "../../components/organisms";
import { Menu, X } from "lucide-react";
import { getMyStudentId } from "../../_services/student.service"; 

export default function Absences() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [studentId, setStudentId] = useState(null);            

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const id = await getMyStudentId(); 
        if (!ignore) setStudentId(id);
      } catch {
        if (!ignore) setStudentId(null);
      }
    })();
    return () => { ignore = true; };
  }, []);

  return (
    <div className="flex">
      <div className={`fixed z-50 md:static transition-transform duration-300 bg-white h-screen
                       ${menuOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 w-20`}>
        <SideBar />
      </div>

      {menuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => setMenuOpen(false)} />
      )}

      <div className="flex flex-col w-full h-screen overflow-x-hidden">
        <div className="md:hidden flex items-center justify-between p-4 bg-white shadow z-30">
          <button onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={28} /> : <Menu size={28} />}</button>
          <Image src={user} alt="User" className="w-10 h-10 rounded-full mx-auto md:hidden" />
        </div>

        <div className="flex flex-col w-full bg-white px-4 md:px-8 mt-4">
          {studentId ? (
            <InjustifiedAbsences studentId={studentId} />
          ) : (
            <p className="text-red-600 text-sm">Aucun identifiant étudiant trouvé — merci de vous reconnecter.</p>
          )}
        </div>
      </div>
    </div>
  );
}