import { auth } from "@/auth";
import { Appointment } from "./_components/appointment";
import { getUserDoctor } from "@/queries/doctors/get-doctor";

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

  const data = await getUserDoctor(session.user.id);

  if (!data) {
    return <div>Doctor not found</div>;
  }

  return <Appointment id={id} doctorId={data.doctor?.id} />;
};

export default AppointmentPage;
