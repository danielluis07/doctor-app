import { auth } from "@/auth";
import { getUserPatient } from "@/queries/patients/get-patient";
import { AppointmentsClient } from "../_components/appointments-client";

const AppointmentPage = async () => {
  const session = await auth();

  if (!session) {
    return <div>Unauthorized</div>;
  }

  const data = await getUserPatient(session.user.id);

  if (!data) {
    return <div>Patient not found</div>;
  }

  return <AppointmentsClient patientId={data?.patient?.id} />;
};

export default AppointmentPage;
