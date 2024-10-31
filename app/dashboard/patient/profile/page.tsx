import { auth } from "@/auth";
import { Profile } from "./_components/profile";
import { getUserPatient, Patient } from "@/queries/patients/get-patient";

const ProfilePage = async () => {
  const session = await auth();

  if (!session) {
    return <div>Unauthorized</div>;
  }

  const data: Patient = await getUserPatient(session.user.id);

  if (!data) {
    return <div>Não foi possível carregar as informações de perfil</div>;
  }

  return <Profile data={data} id={session.user.id} />;
};

export default ProfilePage;
