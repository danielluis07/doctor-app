import { auth } from "@/auth";
import { getUserDoctor } from "@/queries/doctors/get-doctor";
import { NextAppointment } from "../_components/next-appointment";
import { SearchDialog } from "@/components/search-dialog";
import { ClipboardPen, Heart } from "lucide-react";

const DoctorDashboardPage = async () => {
  const session = await auth();

  if (!session) {
    return <div>Unauthorized</div>;
  }

  const data = await getUserDoctor(session.user.id);

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <NextAppointment id={data.doctor?.id} />
        <div className="bg-white p-4 md:p-6 rounded-lg shadow">
          <h2 className="text-lg md:text-xl font-bold mb-4">Ações rápidas</h2>
          <div className="flex flex-col space-y-3 md:space-y-4">
            <SearchDialog />
            <button className="flex items-center justify-center gap-3 text-rose-400 border border-rose-400 px-3 md:px-4 py-2 rounded">
              <Heart />
              Meus Favoritos
            </button>
            <button className="flex items-center justify-center gap-3 text-sky-500 border border-sky-500 px-3 md:px-4 py-2 rounded">
              <ClipboardPen />
              Minhas Anotações
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 md:mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 md:p-6 rounded-lg shadow">
          <h2 className="text-lg md:text-xl font-bold mb-4">Recent Activity</h2>
          <ul className="space-y-4">
            <li className="flex items-center">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-200"></div>
              <div className="ml-3">
                <p className="text-gray-700 font-semibold text-sm md:text-base">
                  Appointment with Dr. [Doctor Name]
                </p>
                <p className="text-gray-500 text-xs md:text-sm">
                  [Date & Time]
                </p>
              </div>
            </li>
          </ul>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-lg shadow">
          <h2 className="text-lg md:text-xl font-bold mb-4">Health Tips</h2>
          <p className="text-gray-700 text-sm md:text-base">
            Stay hydrated and exercise regularly to maintain good health. Check
            our blog for more tips.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboardPage;
