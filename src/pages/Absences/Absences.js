import React, { useEffect, useState } from "react";
import { Image } from "../../components/atoms";
import user from "../../assets/svg/user.svg";
import { SideBar, InjustifiedAbsences } from "../../components/organisms";
import ProfessorAttendance from "../../components/organisms/ProfessorAttendance/ProfessorAttendance";
import { Menu, X } from "lucide-react";
import { getMyStudentId } from "../../_services/student.service";
import { getMyProfessorId } from "../../_services/professor.service"; 

export default function Absences() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [studentId, setStudentId] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        setLoading(true);
        
        // Essayer de récupérer l'ID étudiant
        try {
          const studentIdResult = await getMyStudentId();
          if (!ignore && studentIdResult) {
            setStudentId(studentIdResult);
            setUserRole('student');
            return;
          }
        } catch (error) {
          // Pas un étudiant, continuer
        }

        // Essayer de récupérer l'ID professeur
        try {
          const professorIdResult = await getMyProfessorId();
          if (!ignore && professorIdResult) {
            setUserRole('professor');
            return;
          }
        } catch (error) {
          // Pas un professeur, continuer
        }

        // Aucun rôle trouvé
        if (!ignore) {
          setUserRole(null);
        }
      } catch (error) {
        if (!ignore) {
          setUserRole(null);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
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
          {loading ? (
            <div className="flex items-center justify-center min-h-screen">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
          ) : userRole === 'student' ? (
            <InjustifiedAbsences studentId={studentId} />
          ) : userRole === 'professor' ? (
            <ProfessorAttendance />
          ) : (
            <div className="flex flex-col items-center justify-center min-h-screen">
              <p className="text-red-600 text-lg mb-4">Aucun rôle utilisateur trouvé</p>
              <p className="text-gray-600 text-sm">Merci de vous reconnecter avec un compte étudiant ou professeur.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}