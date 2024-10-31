import { auth } from "@/auth";
import { Appointment } from "./_components/appointment";
import { getUserPatient } from "@/queries/patients/get-patient";

const AppointmentPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const session = await auth();
  const id = (await params).id;

  if (!session) {
    return <div>Unauthorized</div>;
  }

  const data = await getUserPatient(session.user.id);

  if (!data) {
    return <div>Patient not found</div>;
  }

  return <Appointment id={id} patientId={data?.patient?.id} />;
};

export default AppointmentPage;
