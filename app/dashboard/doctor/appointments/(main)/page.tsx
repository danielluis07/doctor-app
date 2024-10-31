import { auth } from "@/auth";
import { getUserDoctor } from "@/queries/doctors/get-doctor";
import { AppointmentsClient } from "@/app/dashboard/doctor/appointments/_components/appointments-client";

const AppointmentsPage = async () => {
  const session = await auth();

  if (!session) {
    return <div>Unauthorized</div>;
  }

  const data = await getUserDoctor(session.user.id);

  if (!data) {
    return <div>Doctor not found</div>;
  }

  return <AppointmentsClient doctorId={data.doctor?.id} />;
};

export default AppointmentsPage;
