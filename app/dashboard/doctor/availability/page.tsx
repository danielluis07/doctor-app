import { auth } from "@/auth";
import { getUserDoctor } from "@/queries/doctors/get-doctor";
import { AvailabilityForm } from "./_components/availability-form";
import { Availabilities } from "./_components/availabilities";

const AvailableDatesPage = async () => {
  const session = await auth();

  if (!session) {
    return <div>Unauthorized</div>;
  }

  const data = await getUserDoctor(session.user.id);

  if (!data) {
    return <div>Doctor not found</div>;
  }

  return (
    <div>
      <AvailabilityForm id={data?.doctor?.id} />
      <Availabilities id={data?.doctor?.id} />
    </div>
  );
};

export default AvailableDatesPage;
