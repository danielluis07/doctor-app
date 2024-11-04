import { auth } from "@/auth";
import { getUserPatient, Patient } from "@/queries/patients/get-patient";
import { FavoriteDoctors } from "./_components/favorite-doctors";

const FavoritesPage = async () => {
  const session = await auth();

  if (!session) {
    return <div>Unauthorized</div>;
  }

  const data: Patient = await getUserPatient(session.user.id);

  if (!data || !data.patient?.id) {
    return <div>Não foi possível carregar as informações dos médicos</div>;
  }

  return <FavoriteDoctors id={data.patient.id} />;
};

export default FavoritesPage;
