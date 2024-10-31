import { auth } from "@/auth";
import { DoctorProfile } from "./_components/doctor-profile";
import { DoctorReviews } from "./_components/doctor-reviews";
import { getDoctor } from "@/queries/doctors/get-doctor";
import { ReviewForm } from "./_components/review-form";
import { DoctorAvailability } from "./_components/doctor-availability";
import { AppointmentForm } from "./_components/appointment-form";
import { getUserPatient } from "@/queries/patients/get-patient";

const DoctorPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const session = await auth();
  const id = (await params).id;

  if (!session) {
    return <div>Unauthorized</div>;
  }

  const data = await getDoctor(id);

  const patientData = await getUserPatient(session.user.id);

  if (!data) {
    return <div>Doctor not found</div>;
  }

  return (
    <div className="w-full relative">
      <DoctorProfile data={data} />
      <DoctorAvailability doctorId={data.doctor?.id} />
      <ReviewForm doctorId={data.doctor?.id} userId={session?.user.id} />
      <DoctorReviews doctorId={id} />
      <AppointmentForm data={data} patientId={patientData?.patient?.id} />
    </div>
  );
};

export default DoctorPage;
